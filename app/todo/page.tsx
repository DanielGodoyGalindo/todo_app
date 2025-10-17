import Task, { TaskInterface } from "./components/Task" // use {} for named exports and don't use {} for default exports
// Task → default export → no curly braces
// TaskInterface → named export → must use curly braces {}

// Fetch all tasks from the backend API
async function fetchTasks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todo`, {
    // if "method:[http method]" is not declared, GET method is by default --> method: GET
    cache: 'no-store', // ensures the data is always fresh and not cached
  })
  return res.json() as Promise<TaskInterface[]>
}

export default async function TodoMain() {

  // Get tasks from API
  const tasks = await fetchTasks();

  return (
    <div>
      <h1 className="text-3xl">TODO App</h1>
      <div className="flex gap-3 w-4/12">
        <input type="text" placeholder="Type your task..."
          className="border border-black rounded p-1.5 flex-4" />
        <button
          className="border border-green-700 flex-1 rounded-md px-4 py-2 text-green-700 hover:bg-green-700 hover:text-white transition duration-200 cursor-pointer">
          Add</button>
      </div>
      <ul style={{ display: "flex", flexDirection: 'column', gap: '8px', width: '20rem', textAlign: 'center' }}>
        {tasks.map((task: TaskInterface) => (
          <li key={task._id} style={{ listStyle: "none" }}>
            {/* Render the Task component and pass the task data as props */}
            <Task taskRecieved={task} />
          </li>
        ))}
      </ul>
    </div>
  )
}