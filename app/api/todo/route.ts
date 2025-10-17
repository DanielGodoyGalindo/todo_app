import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Task from '@/models/Task'

// https://nextjs.org/docs/app/api-reference/file-conventions/route

// Get all tasks
export async function GET() {
  try {
    await connectToDB()
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
    const data = await req.json()
    await connectToDB()
    const task = await Task.create(data)
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error creating task' }, { status: 500 })
  }
}