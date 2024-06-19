

export default function ToDoItem({ event, task, onEventModified }) {
  // function handleChange() {
  //   toggleCompleted(task.id)
  // }

  //Estados:
  //0: Incompleto
  //1: Retrasado
  //2:Completado

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp)

    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0") // getUTCMonth() devuelve 0-11, así que sumamos 1
    const day = String(date.getUTCDate()).padStart(2, "0")
    const hours = String(date.getUTCHours()).padStart(2, "0")
    const minutes = String(date.getUTCMinutes()).padStart(2, "0")
    const seconds = String(date.getUTCSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
          <div className="flex relative items-center justify-between">
            <h2 className="text-xl font-bold text-white">{event.name}</h2>
            <button
                className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 absolute right-10"
                onClick={() => handleDelete(event.event_id, "event")}>
                <i class="fas fa-edit"></i>
              </button>
              <button
                className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 relative right-0"
                onClick={() => handleDelete(event.event_id, "event")}>
              <i class="fa-solid fa-xmark"></i>
              </button>
          </div>
          <p className="text-gray-400 mt-2">{event.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
              Para: {formatTimestamp(event.date)}
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
                onClick={() => handleDelete(task.task_id, "task")}>
                <i class="fas fa-edit"></i>
              </button>
              <button
                className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1 h-8 w-8 relative right-0"
                onClick={() => handleDelete(task.task_id, "task")}>
              <i class="fa-solid fa-xmark"></i>
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
    </>
  )
}
