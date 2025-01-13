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
  console.log("eventos:", events) 
  // const [events, setEvents] = useState([])
  const [alarms, setAlarms] = useState([])
  const [tasks, setTasks] = useState([])
  const [tableModified, setTableModified] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    overdue: true,
    today: true,
    thisWeek: true,
    thisMonth: false,
    later: false,
  })

  function generateEvents(eventList) {
    if (!eventList || eventList.length === 0) {
      return <p>Sin tareas pendientes</p>
    }

    return eventList.flatMap((event) => {
      // Verificar si el evento tiene iteraciones
      if (event.instances && event.instances.length > 0) {
        // Si hay iteraciones, devolver un ToDoItem por cada iteración
        return event.instances.map((instance) => (
          <ToDoItem
            key={instance.instance_id} // Usamos el ID de la instancia como clave
            event={{
              ...event, // Copiamos los datos del evento
              instance_date: instance.instance_date, // Pasamos la fecha de la iteración
              completed: instance.completed, // Estado completado de la iteración
              instance_id: instance.instance_id, // Pasamos el ID de la instancia
            }}
            onEventModified={handleTableModified}
          />
        ))
      } else {
        // Si el evento no tiene iteraciones, devolvemos un solo ToDoItem
        return (
          <ToDoItem
            key={event.event_id}
            event={event}
            onEventModified={handleTableModified}
          />
        )
      }
    })
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
          { withCredentials: true }
        )
        setAlarms(response.data)
      } catch (error) {
        console.error("Error al obtener los eventos: ", error)
      }
    }
    fetchReminders(user.user_id)
    console.log(events)
  }, [tableModified])

  const handleTableModified = () => {
    setTableModified((prevCount) => prevCount + 1) // Incrementamos el contador
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
  const [toggleNewReminder, setToggleNewReminder] = useState(false)

  return (
    <div className="flex relative flex-col w-full select-none">
      <header className="border-b dark:border-white border-secondary dark:bg-transparent flex p-4 max-sm:p-1 items-center gap-2 mx-5">
        <h4 className="dark:text-white text-center">
          Tareas y eventos pendientes
        </h4>
        <button
          className="bg-primary text-white dark:bg-slate-800 ml-auto"
          onClick={() => setToggleNewEvent(true)}>
          <FontAwesomeIcon icon={faPlus} /> <span>Evento</span>
        </button>
        {toggleNewEvent && (
          <NewEvent
            onEventCreated={handleTableModified}
            setToggleNewEvent={setToggleNewEvent}></NewEvent>
        )}
      </header>
      <section className="todo-list w-full p-5">
        {hasOverdueEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("overdue")}
              className="bg-secondary text-neutral-900 dark:bg-gray-900 dark:text-white p-2 rounded-md">
              Atrasados {expandedSections.overdue ? "▲" : "▼"}
            </h5>
            {expandedSections.overdue &&
              generateEvents(categorizedEvents.overdue)}
          </div>
        )}
        <div className="mb-6">
          <h5
            onClick={() => toggleSection("today")}
            className="bg-secondary text-neutral-900 dark:bg-gray-900 dark:text-white p-2 rounded-md">
            Hoy {expandedSections.today ? "▲" : "▼"}
          </h5>
          {expandedSections.today && generateEvents(categorizedEvents.today)}
        </div>
        {hasTomorrowEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("tomorrow")}
              className="bg-secondary text-neutral-900 dark:bg-gray-900 dark:text-white p-2 rounded-md">
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
              className="bg-secondary text-neutral-900 dark:bg-gray-900 dark:text-white p-2 rounded-md">
              Próximos 7 días {expandedSections.thisWeek ? "▲" : "▼"}
            </h5>
            {expandedSections.thisWeek &&
              generateEvents(categorizedEvents.thisWeek)}
          </div>
        )}
        {hasThisMonthEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("thisMonth")}
              className="bg-secondary text-neutral-900 dark:bg-gray-900 dark:text-white p-2 rounded-md">
              Próximos 30 días {expandedSections.thisMonth ? "▲" : "▼"}
            </h5>
            {expandedSections.thisMonth &&
              generateEvents(categorizedEvents.thisMonth)}
          </div>
        )}
        {hasLaterEvents && (
          <div className="mb-6">
            <h5
              onClick={() => toggleSection("later")}
              className="bg-secondary text-neutral-900 dark:bg-gray-900 dark:text-white p-2 rounded-md">
              Más Adelante {expandedSections.later ? "▲" : "▼"}
            </h5>
            {expandedSections.later && generateEvents(categorizedEvents.later)}
          </div>
        )}
      </section>
      <header className="border-b dark:border-white border-secondary dark:bg-transparent flex p-4 items-center gap-2 mx-5">
        <h4 className="dark:text-white">Recordatorios activos</h4>
        <button
          className="bg-primary text-white dark:bg-slate-800 ml-auto"
          onClick={() => setToggleNewReminder(true)}>
          <FontAwesomeIcon icon={faPlus} /> <span>Recordatorio</span>
        </button>
        {toggleNewReminder && (
          <NewReminder
            onReminderCreated={handleTableModified}
            setToggleNewReminder={setToggleNewReminder}
          />
        )}
      </header>
      <div className="w-full gap-2 p-4 flex flex-row flex-wrap">
        {generateAlarms()}
      </div>
    </div>
  )
}
