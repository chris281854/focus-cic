import React from "react"
import { useState } from "react"
import axios from "axios"

export default function NewEvent() {
  const [reminderDate, setReminderDate] = useState("")
  const [state, setState] = useState("")
  const [endDate, setEndDate] = useState("")
  const [eventName, setEventName] = useState("")
  const [eventCategory, setEventCategory] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventPriority, setEventPriority] = useState("")
  const [eventDescription, setEventDescription] = useState("")

  const [openNewEvent, setOpenNewEvent] = useState(false)
  const toggleNewEvent = () => {
    setOpenNewEvent(!openNewEvent)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:3001/api/post/events",
        {
          reminderDate,
          state,
          endDate,
          eventName,
          eventCategory,
          eventDate,
          eventPriority,
          eventDescription,
        }
      )
      console.log("Evento creado: ", response.data)
      //Lógica de cerrar el form aquí
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
              <form onSubmit={handleSubmit} className="flex flex-col w-full">
                <label htmlFor="EventName">Evento</label>
                <input
                  type="text"
                  name="EventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
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
                />
                <label htmlFor="EventCategory">Categoría</label>
                <input
                  type="textbox"
                  name="EventCategory"
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                />
                <div>
                  <input
                    type="checkbox"
                    name="reminder"
                    id="reminder"
                  />
                  <label htmlFor="reminder"> ¿Añadir recordatorio?</label>
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
