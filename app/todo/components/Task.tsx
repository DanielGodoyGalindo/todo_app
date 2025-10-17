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
    function handleClick() {
        setIsCompleted(!isCompleted); // Update local completion state
        setTask({                     // Update local task object
            ...task!,
            isCompleted: !isCompleted
        });
    }

    const taskHoverStyle = "font-bold hover:bg-green-100 cursor-pointer";

    return (
        <div onClick={handleClick} className={`${isCompleted ? "line-through text-gray-400" : "text-black"} ${taskHoverStyle}`}>
            {taskRecieved.text}
        </div>
    );
}