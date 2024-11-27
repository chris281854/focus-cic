import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useUser } from "../context/UserContext"
import dayjs from "dayjs"
import { parse } from "uuid"

export default function EditItem({
  onEdit,
  setOnEdit,
  event,
  onEventModified,
}) {
  const { user, lifeAreas } = useUser()
  const [state, setState] = useState(event?.state)
  //Eventos
  const [eventId, setEventId] = useState(event?.event_id)
  const [eventDate, setEventDate] = useState(
    dayjs(event?.date).format("YYYY-MM-DD hh:mm")
  )
  const [endDate, setEndDate] = useState(null)
  const [eventName, setEventName] = useState(event?.name ?? "")
  const [eventPriority, setEventPriority] = useState(
    event?.priority_level ?? ""
  )
  const [eventDescription, setEventDescription] = useState(event?.description)
  const [category, setCategory] = useState(0) //task - event
  const [addEventReminder, setAddEventReminder] = useState(false)
  const [eventMail, setEventMail] = useState(event?.reminder_id ? true : false)
  const [eventReminderId, setEventReminderId] = useState(event?.reminder_id)
  const [eventLifeArea, setEventLifeArea] = useState(event?.life_areas)
  const [selectedAreas, setSelectedAreas] = useState(
    event.life_areas
      .map((area) => area.life_area_id)
      .filter((id) => id !== null)
  )
  const [diasSemanales, setDiasSemanales] = useState([]) // Para la recurrencia semanal
  const [recurrence, setRecurrence] = useState() // Tipo de recurrencia: "semanal", "mensual", "anual"

  useEffect(() => {
    if (event.recurrency_type === "month") {
      setRecurrence("month")
    } else if (event.recurrency_type === "year") {
      setRecurrence("year")
    } else if (!event.recurrency_type || event.recurrency_type === "") {
      setRecurrence("")
    } else {
      setDiasSemanales(event.recurrency_type.split(",").map(Number))
      setRecurrence("week")
    }
  }, [])
  console.log("diasSemanales", diasSemanales)

  console.log(event)
  const [eventReminderDate, setEventReminderDate] = useState(
    event?.reminder_date || undefined
  )

  const toggleEditVisibility = () => {
    reset()
    setOnEdit(false)
  }

  //Reset form
  const reset = () => {
    setEventDate(null)
    setEndDate(null)
    setEventName("")
    setEventReminderDate(null)
    setEventPriority(3)
    setEventDescription("")
    setAddEventReminder(false)
    setEventMail(false)
    setEventLifeArea(null)
    setRecurrence("")
    setDiasSemanales([])
  }

  // Manejar selección de recurrencia:
  const handleRecurrence = (e) => {
    setRecurrence(e.target.value)
  }

  // Manejar selección de días de la semana (solo si la recurrencia es semanal):
  const handleDaySelection = (day) => {
    setDiasSemanales((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
    console.log(diasSemanales)
  }

  //Manejar selección de areas:
  const handleSeleccion = async (value) => {
    setSelectedAreas((prevSelectedAreas) => {
      if (prevSelectedAreas.includes(value)) {
        //Retirar valores seleccionados
        return prevSelectedAreas.filter((item) => item !== value)
      } else {
        return [...prevSelectedAreas, value]
      }
    })
  }

  const handleEventUpdate = async (e) => {
    e.preventDefault()
    const updateData = {
      eventReminderDate,
      state,
      endDate: endDate || eventDate,
      eventName,
      category,
      lifeAreaIds: selectedAreas || null,
      eventDate,
      eventPriority,
      eventDescription,
      eventMail,
      eventId,
      userId: user.user_id,
      eventReminderId,
      iterationId: event.iteration_id || null,
    }

    // Lógica para manejar la recurrencia
    if (recurrence === "week") {
      // Convertimos el array diasSemanales en una cadena de texto separada por comas
      updateData.recurrencyType =
        diasSemanales.length > 0 ? diasSemanales : null
    } else if (recurrence === "month" || recurrence === "year") {
      updateData.recurrencyType = recurrence // Para mensual o anual, solo enviar el tipo de recurrencia
    } else {
      updateData.recurrencyType = null // Si no hay recurrencia, no enviamos datos de recurrencia
    }

    axios
      .patch(`http://localhost:3001/api/event/update`, updateData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Item actualizado: ", response.data)
        reset()
        onEventModified()
        toggleEditVisibility()
      })
      .catch((error) => {
        console.error("Error al actualizar el item: ", error)
      })
  }

  const handleDelete = async (e, id) => {
    e.preventDefault()
    console.log("ID enviado:", id)
    console.log(
      "URL enviada:",
      `http://localhost:3001/api/items/delete?id=${id}&type=event`
    )
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/items/delete?id=${id}&type=${"event"}`,
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

  const deleteAllRecurrences = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `http://localhost:3001/api/items/deleteAllRecurrences`,
        {
          iterationId: event.iteration_id,
        },
        {
          withCredentials: true,
        }
      )
      console.log("Items eliminados satisfactoriamente")
      onEventModified()
    } catch (error) {
      console.error("Error al eliminar los items", error)
    }
  }

  //Close with esc key
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        toggleEditVisibility()
      }
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])

  return (
    <>
      {event && (
        <>
          {onEdit && (
            <div className="flex fixed z-50 inset-0 bg-opacity-30 bg-black backdrop-blur items-center justify-center">
              <div className="relative p-4 max-w-full sm:w-3/4 md:w-1/2 lg:w-3/4 xl:w-5/12 sm:h-fit min-h-fit max-h-full bg-gray-900 rounded-3xl my-auto overflow-y-scroll no-scrollbar">
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 h-10 w-10 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full flex items-center justify-center">
                  <i className="fas fa-redo"></i>
                </button>
                <form
                  onSubmit={(e) => handleEventUpdate(e)}
                  className="flex flex-col w-full space-y-4"
                  id="form">
                  <div>
                    <label
                      htmlFor="EventName"
                      className="block text-white text-left mb-6">
                      Evento
                    </label>
                    <input
                      type="text"
                      name="EventName"
                      id="EventName"
                      placeholder="Título *"
                      value={eventName ?? ""}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <textarea
                      type="text"
                      name="EventDescription"
                      placeholder="Descripción"
                      value={eventDescription}
                      maxLength={250}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="w-full min-h-16 max-h-40 p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="space-x-4 flex justify-evenly">
                    <div className="w-full">
                      <label
                        htmlFor="EventDate"
                        className="block text-white text-left mb-1">
                        Hora y fecha *
                      </label>
                      <input
                        type="datetime-local"
                        name="EventDate"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="EventPriority"
                        className="block text-white text-left mb-1">
                        Prioridad
                      </label>
                      <select
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        id="EventPriority"
                        name="EventPriority"
                        value={eventPriority}
                        onChange={(e) => setEventPriority(e.target.value)}>
                        <option value="0">Urgente + Importante</option>
                        <option value="1">Urgente</option>
                        <option value="2">Importante</option>
                        <option value="3">Casual</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white text-left mb-1">
                      Frecuencia:
                    </label>

                    <select
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={recurrence}
                      onChange={handleRecurrence}>
                      <option value="">Ninguna</option>
                      <option value="week">Semanal</option>
                      <option value="month">Mensual</option>
                      <option value="year">Anual</option>
                    </select>
                  </div>
                  <div>
                    {recurrence === "week" && (
                      <div>
                        <div className="max-h-full flex grow justify-center">
                          {[
                            "Lun",
                            "Mar",
                            "Mie",
                            "Jue",
                            "Vie",
                            "Sab",
                            "Dom",
                          ].map((day, code) => (
                            <button
                              className={`w-16 h-14 mx-1 text-center rounded-full transition duration-300 ${
                                diasSemanales.includes(code)
                                  ? "bg-cyan-500"
                                  : "bg-gray-500"
                              }`}
                              type="button"
                              key={day}
                              onClick={() => handleDaySelection(code)}>
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="reminder"
                      id="reminder"
                      checked={addEventReminder}
                      onChange={(e) => setAddEventReminder(e.target.checked)}
                      className="text-primary focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="reminder" className="text-white">
                      ¿Añadir recordatorio?
                    </label>
                  </div>
                  {addEventReminder && (
                    <div>
                      <input
                        type="datetime-local"
                        name="reminderDate"
                        value={eventReminderDate}
                        onChange={(e) => setEventReminderDate(e.target.value)}
                        required
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
                  <div className="flex mt-4 gap-2 h-13">
                    <button
                      onClick={(e) => handleDelete(e, event.event_id)}
                      className="py-2 px-4 w-28 bg-slate-400 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                      Eliminar
                    </button>
                    {event.iteration_id && (
                      <button
                        onClick={(e) => deleteAllRecurrences(e)}
                        className="p-2 w-40 bg-slate-400 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                        Eliminar todas las repeticiones
                      </button>
                    )}
                    <button
                      type="reset"
                      onClick={toggleEditVisibility}
                      className="p-2 ml-auto bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="p-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
              <aside className="relative lg:ml-4 content-center bg-gray-900 p-4 rounded-3xl lg:w-fit mt-4 lg:mt-0 overflow-y-scroll scrollbar-none">
                {lifeAreas.map((area) => (
                  <button
                    key={area.life_area_id}
                    onClick={() => handleSeleccion(parseInt(area.life_area_id))}
                    className={`block w-40 text-center p-2 rounded-lg m-2 border-none transition duration-300 text-neutral-950 focus:outline-none ${
                      selectedAreas.includes(parseInt(area.life_area_id))
                        ? "opacity-100 text-opacity-100"
                        : "opacity-50 text-opacity-75"
                    }`}
                    style={{
                      backgroundColor: `${area.color}`,
                    }}>
                    {area.name}
                  </button>
                ))}
              </aside>
            </div>
          )}
        </>
      )}
    </>
  )
}
