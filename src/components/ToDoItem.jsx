import EditItem from "./EditItem"
import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { useUser } from "../context/UserContext"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faEdit, faXmark } from "@fortawesome/free-solid-svg-icons"

export default function ToDoItem({ event, reminder, onEventModified }) {
  //Estados:
  // 0: Completado
  // 1: Atrasado
  // 2. Para hoy
  // 3: Para esta semana
  // 4: Para este mes
  // 5: Después
  // 6: Mañana

  //Niveles: (eventPriority)
  // 0: Urgente e importante
  // 1: Urgente
  // 2: Importante
  // 3: Normal
  const { user, timezone } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  let eventState = ""

  const stateColor = () => {
    const state = event?.state
    if (state === 0) {
      eventState = "Completado"
      return "bg-accent "
    } else if (state === 1) {
      eventState = "Atrasado"
      return "bg-red-600 "
    } else if (state === 2) {
      eventState = "Para hoy"
      return "bg-red-500 "
    } else if (state === 6) {
      eventState === "Para mañana"
      return "bg-red-500 "
    } else if (state === 3) {
      eventState = "Para esta semana"
      return "bg-orange-500 "
    } else if (state === 4) {
      eventState = "Para este mes"
      return "bg-green-400 "
    } else if (state === 5) {
      eventState = "Después"
      return "bg-green-400 "
    }
  }
  stateColor()

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const [onEdit, setOnEdit] = useState(false)

  const toggleEditVisibility = () => {
    setOnEdit(true)
  }

  const handleComplete = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/items/complete/`,
        {
          eventId: event.event_id,
          userId: user.user_id,
        },
        {
          withCredentials: true,
        }
      )
      if (response.status === 200) {
        console.log("Item marcado como completado")
        onEventModified()
      } else {
        console.error("Fallo al completar el evento", errorData.error)
      }
    } catch (error) {
      console.error("Error al completar el evento", error)
    }
  }

  const handleDelete = async (id, type) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/items/delete?id=${id}&type=${type}`,
        {
          withCredentials: true,
        }
      )
      console.log("Item eliminado satisfactoriamente")
      onEventModified()
    } catch (error) {
      console.error("Error al eliminar el item", error)
    }
  }
  return (
    <>
      {event && (
        <div
          className={`grid max-md:flex max-md:flex-wrap  ${
            isOpen
              ? "grid-cols-[1fr_1fr_1fr_1fr_auto] grid-rows-[auto_auto]"
              : "grid-cols-[0px_1fr_1fr_1fr_1fr_auto] grid-rows-[auto]"
          } gap-3 bg-tertiary dark:bg-slate-800 rounded-lg shadow-lg p-1 m-3 cursor-pointer dark:hover:bg-cyan-900 transition-all overflow-hidden items-center content-center min-w-64`}
          onClick={toggleOpen}>
          {!isOpen && (
            <div
              className={
                `${stateColor()}` +
                "grid rounded-sm self-center min-h-full w-4 h-14 -ml-3 -mt-3 -mb-3 left-0 max-md:hidden"
              }></div>
          )}
          <div className="grid grid-cols-[2.5rem_1fr] col-span-2 items-center gap-3 max-w-full h-min w-full">
            <div className="col-span-1 h-full w-10">
              <button
                className="flex text-center justify-center bg-emerald-400 text-white h-10 w-10 hover:bg-emerald-400 transition ease-in-out transform rounded-2xl hover:scale-110 duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  handleComplete(event.event_id, "event")
                }}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
            <p className="font-light text-white col-span-1 text-nowrap overflow-hidden text-ellipsis w-full">
              {event.name}
            </p>
          </div>
          <div className="col-span-1 flex justify-center overflow-hidden h-min w-full min-w-fit text-nowrap">
            <span className="text-base text-white">
              {(event.state === 1 &&
                event.date &&
                dayjs(event.date).tz(timezone).format("MMMM D, h:m a")) ||
                (event.state === 2 &&
                  event.date &&
                  dayjs(event.date).tz(timezone).format("h:m a")) ||
                (event.state === 6 &&
                  event.date &&
                  dayjs(event.date).tz(timezone).format("h:m a")) ||
                (event.state === 3 &&
                  event.date &&
                  dayjs(event.date).tz(timezone).format("ddd h:m a")) ||
                (event.state === 4 &&
                  event.date &&
                  dayjs(event.date).tz(timezone).format("D MMM. h:m a")) ||
                dayjs(event.date).tz(timezone).format("D MMM. h:m a, YYYY")}
            </span>
          </div>
          <div
            className={`flex items-center max-w-full overflow-x-auto rounded-xl scrollbar-none gap-1 h-full ${
              isOpen && "row-span-2 flex-wrap content-start"
            }`}>
            {event.life_areas.map(
              (area, index) =>
                area && (
                  <div
                    key={index}
                    className={`rounded-full p-0.5 px-2 h-7 text-center text-ellipsis overflow-hidden w-fit max-w-48 min-w-20 whitespace-nowrap`}
                    style={{ backgroundColor: `${area.color}` }}>
                    {area.name}
                  </div>
                )
            )}
          </div>
          <div className="row-span-1 flex gap-2 h-min">
            <button
              className="text-white bg-primary dark:bg-slate-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                toggleEditVisibility()
              }}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="text-white bg-primary dark:bg-slate-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(event.event_id, "event")
              }}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {isOpen && (
            <div className="col-span-3 grid grid-cols-3 grid-rows-1 max-md:hidden max-h-20">
              <div className="col-span-2">
                <p className="text-white text-clip overflow-hidden h-full">
                  {event.description}
                </p>
              </div>
              <div className="col-span-1 w-full text-center">
                <p className="text-white">{eventState}</p>
              </div>
            </div>
          )}
        </div>
      )}
      {reminder && (
        <div className="relative min-w-full lg:min-w-[40vw] max-w-[48vw] grow bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <h6 className="dark:text-white truncate max-w-[80%]">
                {reminder.name ||
                  `Recordatorio para ${dayjs(reminder.date).format(
                    "MMMM DD, YYYY"
                  )}`}
              </h6>
              <button
                className="absolute right-2 top-2 justify-self-end text-white bg-primary dark:bg-slate-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(reminder.reminder_id, "reminder")
                }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="mt-auto">
              <p className="text-gray-600 dark:text-gray-200">
                {dayjs(reminder.date).format("MMM D, YYYY | HH:mm")}
              </p>
            </div>
          </div>
        </div>
      )}
      {onEdit && (
        <EditItem
          onEdit={onEdit}
          setOnEdit={setOnEdit}
          event={event}
          onEventModified={onEventModified}
        />
      )}
    </>
  )
}
