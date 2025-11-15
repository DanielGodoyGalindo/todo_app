import { NextResponse } from "next/server";
import { connectToDB } from '@/lib/mongodb'
import * as z from "zod";
import { getServerSession } from "next-auth";
import Note from "@/models/Note";

// Using Zod to validate data
// https://zod.dev/basics
const editorSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, "Text is required"),
    content: z.string().min(1, "Content is required")
});

async function requireAuth() {
    const session = await getServerSession();
    // Check session
    if (!session) {
        return { error: true, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    // Get usermail
    const email = session.user?.email;
    if (!email) {
        return { error: true, response: NextResponse.json({ error: "Invalid session" }, { status: 400 }) };
    }
    return { error: false, email };
}

export async function GET(req: Request) {
    try {
        // Auth
        const auth = await requireAuth();
        if (auth.error)
            return auth.response;

        await connectToDB();
        // https://mongoosejs.com/docs/api/model.html#Model.findOne()
        const note = await Note.findOne({ userEmail: auth.email });
        if (!note) {
            const newNote = await Note.create({
                userEmail: auth.email,
                title: "Untitled",
                content: "<p></p>"
            });
            return NextResponse.json(newNote, { status: 201 });
        }
        return NextResponse.json(note, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error retrieving note' }, { status: 500 });
    }
}



export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.error)
            return auth.response;

        const data = await req.json();
        const validation = editorSchema.safeParse(data);
        if (!validation.success) {
            const errors = validation.error.issues.map((i) => i.message);
            return NextResponse.json({ errors }, { status: 400 });
        }
        const { _id, title, content } = validation.data;
        await connectToDB();
        // https://mongoosejs.com/docs/api/model.html#Model.findOneAndUpdate()
        const updatedNote = await Note.findOneAndUpdate(
            { _id: _id ?? undefined, userEmail: auth.email }, // filter
            { title, content, userEmail: auth.email }, // update
            { new: true, upsert: true } // options
        );
        return NextResponse.json(updatedNote, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: 'Error saving changes' }, { status: 500 });
    }
}
