import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useUser } from "../context/UserContext"
import dayjs from "dayjs"

export default function EditItem({
  onEdit,
  setOnEdit,
  event,
  task,
  onEventModified,
}) {
  const { user, lifeAreas } = useUser()
  const [state, setState] = useState(0)
  //Eventos
  const [eventId, setEventId] = useState(event?.event_id)
  const [eventDate, setEventDate] = useState(
    dayjs(event?.date).format("YYYY-MM-DDThh:mm")
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
  const [selectedAreas, setSelectedAreas] = useState([])

  const [eventReminderDate, setEventReminderDate] = useState(
    event.reminder_date
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
      lifeAreaIds: selectedAreas,
      eventDate,
      eventPriority,
      eventDescription,
      eventMail,
      eventId,
      userId: user.user_id,
      eventReminderId,
    }

    axios
      .patch(`http://localhost:3001/api/event/update`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  const handleTaskUpdate = async (e) => {
    e.preventDefault()
    axios
      .patch(`http://localhost:3001/api/task/update`, {
        taskReminderDate: addTaskReminder ? taskReminderDate : null,
        state,
        endDate: endDate || null,
        taskName,
        taskCategory,
        taskDate,
        taskPriority,
        taskDescription,
        userId: user.user_id,
        taskMail,
        taskId: event.event_id,
        taskReminderId,
      })
      .then((response) => {
        console.log("Item actualizado: ", response.data)
        reset()
        toggleEditVisibility()
        onEventModified()
      })
      .catch((error) => {
        console.error("Error al actualizar el item: ", error)
      })
  }

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
                      value={eventName ?? ""}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="eventDescription"
                      className="block text-white text-left mb-1">
                      Notas
                    </label>
                    <textarea
                      type="text"
                      name="EventDescription"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="w-full min-h-16 p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    {/* <label
                      htmlFor="EventLifeAreas"
                      className="block text-white text-left mb-1">
                      Categoría
                    </label>
                    <select
                      name="EventLifeAreas"
                      id="EventLifeAreas"
                      value={eventLifeArea}
                      onChange={(e) => setEventLifeArea(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      {lifeAreas.map((area) => (
                        <option key={area.life_area_id} value={area.life_area_id}>
                          {area.name}
                        </option>
                      ))}
                    </select> */}
                  </div>
                  <div className="space-x-4 flex justify-evenly">
                    <div className="w-full">
                      <label
                        htmlFor="EventDate"
                        className="block text-white text-left mb-1">
                        Hora y fecha
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
                  <div className="flex items-center space-x-2">
                    <label className="block text-white text-left mb-1">
                      Repetir:
                    </label>
                    <select
                      name="repetition"
                      id="repetition"
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="0"> Nunca </option>
                      <option value="1">Diario</option>
                      <option value="2">Semanal</option>
                      <option value="3">Mensual</option>
                      <option value="4">Anual</option>
                    </select>
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
                  <div className="flex justify-around mt-4">
                    <button
                      type="reset"
                      onClick={toggleEditVisibility}
                      className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
              <aside className="relative lg:ml-4 content-center bg-gray-900 p-4 rounded-3xl lg:w-fit mt-4 lg:mt-0 overflow-y-scroll scrollbar-none">
                {lifeAreas.map((area) => (
                  <button
                    key={area.life_area_id}
                    onClick={() => handleSeleccion(area.life_area_id)}
                    className={`block w-40 text-center p-2 rounded-lg hover:border-blue-700 m-2 border-none outline-none transition duration-300 ${
                      selectedAreas.includes(area.life_area_id)
                        ? "bg-blue-600"
                        : "bg-gray-700"
                    }`}>
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
