import React from "react"
import { useState } from "react"
import axios from "axios"
import { useUser } from "../context/UserContext"

export default function NewEvent({ onEventCreated }) {
  const { user, lifeAreas } = useUser()
  const [state, setState] = useState(0)
  const [eventDate, setEventDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [eventName, setEventName] = useState("")
  const [eventLifeArea, setEventLifeArea] = useState("")
  const [reminderDate, setReminderDate] = useState(null)
  const [eventPriority, setEventPriority] = useState(3)
  const [eventDescription, setEventDescription] = useState("")
  const [addReminder, setAddReminder] = useState(false)
  const [mail, setMail] = useState(false)

  //Abrir panel
  const [openNewEvent, setOpenNewEvent] = useState(false)
  const toggleNewEvent = (event) => {
    setOpenNewEvent(!openNewEvent)
    reset()
  }
  //Reset form
  const reset = () => {
    setEventDate(null)
    setEndDate(null)
    setEventName("")
    setEventLifeArea("")
    setReminderDate(null)
    setEventPriority(3)
    setEventDescription("")
    setAddReminder(false)
    setMail(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:3001/api/post/events",
        {
          reminderDate: addReminder ? reminderDate : null,
          state,
          endDate: endDate || null,
          eventName,
          lifeAreaIds: eventLifeArea,
          eventDate,
          eventPriority,
          eventDescription,
          userId: user.user_id,
          mail,
        }
      )
      console.log("Evento creado: ", response.data)
      reset()
      toggleNewEvent()
      onEventCreated()
    } catch (error) {
      console.error("Error al crear el evento: ", error)
    }
  }

  return (
    <>
      <div className="relative">
        <button className="new-event" onClick={toggleNewEvent}>
          Nuevo evento
        </button>

        {openNewEvent && (
          <div className="flex fixed z-50 inset-0 bg-opacity-30 bg-black backdrop-blur">
            <div className="flex flex-col justify-start p-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-auto sm:h-5/6 bg-gray-900 rounded-3xl mx-auto my-auto overflow-scroll no-scrollbar">
              <button
                onClick={reset}
                className="static top-3 -right-44 h-10 w-10 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full flex self-end items-center justify-center">
                <i className="fas fa-redo"></i>
              </button>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full space-y-4 -mt-6"
                id="form">
                <div>
                  <label
                    htmlFor="EventName"
                    className="block text-white text-left mb-1">
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
                  <input
                    type="text"
                    name="EventDescription"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="EventCategory"
                    className="block text-white text-left mb-1">
                    Categoría
                  </label>
                  <select
                    name="EventCategory"
                    id="EventCategory"
                    value={eventLifeArea}
                    onChange={(e) => setEventLifeArea(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    {lifeAreas.map((area) => (
                      <option key={area.life_area_id} value={area.life_area_id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:flex space-x-4">
                  <div>
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
                  <div>
                    <label
                      htmlFor="EventPriority"
                      className="block text-white text-left mb-2">
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
                      <option value="3">Normal</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="reminder"
                    id="reminder"
                    checked={addReminder}
                    onChange={(e) => setAddReminder(e.target.checked)}
                    className="text-primary focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="reminder" className="text-white">
                    {" "}
                    ¿Añadir recordatorio?
                  </label>
                </div>
                {addReminder && (
                  <div>
                    <input
                      type="datetime-local"
                      name="reminderDate"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      required
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
                <div className="flex justify-around mt-4 self">
                  <button
                    type="reset"
                    onClick={toggleNewEvent}
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
          </div>
        )}
      </div>
    </>
  )
}
