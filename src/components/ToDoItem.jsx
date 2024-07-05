import EditItem from "./EditItem"
import { useState } from "react"
import dayjs from "dayjs"

export default function ToDoItem({ event, task, onEventModified }) {
  //Estados:
  //0: Incompleto
  //1: Retrasado
  //2:Completado

  const [onEdit, setOnEdit] = useState(false)

  const toggleEditVisibility = () => {
    setOnEdit(true)
  }

  const handleComplete = async (id, type) => {
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
        console.log("Item marcado como completado")
        onEventModified()
      } else {
        const errorData = await response.json()
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
      {event ? (
        <div className="max-w-sm w-full bg-black rounded-lg shadow-lg p-6 m-3">
          <div className="flex relative items-center justify-between no-scrollbar">
            <h2 className="text-xl font-bold text-white">{event.name}</h2>
            <button
              className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 absolute right-10"
              onClick={toggleEditVisibility}>
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 relative right-0"
              onClick={() => handleDelete(event.event_id, "event")}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <p className="text-gray-400 mt-2">{event.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
              Para: {dayjs(event.date).format("D MMMM | H:m a")}
            </span>
            <button
              className="text-black bg-accent hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-full px-4 py-1 text-sm font-medium"
              onClick={() => handleComplete(event.event_id, "event")}>
              Completar
            </button>
          </div>
        </div>
      ) : (
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
