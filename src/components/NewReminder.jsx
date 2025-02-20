import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useUser } from "./../context/UserContext"
import { Plus } from "lucide-react"
import dayjs from "dayjs"

export default function NewReminder({
  onReminderCreated,
  setToggleNewReminder,
}) {
  const { user } = useUser()
  const [openNewReminder, setOpenNewReminder] = useState(false)

  const [reminderName, setReminderName] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [reminderEmail, setReminderEmail] = useState(false)
  const today = dayjs().format("YYYY-MM-DD HH:MM")

  const toggleNewReminder = () => {
    setToggleNewReminder(false)
    reset()
  }
  //Close with scape key
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        toggleNewEvent()
      }
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])

  const reset = () => {
    setReminderName("")
    setReminderDate("")
  }

  const handleEmailNotification = () => {
    setReminderEmail(!reminderEmail)
  }

  // const sendEmail = async (formData) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3001/send-email",
  //       formData,
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     console.log("Email sent:", response.data)
  //   } catch (error) {
  //     console.error("Error sending email:", error)
  //   }
  // } //REMOVER ANTES DEL PRÓXIMO PULL REQUEST

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = {
      name: reminderName,
      userId: user.user_id,
      reminderDate,
      reminderMail: reminderEmail,
      reminderName,
    }

    try {
      // Envía el recordatorio al servidor
      const response = await axios.post(
        "http://localhost:3001/api/post/reminders",
        formData,
        { withCredentials: true }
      )

      reset()
      toggleNewReminder()
      onReminderCreated()
      console.log("Recordatorio creado")
    } catch (error) {
      console.error("Error al crear recordatorio: ", error)
    }
  }

  return (
    <>
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
            <label
              htmlFor="reminderName"
              className="block text-white text-left">
              Recordatorio
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              name="reminderName"
              value={reminderName}
              placeholder="Descripción"
              onChange={(e) => setReminderName(e.target.value)}
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
              min={today}
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              required
            />
            <div className="flex ">
              <label
                htmlFor="reminderEmail"
                className="block text-white text-left mb-1">
                Notificación por correo
              </label>
              <input
                type="checkbox"
                name="reminderEmail"
                onClick={handleEmailNotification}
              />
            </div>
            <div className="flex justify-around mt-4">
              <button
                type="reset"
                onClick={toggleNewReminder}
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
    </>
  )
}
