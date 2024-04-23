import { React, useState } from "react"
import NewEvent from "../NewEvent"
import NewTask from "../NewTask"
import NewReminder from "../NewReminder"
import ToDoItem from "../ToDoItem"

export default function GeneralView() {
  //Estructura de tareas provisional (debe vincularse la base de datos)
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Doctor Appointment",
      completed: true,
    },
    {
      id: 2,
      text: "Meeting at School",
      completed: false,
    },
  ])
  const [text, setText] = useState("")
  function addTask(text) {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    }
    setTasks([...tasks, newTask])
    setText("")
  }
  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }
  function toggleCompleted(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed }
        } else {
          return task
        }
      })
    )
  }

  return (
    <>
      <div className="flex relative p-5 flex-col w-fit">
        <h2>Tareas y Eventos</h2>
        <div className="flex p-4">
          <button>+</button>
          <NewEvent></NewEvent>
          <NewTask></NewTask>
          <NewReminder></NewReminder>
        </div>
        <div className="todo-list">
          {tasks.map((task) => (
            <ToDoItem
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
            />
          ))}
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={() => addTask(text)}>Add</button>
        </div>
      </div>
    </>
  )
}
