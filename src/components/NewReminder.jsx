import React from "react"
import { useState } from "react"
import sendEmail from "./EmailSender"
import { useUser } from "../context/UserContext"

export default function NewReminder({ onReminderCreated }) {
  const [openNewReminder, setOpenNewReminder] = useState(false)

  const [reminderName, setReminderName] = useState("")
  const [reminderDate, setReminderDate] = useState("")

  const toggleNewReminder = () => {
    setOpenNewReminder(!openNewReminder)
  }

  const reset = () => {
    setReminderName("")
    setReminderDate("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:3001/api/post/reminders",
        {}
      )
      reset()
      toggleNewReminder()
      onReminderCreated()
    } catch (error) {
      console.error("Error al crear recordatorio: ", error)
    }
  }

  return (
    <>
      <div className="relative">
        <button
          className="new-Reminder bg-slate-800"
          onClick={toggleNewReminder}>
          Nuevo Recordatorio
        </button>

        {openNewReminder && (
          <div className="flex fixed z-50 inset-0 bg-opacity-30 bg-black backdrop-blur items-center justify-center">
            <div className="relative p-4 max-w-full sm:w-3/4 md:w-1/2 lg:w-3/4 xl:w-5/12 sm:h-fit min-h-fit max-h-full bg-gray-900 rounded-3xl my-auto overflow-y-scroll no-scrollbar">
              <form
                action=""
                onSubmit={(reminder) => reminder.prReminderDefault()}
                className="flex flex-col w-full space-y-4">
                <label
                  htmlFor="reminderName"
                  className="block text-white text-left mb-6">
                  Recordatorio
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  name="reminderName"
                />
                <label
                  htmlFor="reminderNote"
                  className="block text-white text-left mb-1"
                  value={"Notas"}>
                  Notas
                </label>
                <textarea
                  name="ReminderNote"
                  className="w-full min-h-16 p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <label
                  htmlFor="reminderDate"
                  className="block text-white text-left mb-1">
                  Hora y fecha
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  name="reminderDate"
                />
                <div className="p-2 flex self-center justify-around w-1/2">
                  <button
                    type="reset"
                    className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={toggleNewReminder}>
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
