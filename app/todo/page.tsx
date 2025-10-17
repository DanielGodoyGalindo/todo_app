"use client"

import { useEffect, useState } from "react"
import Task, { TaskInterface } from "./components/Task" // use {} for named exports and don't use {} for default exports
// Task → default export → no curly braces
// TaskInterface → named export → must use curly braces {}

export default function TodoMain() {

    // Declare hooks
    const [inputTask, setInputTask] = useState(""); // Stores the user input for a new task
    const [tasks, setTasks] = useState<TaskInterface[]>([]); // Stores the list of fetched tasks

    // Fetch all tasks from the API
    async function fetchTasks() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todo`, {
            // Default method is GET if not specified
            cache: "no-store", // ensures fresh data (no caching)
        });
        const data = await res.json();
        setTasks(data); // Update task list state and trigger a re-render
    }

    // Load tasks when the component mounts
    useEffect(() => {
        fetchTasks();
    }, [])

    // Add a new task when the "Add" button is clicked
    async function handleClick() {
        if (inputTask.length === 0)
            return;
        // https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch#suministrando_opciones_de_petici%C3%B3n
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputTask, isCompleted: false })
        });
        setInputTask("");
        await fetchTasks();
    }

    return (
        <div className="w-lg mx-auto">
            <h1 className="text-3xl ml-6">TODO list</h1>
            <div className="flex gap-3 w-auto m-6">
                <input type="text" placeholder="Type your task..."
                    className="border border-black rounded p-1.5 flex-4"
                    value={inputTask}
                    onChange={e => setInputTask(e.target.value)} />
                <button
                    className="border border-green-700 flex-1 rounded-md px-4 py-2 text-green-700 hover:bg-green-700 hover:text-white transition duration-200 cursor-pointer h-10"
                    onClick={handleClick}>
                    Add</button>
            </div>
            <ul className="flex flex-col gap-2 text-center pl-6 w-auto">
                {tasks.length === 0 ? (<p className="text-xl">⏳ Loading tasks...</p>) : (
                    tasks.map((task: TaskInterface) => (
                        <li key={task._id} className="list-none">
                            {/* Render the Task component and pass the task data as props */}
                            <Task taskRecieved={task} />
                        </li>
                    ))

                )}
            </ul>
            <p className="bg-red-300 mt-12">todo: update in mongodb when clicking a task</p>
        </div>
    );
}