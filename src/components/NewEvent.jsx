import React from "react"
import { useState, useEffect } from "react"
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
  const [selectedAreas, setSelectedAreas] = useState([])
  const [category, setCategory] = useState(0) //task - event

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:3001/api/post/events",
        {
          reminderDate: addReminder ? reminderDate : null,
          // state,
          endDate: endDate || null,
          eventName,
          category,
          lifeAreaIds: selectedAreas,
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
        <button className="new-event bg-slate-800 m-2" onClick={toggleNewEvent}>
          Nuevo evento
        </button>
        {openNewEvent && (
          <div className="flex fixed z-50 inset-0 bg-opacity-30 bg-black backdrop-blur items-center justify-center">
            <div className="relative p-4 max-w-full sm:w-3/4 md:w-1/2 lg:w-3/4 xl:w-5/12 sm:h-fit min-h-fit max-h-full bg-gray-900 rounded-3xl my-auto overflow-y-scroll no-scrollbar">
              <button
                onClick={reset}
                className="absolute top-3 right-3 h-10 w-10 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full flex items-center justify-center">
                <i className="fas fa-redo"></i>
              </button>
              <form
                onSubmit={handleSubmit}
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
                    checked={addReminder}
                    onChange={(e) => setAddReminder(e.target.checked)}
                    className="text-primary focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="reminder" className="text-white">
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
                <div className="flex justify-around mt-4">
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
      </div>
    </>
  )
}
