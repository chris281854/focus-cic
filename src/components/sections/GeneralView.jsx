import { React, useEffect, useState } from "react"
import NewEvent from "../NewEvent"
import NewTask from "../NewTask"
import NewReminder from "../NewReminder"
import ToDoItem from "../ToDoItem"
import axios from "axios"

export default function GeneralView() {
  //Estructura de tareas provisional (debe vincularse la base de datos)
  const [events, setEvents] = useState([])
  const [reminders, setReminders] = useState([])
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
  const [newEventAlert, setNewEventAlert] = useState(false)

  useEffect(() => {
    // Función para obtener los eventos desde el servidor
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/get/events")
        setEvents(response.data)
      } catch (error) {
        console.error("Error al obtener los eventos: ", error)
      }
    }
    fetchEvents()
  }, [newEventAlert])

  const handleNewEventAlert = () => {
    setNewEventAlert(true)
  }

  return (
    <>
      <div className="flex relative p-5 flex-col w-full">
        <h2>Tareas y Eventos</h2>
        <div className="flex p-4">
          <button>+</button>
          <NewEvent onEventCreated={handleNewEventAlert}></NewEvent>
          <NewTask></NewTask>
          <NewReminder></NewReminder>
        </div>
        <div className="todo-list w-full">
          {events.map((event) => (
            <ToDoItem key={event.event_id} event={event} />
          ))}
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={() => addTask(text)}>Add</button>
        </div>
      </div>
    </>
  )
}
