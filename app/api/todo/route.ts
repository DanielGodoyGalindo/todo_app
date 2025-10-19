import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Task from '@/models/Task'

// https://nextjs.org/docs/app/api-reference/file-conventions/route
// https://nextjs.org/docs/app/api-reference/functions/next-response#json

// Get [a task | all tasks]
export async function GET(req: Request) {
    try {
        await connectToDB();
        // Get a task
        // https://nextjs.org/docs/app/api-reference/file-conventions/route#url-query-parameters
        // https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (id) {
            const task = await Task.findById(id);
            return NextResponse.json(task);
        }
        // Get all tasks
        const tasks = await Task.find({})
        return NextResponse.json(tasks)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 })
    }
}

// Create task
export async function POST(req: Request) {
    try {
        const data = await req.json();
        await connectToDB();
        const task = await Task.create(data);
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
    }
}

// Update task
export async function PATCH(req: Request) {
    try {
        const data = await req.json();
        await connectToDB();
        // https://medium.com/@turingvang/next-js-mongodb-crud-example-b6e8f327a2af
        // https://www.w3schools.com/nodejs/nodejs_mongodb_update.asp
        await Task.updateOne(
            { _id: data.id }, // Filter: find the task document by its unique _id
            { $set: { isCompleted: data.isCompleted } } // Update: set the isCompleted field to the new value
        );
        return NextResponse.json({ message: "Task updated" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error updating task" }, { status: 500 });
    }
}

// Delete task
export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        await connectToDB();
        await Task.deleteOne(
            { _id: data.id }
        );
        return NextResponse.json({ message: "Task deleted" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error deleting task" });
    }
}