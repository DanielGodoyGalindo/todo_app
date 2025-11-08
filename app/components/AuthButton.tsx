"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    // https://next-auth.js.org/getting-started/client#usesession
    const { data: session, status } = useSession();

    // Show loading message
    if (status === "loading") {
        return (
            <div className="flex items-center gap-3 justify-end pr-6">
                <button className="px-3 py-1 bg-gray-300 rounded">Loading...</button>
            </div>
        );
    }

    // Not logged in
    if (!session) {
        return (
            <div className="flex items-center gap-3 justify-end pr-6">
                <button
                    onClick={() => signIn("github")}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded hover:cursor-pointer transition-colors duration-300 ease-in-out">
                    Login with GitHub
                </button>
            </div>
        );
    }

    // User logged in
    return (
        <div className="flex items-center gap-3 justify-end pr-6">
            <p className="text-sm text-gray-700">Hola, {session.user?.name}</p>
            <button
                onClick={() => signOut()}
                className="px-3 py-1 bg-red-500 hover:bg-red-800 text-white rounded hover:cursor-pointer transition-colors duration-300 ease-in-out">
                Logout
            </button>
        </div>
    );
}