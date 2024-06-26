import React from "react"
import { useState } from "react"
import axios from "axios"
import { useUser } from "../context/UserContext"


export default function NewEvent({ onEventCreated }) {
  const { user } = useUser()
  const [state, setState] = useState(0)
  const [eventDate, setEventDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [eventName, setEventName] = useState("")
  const [eventCategory, setEventCategory] = useState("")
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
    setEventCategory("")
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
          eventCategory,
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
          <div className="flex fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-screen bg-opacity-30 bg-black backdrop-blur">
            <div className="flex justify-center text-center p-6 w-1/2 h-fit fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-3xl">
            <button onClick={reset} className="absolute right-3 h-10 w-10 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-2">
                    <i className="fas fa-redo"></i>
                </button>
              <form onSubmit={handleSubmit} className="flex flex-col w-full" id="form">
                <label htmlFor="EventName">Evento</label>
                <input
                  type="text"
                  name="EventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
                <label htmlFor="eventDescription">Notas</label>
                <input
                  type="text"
                  name="EventDescription"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
                <label htmlFor="EventDate">Hora y fecha</label>
                <input
                  type="datetime-local"
                  name="EventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
                <label htmlFor="EventCategory">Categoría</label>
                <input
                  type="textbox"
                  name="EventCategory"
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                />
                <label htmlFor="Prioridad"></label>
                <input
                  type="number"
                  name="EventPriority"
                  value={eventPriority}
                  onChange={(e) => setEventPriority(e.target.value)}
                  required
                />
                <div>
                  <input
                    type="checkbox"
                    name="reminder"
                    id="reminder"
                    value={addReminder}
                    onChange={(e) => setAddReminder(e.target.checked)}
                  />
                  <label htmlFor="reminder"> ¿Añadir recordatorio?</label>
                  {addReminder && (
                    <input
                      type="datetime-local"
                      name="reminderDate"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      required
                    />
                  )}
                  <br />
                </div>
                <div className="p-2 flex self-center justify-around w-1/2">
                  <button type="reset" onClick={toggleNewEvent}>
                    Cancelar
                  </button>
                  
                  <button type="submit">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
