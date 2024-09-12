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

  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  let eventState = ""

  const stateColor = () => {
    const state = event.state
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
      return "bg-white "
    } else if (state === 5) {
      eventState = "Después"
      return "bg-white "
    }
  }

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
      const response = await fetch(`http://localhost:3001/api/items/delete/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id, type }),
      })
      if (response.ok) {
        console.log("Item eliminado satisfactoriamente")
        onEventModified()
      } else {
        const errorData = await response.json()
        console.error("Fallo al eliminar el evento", errorData.error)
      }
    } catch (error) {
      console.error("Error al eliminar el evento", error)
    }
  }
  return (
    <>
      {event && (
        <div
          className="grid grid-cols-[0px_1fr_0.5fr_1fr_1fr_auto] bg-slate-800 rounded-lg shadow-lg p-1 m-3 ml-0 cursor-pointer hover:bg-cyan-900 transition-all overflow-hidden"
          onClick={toggleOpen}>
          <div
            className={
              `${stateColor()}` +
              "grid rounded-sm self-center min-h-full w-4 h-14 -ml-3 -mt-3 -mb-3 left-0"
            }></div>
          <div className="col-span-2 flex items-center ml-2 gap-3 max-w-48">
            <div className="col-span-1 h-full w-12">
              <button
                className="flex text-center justify-center bg-emerald-400 text-white h-10 w-10 hover:bg-emerald-400 transition ease-in-out transform rounded-2xl hover:scale-110 duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  handleComplete(event.event_id, "event")
                }}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
            <h3 className="font-light text-white col-span-2 min-w-max">{event.name}</h3>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <span className="text-base text-gray-500">
              {event.date ? dayjs(event.date).format("D MMMM | h:m a") : ""}
            </span>
          </div>
          <div className="col-span-1 flex items-center max-w-80 overflow-x-scroll rounded-xl scrollbar-none px-2">
            {event.life_areas.map(
              (area, index) =>
                area && (
                  <div
                    key={index}
                    className={`rounded-full p-1 pr-2 pl-2 mx-1`}
                    style={{ backgroundColor: `${area.color}` }}>
                    {area.name}
                  </div>
                )
            )}
          </div>
          <div className="col-span-1 flex justify-end items-center space-x-2 pr-1">
            <button
              className="text-white bg-slate-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                toggleEditVisibility()
              }}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="text-white bg-slate-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(event.event_id, "event")
              }}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {isOpen && (
            <div className="grid col-span-6 row-start-2">
              <div className="col-span-3 row-start-2">
                <p className="text-gray-400 mt-2 p-2">{event.description}</p>
              </div>
              <div className="col-start-4 col-span-3 row-start-2">
                <p className="text-gray-400 mt-2 p-2 place-self-end">
                  {eventState}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {reminder && (
        <>
          <div className="max-w-sm w-full bg-black rounded-lg shadow-lg p-6 m-3">
            <div className="flex relative items-center justify-between">
              <h2 className="text-xl font-light text-white">
                Para: {dayjs(reminder.date).format("D MMM | H:m")}
              </h2>
              <button
                className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 absolute right-10"
                onClick={toggleEditVisibility}>
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 relative right-0"
                onClick={() => handleDelete(reminder.reminder_id, "reminder")}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </>
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
