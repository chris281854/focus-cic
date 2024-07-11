import { React, useEffect, useState } from "react"
import NewEvent from "../NewEvent"
import NewTask from "../NewTask"
import NewReminder from "../NewReminder"
import ToDoItem from "../ToDoItem"
import axios from "axios"
import { useUser } from "../../context/UserContext"

export default function GeneralView() {
  const { user, lifeAreas } = useUser()

  //Estructura de tareas provisional (debe vincularse la base de datos)
  const [events, setEvents] = useState([])
  const [reminders, setReminders] = useState([])
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState("")
  const [tableModified, setTableModified] = useState(false)

  function generateEvents() {
    return events.map((event) => (
      <ToDoItem
        key={event.event_id}
        event={event}
        onEventModified={handleTableModified}
      />
    ))
  }
  function generateTasks() {
    return tasks.map((task) => (
      <ToDoItem
        key={task.task_id}
        task={task}
        onEventModified={handleTableModified}
      />
    ))
  }

  useEffect(() => {
    // Función para obtener los eventos desde el servidor
    const fetchTasks = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/get/tasks?userId=${userId}`
        )
        setTasks(response.data)
      } catch (error) {
        console.error("Error al obtener las tareas: ", error)
      }
    }
    fetchTasks(user.user_id)

    const fetchEvents = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/get/events?userId=${userId}`
        )
        setEvents(response.data)
      } catch (error) {
        console.error("Error al obtener los eventos: ", error)
      }
    }
    fetchEvents(user.user_id)

    setTableModified(false)
  }, [tableModified])

  const handleTableModified = () => {
    setTableModified(true)
  }

  return (
    <>
      <div className="flex relative p-5 flex-col w-full">
        <h2>Tareas y Eventos</h2>
        <div className="flex p-4">
          <NewEvent onEventCreated={handleTableModified}></NewEvent>
          <NewTask onTaskCreated={handleTableModified}></NewTask>
          <NewReminder onReminderCreated={handleTableModified}></NewReminder>
        </div>
        <div className="todo-list w-full">
          {generateEvents()}
          {generateTasks()}
        </div>
      </div>
    </>
  )
}
