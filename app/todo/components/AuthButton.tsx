"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (!session)
    return (
      <button onClick={() => signIn("github")}>
        Login with GitHub
      </button>
    );

  return (
    <div>
      <p>Logged in as: {session.user?.email}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}