import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useUser } from "../context/UserContext"
import dayjs from "dayjs"

export default function EditItem({ onEdit, setOnEdit, event, task, onEventModified }) {
  const { user } = useUser()
  const [state, setState] = useState(0)
  //Eventos
  const [eventId, setEventId] = useState(event?.event_id)
  const [eventDate, setEventDate] = useState(
    dayjs(event?.date).format("YYYY-MM-DDThh:mm")
  )
  const [endDate, setEndDate] = useState(null)
  const [eventName, setEventName] = useState(event?.name ?? "")
  const [eventCategory, setEventCategory] = useState(event?.category)
  const [eventPriority, setEventPriority] = useState(
    event?.priority_level ?? ""
  )
  const [eventDescription, setEventDescription] = useState(event?.description)

  //Ambos
  const [addEventReminder, setAddEventReminder] = useState(false)
  const [addTaskReminder, setAddTaskReminder] = useState(false)
  const [eventMail, setEventMail] = useState(event?.reminder_id ? true : false)
  const [taskMail, setTaskMail] = useState(task?.reminder_id || false)
  const [eventReminderId, setEventReminderId] = useState(event?.reminder_id)
  const [taskReminderId, setTaskReminderId] = useState(task?.reminder_id)

  const [eventReminderDate, setEventReminderDate] = useState(
    event.reminder_date
  )
  const [taskReminderDate, setTaskReminderDate] = useState(task?.reminder_date)

  //Tareas
  const [taskName, setTaskName] = useState(task?.name ?? "")
  const [taskCategory, setTaskCategory] = useState(task?.category ?? "")
  const [taskDescription, setTaskDescription] = useState(
    task?.description ?? ""
  )
  const [taskPriority, setTaskPriority] = useState(task?.priority_level ?? "")
  const [taskDate, setTaskDate] = useState(task?.date ?? "")

  const toggleEditVisibility = () => {
    reset()
    setOnEdit(false)
  }

  //Reset form
  const reset = () => {
    setEventDate(null)
    setEndDate(null)
    setEventName("")
    setEventCategory("")
    setEventReminderDate(null)
    setEventPriority(3)
    setEventDescription("")
    setAddEventReminder(false)
    setEventMail(false)

    setTaskDate(null)
    setTaskName("")
    setTaskCategory("")
    setTaskReminderDate(null)
    setTaskPriority(3)
    setTaskDescription("")
    setAddTaskReminder(false)
    setTaskMail(false)
  }
  console.log(event.event_id)

  const handleEventUpdate = async (e) => {
    e.preventDefault()

    const updateData = {
      eventReminderDate,
      state,
      endDate: endDate || eventDate,
      eventName,
      eventCategory,
      eventDate,
      eventPriority,
      eventDescription,
      userId: user.user_id,
      eventMail,
      eventId,
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

  useEffect(() => {
    // fetchItemData(user.user_id, event ? event : task, event ? "event" : "task")
  }, [])

  return (
    <>
      {event && (
        <>
          {onEdit && (
            <div className="flex fixed z-50 inset-0 bg-opacity-30 bg-black backdrop-blur">
              <div className="flex flex-col justify-start p-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-auto sm:h-5/6 bg-gray-900 rounded-3xl mx-auto my-auto overflow-scroll no-scrollbar">
                <button
                  onClick={reset}
                  className="static top-3 -right-44 h-10 w-10 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full flex self-end items-center justify-center">
                  <i className="fas fa-redo"></i>
                </button>
                <form
                  onSubmit={(e) => handleEventUpdate(e)}
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
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="Social">Social</option>
                      <option value="Intelectual">Intelectual</option>
                      <option value="Fisico">Fisico</option>
                      <option value="Espiritual">Espiritual</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Familia">Familia</option>
                      <option value="Carrera">Carrera</option>
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
                        <option value="0">Básico</option>
                        <option value="1">Importante + Urgente</option>
                        <option value="2">Importante</option>
                        <option value="3">Urgente</option>
                      </select>
                    </div>
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
                      {" "}
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
                  <div className="flex justify-around mt-4 self">
                    <button
                      type="reset"
                      onClick={toggleEditVisibility}
                      className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      // onClick={handleEventUpdate(event.event_id)}
                      className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
      {task && (
        <>
          {onEdit && (
            <div className="flex fixed z-50 inset-0 bg-opacity-30 bg-black backdrop-blur">
              <div className="flex flex-col justify-start p-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-auto sm:h-5/6 bg-gray-900 rounded-3xl mx-auto my-auto overflow-scroll no-scrollbar">
                <button
                  onClick={reset}
                  className="static top-3 -right-44 h-10 w-10 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full flex self-end items-center justify-center">
                  <i className="fas fa-redo"></i>
                </button>
                <form
                  onSubmit={(e) => handleTaskUpdate(e, task.task_id)}
                  className="flex flex-col w-full space-y-4 -mt-6"
                  id="form">
                  <div>
                    <label
                      htmlFor="taskName"
                      className="block text-white text-left mb-1">
                      Tarea
                    </label>
                    <input
                      type="text"
                      name="taskName"
                      id="taskName"
                      value={taskName ?? ""}
                      onChange={(e) => setTaskName(e.target.value)}
                      required
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="taskDescription">Notas</label>
                    <input
                      type="text"
                      name="taskDescription"
                      id="taskDescription"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="taskCategory"
                      className="block text-white text-left mb-1">
                      Categoría
                    </label>
                    <input
                      type="text"
                      name="taskCategory"
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="taskDate"
                      className="block text-white text-left mb-1">
                      Hora y fecha
                    </label>
                    <input
                      type="datetime-local"
                      name="taskDate"
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      required
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="Prioridad">Prioridad</label>
                    <select
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      id="TaskPriority"
                      name="TaskPriority"
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}>
                      <option value="0">Básico</option>
                      <option value="1">Importante + Urgente</option>
                      <option value="2">Importante</option>
                      <option value="3">Urgente</option>
                    </select>
                  </div>
                  {addTaskReminder && (
                    <input
                      type="datetime-local"
                      name="reminderDate"
                      value={reminderDate}
                      onChange={(e) => setTaskReminderDate(e.target.value)}
                      required
                      className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  )}
                  <div className="flex justify-around mt-4 self">
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
            </div>
          )}
        </>
      )}
    </>
  )
}
