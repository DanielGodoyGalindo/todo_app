"use client"

// use {} for named exports and don't use {} for default exports
import { useEffect, useState } from "react"
import Task, { TaskInterface } from "./components/Task" // Task → default export → no curly braces // TaskInterface → named export → must use curly braces {}
import DeleteTaskButton from "./components/DeleteTaskButton";

export default function TodoMain() {

    // Declare hooks
    const [inputTask, setInputTask] = useState(""); // Stores the user input for a new task
    const [tasks, setTasks] = useState<TaskInterface[]>([]); // Stores the list of fetched tasks
    const [loading, setLoading] = useState<boolean>(true); // Loading state to show message when fetching tasks

    // Fetch all tasks from the API
    async function fetchTasks() {
        setLoading(true);
        try {
            const res = await fetch("/api/todo", {
                // Default method is GET if not specified
                cache: "no-store", // ensures fresh data (no caching)
            });
            const data = await res.json();
            setTasks(data); // Update task list state and trigger a re-render
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Load tasks when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    // Function that removes the deleted task from local state without reloading anything (no second fetch)
    function handleTaskDeleted(deletedId: string) {
        // Update the state by keeping all tasks except the one that matches the deleted ID
        // https://react.dev/learn/updating-arrays-in-state#removing-from-an-array
        setTasks(prev => prev.filter(task => task._id.toString() !== deletedId));
    }

    // Add a new task when the "Add" button is clicked
    async function handleClick() {
        if (inputTask.length === 0)
            return;
        // https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch#suministrando_opciones_de_petici%C3%B3n
        await fetch("/api/todo", {
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
                    onChange={e => setInputTask(e.target.value)}
                />
                <button
                    className="border flex-1 rounded-md px-4 py-2
                             hover:bg-black hover:text-white transition duration-200 cursor-pointer h-10"
                    onClick={handleClick}>Add
                </button>
            </div>
            <ul className="flex flex-col items-center gap-2 text-center pl-6 w-auto">
                {loading ? (<p className="text-xl">Loading tasks...</p>) :
                    tasks.length === 0 ? (<p className="text-xl">No tasks to show...</p>) : (
                        tasks.map((task: TaskInterface) => (
                            <li key={task._id} className="list-none flex gap-3">
                                {/* Render the Task component and pass the task data as props */}
                                <Task taskRecieved={task} />
                                {/* Render delete button and pass task id and handleTaskDeleted function as props */}
                                <DeleteTaskButton taskIdToDelete={task._id.toString()} onDeleted={handleTaskDeleted} />
                            </li>
                        ))
                    )}
            </ul>
            <p className="bg-red-300 mt-12 p-1">todo: styling - edit task?</p>
        </div>
    );
}