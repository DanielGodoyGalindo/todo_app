"use client";

// https://next-auth.js.org/getting-started/client#sessionprovider
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}