import { React, useEffect, useState } from "react"
import NewEvent from "../NewEvent"
import NewTask from "../NewTask"
import NewReminder from "../NewReminder"
import ToDoItem from "../ToDoItem"
import axios from "axios"
import { useUser } from "../../context/UserContext"
import dayjs from "dayjs"
import { getStatus } from "../../../utils.jsx"

export default function GeneralView() {
  const { user, lifeAreas } = useUser()
  
  const [events, setEvents] = useState([])
  const [alarms, setAlarms] = useState([])
  const [tasks, setTasks] = useState([])
  const [tableModified, setTableModified] = useState(false)

  function generateEvents() {
    if (!events | events.length === 0 ) {
      return null
    }

    const unfinishedEvents = events.filter((event) => event.status !== 4)
console.log(events)
    return unfinishedEvents.map((event) => (
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
  function generateAlarms() {
    return alarms.map((alarm) => (
      <ToDoItem
        key={alarm.reminder_id}
        reminder={alarm}
        onEventModified={handleTableModified}
      />
    ))
  }

  useEffect(() => {
    // Obtener eventos del servidor
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
          `http://localhost:3001/api/get/events?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        const eventWithStatus = response.data.map((event) => ({
          ...event,
          status: getStatus(event.date),
        }))

        setEvents(response.data)
        return eventWithStatus
      } catch (error) {
        console.error("Error al obtener los eventos: ", error)
      }
    }
    fetchEvents(user.user_id)

    const fetchReminders = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/get/reminders?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        setAlarms(response.data)
      } catch (error) {
        console.error("Error al obtener los eventos: ", error)
      }
    }
    fetchReminders(user.user_id)

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
        <div className="">
          <mark>Alarmas</mark>
          {generateAlarms()}
        </div>
      </div>
    </>
  )
}
