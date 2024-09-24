import { React, useEffect, useState } from "react"
import NewEvent from "../../NewEvent"
import NewReminder from "../../NewReminder"
import ToDoItem from "../../ToDoItem"
import axios from "axios"
import { useUser } from "../../../context/UserContext"
import dayjs from "dayjs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faP, faPlus } from "@fortawesome/free-solid-svg-icons"

export default function GeneralView() {
  const { user, lifeAreas, fetchEvents, fetchReminders, events, reminders } =
    useUser()

  // const [events, setEvents] = useState([])
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
    if (user) {
      fetchEvents(user.user_id)
    }

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
    tomorrow: events.filter((event) => event.state === 6),
    thisWeek: events.filter((event) => event.state === 3),
    thisMonth: events.filter((event) => event.state === 4),
    later: events.filter((event) => event.state === 5),
  }
  const hasOverdueEvents = categorizedEvents.overdue.length > 0
  const hasTomorrowEvents = categorizedEvents.tomorrow.length > 0
  const hasThisWeekEvents = categorizedEvents.thisWeek.length > 0
  const hasThisMonthEvents = categorizedEvents.thisMonth.length > 0
  const hasLaterEvents = categorizedEvents.later.length > 0

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }))
  }
  const [toggleNewEvent, setToggleNewEvent] = useState(false)

  return (
    <div className="flex relative p-5 flex-col w-full select-none">
      <h3>Tareas y Eventos</h3>
      <div className="flex p-4">
        <button
          className="bg-primary dark:bg-slate-800 m-2"
          onClick={() => setToggleNewEvent(true)}>
          <FontAwesomeIcon icon={faPlus} /> <span>Evento</span>
        </button>
        {toggleNewEvent && (
          <NewEvent
            onEventCreated={handleTableModified}
            setToggleNewEvent={setToggleNewEvent}></NewEvent>
        )}
        <NewReminder onReminderCreated={handleTableModified}></NewReminder>
      </div>
      <div className="todo-list w-full">
        {hasOverdueEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("overdue")}
              className=" bg-primary dark:bg-gray-900 p-2 rounded-md">
              Atrasados {expandedSections.overdue ? "▲" : "▼"}
            </h5>
            {expandedSections.overdue &&
              generateEvents(categorizedEvents.overdue)}
          </div>
        )}
        <div className="mb-6">
          <h5
            onClick={() => toggleSection("today")}
            className=" bg-primary dark:bg-gray-900 p-2 rounded-md">
            Hoy {expandedSections.today ? "▲" : "▼"}
          </h5>
          {expandedSections.today && generateEvents(categorizedEvents.today)}
        </div>
        {hasTomorrowEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("tomorrow")}
              className=" bg-primary dark:bg-gray-900 p-2 rounded-md">
              Mañana {expandedSections.tomorrow ? "▲" : "▼"}
            </h5>
            {expandedSections.tomorrow &&
              generateEvents(categorizedEvents.tomorrow)}
          </div>
        )}
        {hasThisWeekEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("thisWeek")}
              className=" bg-primary dark:bg-gray-900 p-2 rounded-md">
              Esta Semana {expandedSections.thisWeek ? "▲" : "▼"}
            </h5>
            {expandedSections.thisWeek &&
              generateEvents(categorizedEvents.thisWeek)}
          </div>
        )}
        {hasThisMonthEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("thisMonth")}
              className=" bg-primary dark:bg-gray-900 p-2 rounded-md">
              Este Mes {expandedSections.thisMonth ? "▲" : "▼"}
            </h5>
            {expandedSections.thisMonth &&
              generateEvents(categorizedEvents.thisMonth)}
          </div>
        )}
        {hasLaterEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("later")}
              className=" bg-primary dark:bg-gray-900 p-2 rounded-md">
              Más Adelante {expandedSections.later ? "▲" : "▼"}
            </h5>
            {expandedSections.later && generateEvents(categorizedEvents.later)}
          </div>
        )}
      </div>

      <div className="">
        <h4>Alarmas</h4>
        {generateAlarms()}
      </div>
    </div>
  )
}
