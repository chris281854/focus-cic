import EditItem from "./EditItem"
import { useState } from "react"
import dayjs from "dayjs"
import { useUser } from "../context/UserContext"
import axios from "axios"

export default function ToDoItem({ event, task, reminder, onEventModified }) {
  //Estados:
  //0: Retrasado
  //1: Inmediato
  //2: Cerca
  //3: Lejos

  //Niveles:
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
      eventState = "Atrasado"
      return "bg-red-600 "
    } else if (state === 1) {
      eventState = "Urgente"
      return "bg-red-400 "
    } else if (state === 2) {
      eventState = "Incompleto"
      return "bg-blue-600 "
    } else if (state === 3) {
      eventState = "Incompleto"
      return "bg-white "
    } else if (state === 4) {
      eventState = "Completado"
      return "bg-accent "
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
          className="grid grid-cols-[auto_1fr_1fr_1fr_auto_auto] bg-black rounded-lg shadow-lg p-3 m-3 ml-0 cursor-pointer hover:bg-cyan-900 transition-all overflow-hidden"
          onClick={toggleOpen}>
          <div
            className={
              `${stateColor()}` +
              "grid rounded-sm self-center min-h-full w-3 h-14 -ml-3 -mt-3 -mb-3 left-0"
            }></div>
          <div className="col-span-1 flex items-center pl-2">
            <h2 className="text-xl font-light text-white">{event.name}</h2>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <span className="text-base text-gray-500">
              {dayjs(event.date).format("D MMMM | h:m a")}
            </span>
          </div>
          <div className="col-span-1 flex items-center">
            {event.life_areas.map((area) => (
              <div key={area} className="rounded-full bg-cyan-400 p-1 pr-2 pl-2">
                {area}
              </div>
            ))}
          </div>
          <div className="col-span-1 flex items-center justify-between pr-1">
            <button
              className="text-black bg-accent hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-full px-4 py-1 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation()
                handleComplete(event.event_id, "event")
              }}>
              Completar
            </button>
          </div>
          <div className="col-span-1 flex justify-end items-center space-x-2 pr-1">
            <button
              className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                toggleEditVisibility()
              }}>
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(event.event_id, "event")
              }}>
              <i className="fa-solid fa-xmark"></i>
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
      {task && (
        <>
          <div className="max-w-sm w-full bg-black rounded-lg shadow-lg p-6 m-3">
            <div className="flex relative items-center justify-between">
              <h2 className="text-xl font-bold text-white">{task.name}</h2>
              <button
                className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 absolute right-10"
                onClick={toggleEditVisibility}>
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 relative right-0"
                onClick={() => handleDelete(task.task_id, "task")}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <p className="text-gray-400 mt-2">{task.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">Para: {task.date}</span>
              <button
                className="text-black bg-accent hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-full px-4 py-1 text-sm font-medium"
                onClick={() => handleComplete(task.task_id, "task")}>
                Completar
              </button>
            </div>
          </div>
        </>
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
          task={task}
          onEventModified={onEventModified}
        />
      )}
    </>
  )
}
