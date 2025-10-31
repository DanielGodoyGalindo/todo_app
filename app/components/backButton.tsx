"use client";

import Link from "next/link";

export default function BackButton() {

    return (
        <div className="text-center mb-6 hover:underline text-2xl text-white bg-black p-3.5">
            <Link href={"/"}>← Back to Utility Hub</Link>
        </div>
    );
}
