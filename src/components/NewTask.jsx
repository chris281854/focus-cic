import React from "react"
import { useState } from "react"
import axios from "axios"
import { useUser } from "../context/UserContext"

export default function NewTask({ onTaskCreated }) {
  const { user } = useUser()
  const [state, setState] = useState(0)
  const [taskName, setTaskName] = useState("")
  const [taskCategory, setTaskCategory] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [reminderDate, setReminderDate] = useState(null)
  const [taskPriority, setTaskPriority] = useState(3)
  const [taskDate, setTaskDate] = useState("")
  const [addReminder, setAddReminder] = useState(false)
  const [mail, setMail] = useState(false)

  //Abrir panel
  const [openNewTask, setOpenNewTask] = useState(false)
  const toggleNewTask = () => {
    setOpenNewTask(!openNewTask)
  }

  //Reset form
  const reset = () => {
    setTaskDate(null)
    setTaskName("")
    setTaskCategory("")
    setReminderDate(null)
    setTaskPriority(3)
    setTaskDescription("")
    setAddReminder(false)
    setMail(false)
  }

  const handleSubmit = async (task) => {
    task.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:3001/api/post/tasks",
        {
          reminderDate: addReminder ? reminderDate : null,
          state,
          taskName,
          taskCategory,
          taskDate,
          taskPriority,
          taskDescription,
          userId: user.user_id,
          mail,
        }
      )
      console.log("Tarea creada: ", response.data)
      toggleNewTask()
      onTaskCreated()
    } catch (error) {
      console.error("Error al crear la tarea: ", error)
    }
  }

  return (
    <>
      <div className="relative">
        <button className="new-task" onClick={toggleNewTask}>
          Nueva tarea
        </button>

        {openNewTask && (
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
              {addReminder && (
                <input
                  type="datetime-local"
                  name="reminderDate"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                  className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
              <div className="flex justify-around mt-4 self">
                <button
                  type="reset"
                  onClick={toggleNewTask}
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
