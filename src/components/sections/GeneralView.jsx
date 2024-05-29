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
  }, [])

  return (
    <>
      <div className="flex relative p-5 flex-col w-full">
        <h2>Tareas y Eventos</h2>
        <div className="flex p-4">
          <button>+</button>
          <NewEvent></NewEvent>
          <NewTask></NewTask>
          <NewReminder></NewReminder>
        </div>
        <div className="todo-list w-full">
          {events.map((event) => (
            <div
              className="bg-secondary rounded w-full p-2 m-2"
              key={event.id_evento}>
              {event.nombre}

              {event.fecha} 
              <input type="checkbox" name="check" id="check" />
            </div>
          ))}
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={() => addTask(text)}>Add</button>
        </div>
      </div>
    </>
  )
}