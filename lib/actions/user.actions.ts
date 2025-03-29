'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { cookies } from "next/headers";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from '@/lib/plaid';
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { revalidatePath } from "next/cache";

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo=async({userId}:getUserInfoProps)=>{
    try {
        const {database} = await createAdminClient();
        const user= await database.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal('userId',[userId])]
        )
        
        return parseStringify(user?.documents?.[0]);
            } catch (e) {
                console.log('Error !!!!!!!!!!!',e)
            }
}

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
         
        const user = await getUserInfo({
            userId:session?.userId
        })
        
        return parseStringify(user);
    } catch (e) {
        console.error("SignIn error:", e);
        throw new Error("Failed to sign in. Please check your credentials and try again.");
    }
};

export const signUp = async ({ password, ...data }: SignUpParams) => {
    const { email, firstName, lastName } = data;
    let newUserAccount;

    try {

        const { account, database } = await createAdminClient();

        newUserAccount = await account.create(
            ID.unique(), email, password, `${firstName} ${lastName}`
        );

        console.log('NEW USER ACCOUNT', newUserAccount);

        if (!newUserAccount) {
            throw new Error('Error creating user')
        }

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...data,
            type: 'personal'
        })

        if (!dwollaCustomerUrl) {
            throw new Error('Error creating dwolla customer');
        }

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...data,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }
        )

        console.log('SIGN IN_ NEW USER..........',newUser);

        const session = await account.createEmailPasswordSession(email, password);
        console.log('SESSION...',session);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUser);
    } catch (e) {
        console.error("Signup error:", e);
        console.error("Full error details:", JSON.stringify(e, null, 2));
        throw new Error("Failed to sign up. Please try again.");
    }
};



export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const result = await account.get();

        const user = await getUserInfo({userId:result?.$id})


        console.log("Fetched user:", user); // Debugging
        return parseStringify(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}


export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();
        await account.deleteSession("current"); // Logs out user
        (await cookies()).delete("appwrite-session");
    } catch (e) {
        console.error("Logout error:", e);
        return null;
    }
};


export const createLinkToken = async (user: User) => {
    try {

        console.log('User is........', user);

        const tokenParams = {
            user: {
                client_user_id: user?.$id?.toString()
            },
            client_name: user?.name || `${user?.firstName} ${user?.lastName}`,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US'] as CountryCode[],
        }



        console.log("Token Params", tokenParams);

        const response = await plaidClient.linkTokenCreate(tokenParams);

        console.log("Token Params:", tokenParams);

        return parseStringify({ linkToken: response?.data?.link_token })

    } catch (e: any) {
        console.log('Error', e?.response?.data);
    }
}

export const createBankAccount = async ({

    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient();
        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(), {
            userId,
            bankId,
            accountId,
            accessToken,
            fundingSourceUrl,
            shareableId,
        }
        );

        console.log('Linked Bank account',bankAccount)

        return parseStringify(bankAccount);
    } catch (e) {
        console.log('Error creating bank account',e)
    }
}

export const exchangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,

        })
        const accessToken = response?.data?.access_token;
        const itemId = response?.data?.item_id;

        const accountResponse = await plaidClient.accountsGet({
            access_token: accessToken
        });


        const accountData = accountResponse?.data?.accounts?.[0];

        // Create a processor token for Dwolla using the access token and account ID
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        // If the funding source URL is not created, throw an error
        if (!fundingSourceUrl) throw Error;

        // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id),
        });

        // Revalidate the path to reflect the changes
        revalidatePath("/");

        // Return a success message
        return parseStringify({
            publicTokenExchange: "complete",
        });

    } catch (e) {
        console.log('Error', e)
    }
}


export const getBanks = async ({ userId }: getBanksProps) => {
    try {
const {database} = await createAdminClient();
const banks= await database.listDocuments(
    DATABASE_ID!,
    BANK_COLLECTION_ID!,
    [Query.equal('userId',[userId])]
)

console.log('Banks.... \n\n',banks)

return parseStringify(banks?.documents);
    } catch (e) {
        console.log(e)
    }
} 

export const getBank = async ({ documentId }: getBankProps) => {
    try {
      const { database } = await createAdminClient();
  
      if (!documentId) {
        throw new Error("Invalid documentId");
    }
      const bank = await database.listDocuments(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        [Query.equal('userId', [documentId])]
      )

      const _bank = await database.listDocuments(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        [Query.equal('userId', [documentId])]
      )

      console.log('Bank in DB',bank,_bank)
  
      return parseStringify(bank.documents[0]);
    } catch (error) {
      console.log('Error while fetchibng bank',error)
    }
  }