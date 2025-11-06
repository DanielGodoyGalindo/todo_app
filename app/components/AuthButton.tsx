"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    // https://next-auth.js.org/getting-started/client#usesession
    const { data: session, status } = useSession();

    // Show loading message
    if (status === "loading") {
        return <button className="px-3 py-1 bg-gray-300 rounded">Loading...</button>;
    }

    // Not logged in
    if (!session) {
        return (
            <button
                onClick={() => signIn("github")}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
            >
                Login with GitHub
            </button>
        );
    }

    // User logged in
    return (
        <div className="flex items-center gap-3">
            <p className="text-sm text-gray-700">Hola, {session.user?.name}</p>
            <button
                onClick={() => signOut()}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
                Logout
            </button>
        </div>
    );
}