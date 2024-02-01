import React from "react"
import { useState } from "react"

export default function NewTask() {
  const [openNewEvent, setOpenNewEvent] = useState(false)

  const toggleNewTask = () => {
    setOpenNewEvent(!openNewEvent)
  }

  return (
    <>
      <div className="relative">
        <button className="new-task" onClick={toggleNewTask}>
          Nueva tarea
        </button>

        {openNewEvent && (
          <div className="flex fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-screen bg-opacity-30 bg-black backdrop-blur">
            <div className="flex justify-center text-center p-6 w-1/2 h-fit fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-3xl">
              <form
                action=""
                onSubmit={(event) => event.preventDefault()}
                className="flex flex-col w-full">
                <label htmlFor="taskName">Tarea</label>
                <input type="text" name="taskName" id="taskName" />

                <label htmlFor="taskNote">Notas</label>
                <input type="text" name="taskNote" id="taskNote" />

                <label htmlFor="taskDate">Hora y fecha</label>
                <input type="datetime-local" name="taskDate" />

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
