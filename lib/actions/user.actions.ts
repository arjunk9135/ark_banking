'use server';

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

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

        return true;
        // return parseStringify(newUserAccount);
    } catch (e) {
        console.error("SignIn error:", e);
        throw new Error("Failed to sign in. Please check your credentials and try again.");
    }
};

export const signUp = async (data: SignUpParams) => {
    try {
        const { email, password, firstName, lastName } = data;
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(), email, password, `${firstName} ${lastName}`
        );

        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUserAccount);
    } catch (e) {
        console.error("Signup error:", e);
        throw new Error("Failed to sign up. Please try again.");
    }
};



export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();
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

  