'use client'; // Ensure that this is a Client Component (only rendered in Client Side)

import { useState } from "react"


export interface TaskInterface {
    _id: number,
    text: string,
    isCompleted: boolean
}

interface TaskProps {
    taskRecieved: TaskInterface
}

export default function Task({ taskRecieved }: TaskProps) {

    // Local state to track completion status
    const [isCompleted, setIsCompleted] = useState<boolean>(taskRecieved?.isCompleted ?? false);

    // Local copy of the task object
    const [task, setTask] = useState<TaskInterface | undefined>(taskRecieved);

    // Toggle task completion status
    async function handleClick() {
        setIsCompleted(!isCompleted); // Update local completion state
        setTask({                     // Update local task object
            ...task!,
            isCompleted: !isCompleted
        });
        await fetch("/api/todo", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: task?._id, isCompleted: !isCompleted }) // send id and !isCompleted state (! to send correct boolean otherwise current is sent without update)
        });
    }

    const taskStyle = "bg-amber-100 hover:bg-amber-200 hover:font-bold cursor-pointer rounded-lg transition-all duration-300 p-2 min-w-2xl border-l-24 border-amber-300";

    return (
        <div onClick={handleClick} className={`${isCompleted ? "line-through text-gray-400" : "text-black"} ${taskStyle}`}>
            {taskRecieved.text}
        </div>
    );
}