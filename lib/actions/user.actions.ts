'use server';

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

export const signIn = async ({email,password}:signInProps) => {
    try {
        const { account } = await createAdminClient();
        const res= await account.createEmailPasswordSession(email , password);
        if(res){
            return parseStringify(res);
        }

    } catch (e) {
        console.log(e)
    }
}

export const signUp = async (data : SignUpParams) => {
    try {
        const {email,password,firstName,lastName} = data;
        const { account } = await createAdminClient();

       const newUserAccount = await account.create(
        ID.unique(), email, password, `${firstName} ${lastName}`);
        const session = await account.createEmailPasswordSession(email, password);
      
        (await cookies()).set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        return parseStringify(newUserAccount);
    } catch (e) {
        console.log(e)
    }
}


export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const user =  await account.get();
      return parseStringify(user);
    } catch (error) {
      return null;
    }
  }

  export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();
        await account.deleteSession("current");

        const cookieStore = await cookies(); // Resolve the promise
        cookieStore.set("appwrite-session", "", { 
            path: "/", 
            httpOnly: true, 
            sameSite: "strict", 
            secure: true, 
            maxAge: 0 
        });

        return true;
    } catch (e) {
        console.error(e);
        return null;
    }
};

  