import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Task from '@/models/Task'
import * as z from "zod";
import { getServerSession } from "next-auth";

// Using Zod to validate data
// https://zod.dev/basics
const CreateTaskSchema = z.object({
    text: z.string().min(1, "Text is required"),
    isCompleted: z.boolean().default(false),
});

const UpdateTaskSchema = z.object({
    id: z.string().min(1, "Missing task ID"),
    text: z.string().min(1).optional(),
    isCompleted: z.boolean().optional(),
});

const IdTaskSchema = z.object({
    id: z.string().regex(/^[a-fA-F\d]{24}$/, "Invalid MongoDB ObjectId")
});

// https://nextjs.org/docs/app/api-reference/file-conventions/route
// https://nextjs.org/docs/app/api-reference/functions/next-response#json

// Get [a task | all tasks]
export async function GET(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        };
        const userEmail = session.user!.email;
        if (!userEmail) {
            return NextResponse.json(
                { error: "Invalid session" },
                { status: 400 }
            );
        }
        await connectToDB();

        // Get a task
        // https://nextjs.org/docs/app/api-reference/file-conventions/route#url-query-parameters
        // https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
        const { searchParams } = new URL(req.url); // Get url
        const id = searchParams.get("id"); // Get id from url
        if (id) {
            const validation = IdTaskSchema.safeParse({ id }); // Using Zod
            if (!validation.success) {
                const errors = validation.error.issues.map((i) => i.message);
                return NextResponse.json({ errors }, { status: 400 });
            }
            const task = await Task.findOne({ _id: validation.data.id, userEmail });
            if (!task) {
                return NextResponse.json({ message: "Task not found" }, { status: 404 });
            }
            return NextResponse.json(task);
        }
        // Get all tasks
        const tasks = await Task.find({ userEmail });
        return NextResponse.json(tasks)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 })
    }
}

// Create task
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
        // Get data
        const data = await req.json();
        // Validation using Zod
        const validation = CreateTaskSchema.safeParse(data);
        if (!validation.success) {
            const errors = validation.error.issues.map((i) => i.message);
            return NextResponse.json({ errors }, { status: 400 });
        }
        const validatedData = validation.data; // Get data from Zod
        await connectToDB(); // Connect to DB
        // Limit posting tasks (5 max per user)
        const count = await Task.countDocuments({ userEmail });
        if (count >= 5) {
            return NextResponse.json(
                { error: "Task limit per user reached (5 max)" },
                { status: 403 }
            );
        }
        const newTask = await Task.create({ ...validatedData, userEmail }); // Insert usermail
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
    }
}

// Update task
export async function PATCH(req: Request) {
    try {
        //Check session and usermail
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const userEmail = session.user?.email;
        if (!userEmail) {
            return NextResponse.json(
                { error: "Invalid session" },
                { status: 400 }
            );
        }
        // Get data + Zod validation
        const data = await req.json();
        const validation = UpdateTaskSchema.safeParse(data); // Using Zod
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.issues }, { status: 400 });
        }
        const validatedData = validation.data;
        // DB connection
        await connectToDB();
        // https://medium.com/@turingvang/next-js-mongodb-crud-example-b6e8f327a2af
        // https://www.w3schools.com/nodejs/nodejs_mongodb_update.asp
        const result = await Task.updateOne(
            { _id: validatedData.id, userEmail }, // Filter: find the task document by its unique _id
            { $set: { isCompleted: validatedData.isCompleted } } // Update: set the isCompleted field to the new value
        );
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Task not found or unauthorized" },
                { status: 404 }
            );
        }
        return NextResponse.json({ message: "Task updated" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error updating task" }, { status: 500 });
    }
}

// Delete task
// https://dev.to/spencerlepine/get-post-put-delete-with-nextjs-app-router-5do0
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const userEmail = session.user?.email;
        if (!userEmail) {
            return NextResponse.json(
                { error: "Invalid session" },
                { status: 400 }
            );
        }
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ message: "Missing task ID" }, { status: 400 });
        }
        const validation = IdTaskSchema.safeParse({ id }); // Zod
        if (!validation.success) {
            const errors = validation.error.issues.map((i) => i.message);
            return NextResponse.json({ errors }, { status: 400 });
        }
        await connectToDB();
        // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()
        const deletedTask = await Task.findByIdAndDelete({ _id: validation.data.id, userEmail });
        if (!deletedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Task deleted" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error deleting task" }, { status: 500 });
    }
}