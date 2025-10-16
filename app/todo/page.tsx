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
      <h1>TODO App</h1>
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