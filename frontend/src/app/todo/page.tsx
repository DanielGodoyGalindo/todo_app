import Task from "./components/Task"

export default function TodoMain() {
  return <div>
    <h1>TODO App</h1>
    <ul style={{display:"flex"}}>
      <Task taskRecieved={{ id: 1, text: "hola", isCompleted: true }} />
    </ul>
  </div>
}