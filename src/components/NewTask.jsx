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
          <div className="flex fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-screen bg-opacity-30 bg-black backdrop-blur">
            <div className="flex justify-center text-center p-6 w-1/2 h-fit fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-3xl">
              <button
                onClick={reset}
                className="absolute right-3 h-10 w-10 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-2">
                <i className="fas fa-redo"></i>
              </button>
              <form
                action=""
                onSubmit={(task) => task.preventDefault()}
                className="flex flex-col w-full">
                <label htmlFor="taskName">Tarea</label>
                <input
                  type="text"
                  name="taskName"
                  id="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />

                <label htmlFor="taskDescription">Notas</label>
                <input
                  type="text"
                  name="taskDescription"
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />

                <label htmlFor="taskDate">Hora y fecha</label>
                <input
                  type="datetime-local"
                  name="taskDate"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  required
                />
                <label htmlFor="taskCategory">Categoría</label>
                <input
                  type="text"
                  name="taskCategory"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                />
                <label htmlFor="Prioridad">Prioridad</label>
                <input
                  type="number"
                  name="TaskPriority"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  required
                />
                {addReminder && (
                  <input
                    type="datetime-local"
                    name="reminderDate"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    required
                  />
                )}
                <div>
                  <input type="checkbox" name="reminder" id="reminder" />
                  <label htmlFor="reminder"> ¿Añadir recordatorio?</label>
                  <br />
                  <input type="datetime-local" name="reminderDate" />
                </div>
                <div className="p-2 flex self-center justify-around w-1/2">
                  <button type="reset" onClick={toggleNewTask}>
                    Cancelar
                  </button>
                  <button type="submit" onClick={handleSubmit}>
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
