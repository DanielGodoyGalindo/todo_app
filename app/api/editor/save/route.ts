import { NextResponse } from "next/server";
import { connectToDB } from '@/lib/mongodb'
import * as z from "zod";
import { getServerSession } from "next-auth";
import Note from "@/models/Note";

// Using Zod to validate data
// https://zod.dev/basics
const editorSchema = z.object({
    title: z.string().min(1, "Text is required"),
    content: z.string().nonempty()
});

export async function POST(req: Request) {
    try {
        // Check session
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }
        // Get usermail
        const userEmail = session.user?.email;
        if (!userEmail) {
            return NextResponse.json(
                { error: "Invalid session" },
                { status: 400 }
            );
        }
        const data = await req.json();
        const validation = editorSchema.safeParse(data);
        if (!validation.success) {
            const errors = validation.error.issues.map((i) => i.message);
            return NextResponse.json({ errors }, { status: 400 });
        }
        const validatedData = validation.data;
        await connectToDB();
        const userEditor = await Note.findOneAndUpdate( // Using Note mongoose model (data from frontend + userEmail)
            { userEmail },
            { ...validatedData },
            { new: true, upsert: true }
        ); 
        return NextResponse.json(userEditor, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error saving changes' }, { status: 500 });
    }
}