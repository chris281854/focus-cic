import { React, useEffect, useState } from "react"
import NewEvent from "../NewEvent"
import NewReminder from "../NewReminder"
import ToDoItem from "../ToDoItem"
import axios from "axios"
import { useUser } from "../../context/UserContext"
import dayjs from "dayjs"

export default function GeneralView() {
  const { user, lifeAreas } = useUser()

  const [events, setEvents] = useState([])
  const [alarms, setAlarms] = useState([])
  const [tasks, setTasks] = useState([])
  const [tableModified, setTableModified] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    overdue: true,
    today: true,
    thisWeek: true,
    thisMonth: true,
    later: true,
  })

  function generateEvents(eventList) {
    if (!eventList | (eventList.length === 0)) {
      return <p>No hay eventos para mostrar.</p>
    }

    return eventList.map((event) => (
      <ToDoItem
        key={event.event_id}
        event={event}
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

        setEvents(response.data)
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

  const categorizedEvents = {
    completed: events.filter((event) => event.state === 0),
    overdue: events.filter((event) => event.state === 1),
    today: events.filter((event) => event.state === 2),
    thisWeek: events.filter((event) => event.state === 3),
    thisMonth: events.filter((event) => event.state === 4),
    later: events.filter((event) => event.state === 5),
  }
  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }))
  }

  return (
    <div className="flex relative p-5 flex-col w-full">
      <h2>Tareas y Eventos</h2>
      <div className="flex p-4">
        <NewEvent onEventCreated={handleTableModified}></NewEvent>
        <NewReminder onReminderCreated={handleTableModified}></NewReminder>
      </div>

      <div className="todo-list w-full">
        {expandedSections.overdue && (
          <div className="mb-6 transition-all duration-300">
            <h3
              onClick={() => toggleSection("overdue")}
              className="font-bold bg-gray-900 p-2 rounded-md">
              Atrasados {expandedSections.overdue ? "▲" : "▼"}
            </h3>
            {expandedSections.overdue &&
              generateEvents(categorizedEvents.overdue)}
          </div>
        )}
        <div className="mb-6">
          <h3
            onClick={() => toggleSection("today")}
            className="font-bold bg-gray-900 p-2 rounded-md">
            Hoy {expandedSections.today ? "▲" : "▼"}
          </h3>
          {expandedSections.today && generateEvents(categorizedEvents.today)}
        </div>
        <div className="mb-6">
          <h3
            onClick={() => toggleSection("thisWeek")}
            className="font-bold bg-gray-900 p-2 rounded-md">
            Esta Semana {expandedSections.thisWeek ? "▲" : "▼"}
          </h3>
          {expandedSections.thisWeek &&
            generateEvents(categorizedEvents.thisWeek)}
        </div>
        <div className="mb-6">
          <h3
            onClick={() => toggleSection("thisMonth")}
            className="font-bold bg-gray-900 p-2 rounded-md">
            Este Mes {expandedSections.thisMonth ? "▲" : "▼"}
          </h3>
          {expandedSections.thisMonth &&
            generateEvents(categorizedEvents.thisMonth)}
        </div>
        <div className="mb-6">
          <h3
            onClick={() => toggleSection("later")}
            className="font-bold bg-gray-900 p-2 rounded-md">
            Más Adelante {expandedSections.later ? "▲" : "▼"}
          </h3>
          {expandedSections.later && generateEvents(categorizedEvents.later)}
        </div>
      </div>

      <div className="">
        <mark>Alarmas</mark>
        {generateAlarms()}
      </div>
    </div>
  )
}
