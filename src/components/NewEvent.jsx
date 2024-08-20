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
<<<<<<< HEAD
  const [category, setCategory] = useState(true) //task: true - event: false
=======
  const [category, setCategory] = useState(0) //task - event
>>>>>>> b699f55b392063a13a4d15e985bf21dcc46f2460

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

<<<<<<< HEAD
  //Manejar selección de categoría:
  const handleCategory = () => {
    setCategory(!category)
  }

=======
>>>>>>> b699f55b392063a13a4d15e985bf21dcc46f2460
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
<<<<<<< HEAD
          category: category ? "task" : "event",
=======
          category,
>>>>>>> b699f55b392063a13a4d15e985bf21dcc46f2460
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
<<<<<<< HEAD
                <div className="relative w-fit inline-block align-middle select-none text-left">
=======
                <div>
                  <label
                    htmlFor="EventName"
                    className="block text-white text-left mb-6">
                    Evento
                  </label>
>>>>>>> b699f55b392063a13a4d15e985bf21dcc46f2460
                  <input
                    type="checkbox"
                    id="category"
                    name="category"
                    checked="category"
                    onChange={handleCategory}
                    className="hidden"
                  />
                  <label
                    htmlFor="category"
                    className={`block overflow-hidden cursor-pointer border-0 border-solid rounded-[20px] m-0 ${
                      category ? "bg-orange-500" : "bg-gray-400"
                    }`}>
                    <span
                      className={`block w-[200%] transition-[margin] duration-300 ease-in ${
                        category ? "ml-0" : "-ml-[100%]"
                      }`}>
                      <span className="block float-left w-1/2 h-[34px] p-0 leading-[34px] text-[14px] font-bold text-white box-border uppercase pl-2.5">
                        Tarea
                      </span>
                      <span className="block float-left w-1/2 h-[34px] p-0 leading-[34px] text-[14px] font-bold text-white box-border uppercase pr-2.5 text-right">
                        Evento
                      </span>
                    </span>
                    <span
                      className={` block w-6 m-[5px] bg-white absolute top-0 bottom-0 border-0 border-solid rounded-[20px] transition-all duration-300 ease-in ${
                        category ? "right-0" : "right-[87px]"
                      }`}></span>
                  </label>
                </div>
                <input
                  type="text"
                  name="EventName"
                  id="EventName"
                  placeholder="Nombre"
                  autoFocus
                  value={eventName ?? ""}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                  className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />

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
<<<<<<< HEAD
                <div
                  className={`gap-3 flex ${
                    category ? "justify-evenly" : "justify-evenly flex-wrap"
                  }`}>
                  <div className={` ${category ? "w-full" : "w-6/12"}`}>
=======
                <div className="space-x-4 flex justify-evenly">
                  <div className="w-full">
>>>>>>> b699f55b392063a13a4d15e985bf21dcc46f2460
                    <label
                      htmlFor="EventDate"
                      className="block text-white text-left mb-1">
                      Comienza
                    </label>
                    <input
                      type="datetime-local"
                      name="EventDate"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className={`w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    />
                  </div>
<<<<<<< HEAD
                  {!category && (
                    <div className={` ${category ? "w-full" : "w-5/12"}`}>
                      <label
                        htmlFor="endDate"
                        className="block text-white text-left mb-1">
                        Termina
                      </label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
=======
>>>>>>> b699f55b392063a13a4d15e985bf21dcc46f2460
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
<<<<<<< HEAD
                  className={`block w-40 text-center p-2 rounded-lg m-2 border-none outline-none transition duration-300 text-neutral-950 ${
                    selectedAreas.includes(area.life_area_id)
                      ? "opacity-100 text-opacity-100"
                      : "opacity-50 text-opacity-75"
                  }`}
                  style={{
                    backgroundColor: `${area.color}`,
                  }}>
=======
                  className={`block w-40 text-center p-2 rounded-lg hover:border-blue-700 m-2 border-none outline-none transition duration-300 ${
                    selectedAreas.includes(area.life_area_id)
                      ? "bg-blue-600"
                      : "bg-gray-700"
                  }`}>
>>>>>>> b699f55b392063a13a4d15e985bf21dcc46f2460
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
