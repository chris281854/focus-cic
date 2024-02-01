import React from "react"
import { useState } from "react"

export default function NewReminder() {
  const [openNewReminder, setOpenNewReminder] = useState(false)

  const toggleNewReminder = () => {
    setOpenNewReminder(!openNewReminder)
  }

  return (
    <>
      <div className="relative">
        <button className="new-Reminder" onClick={toggleNewReminder}>
          Recordatorio
        </button>

        {openNewReminder && (
          <div className="flex fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-screen bg-opacity-30 bg-black backdrop-blur">
            <div className="flex justify-center text-center p-6 w-1/2 h-fit fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-3xl">
              <form
                action=""
                onSubmit={(reminder) => reminder.prReminderDefault()}
                className="flex flex-col w-full">
                <label htmlFor="reminderName">Recordatorio</label>
                <input type="text" name="reminderName" />
                <label htmlFor="reminderNote" value={"Notas"}>
                  Notas
                </label>
                <input type="text" name="reminderNote" />
                <label htmlFor="reminderDate">Hora y fecha</label>
                <input type="datetime-local" name="reminderDate" />
                <div className="p-2 flex self-center justify-around w-1/2">
                  <button type="reset" onClick={toggleNewReminder}>
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
