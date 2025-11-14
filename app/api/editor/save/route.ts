import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { title, content } = await req.json();
    return NextResponse.json({ success: true, received: content });
}