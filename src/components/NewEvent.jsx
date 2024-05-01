
import React from "react"
import { useState } from "react"

export default function NewEvent({ task, deleteTask, toggleCompleted }) {
  const [openNewEvent, setOpenNewEvent] = useState(false)

  const toggleNewEvent = () => {
    setOpenNewEvent(!openNewEvent)
  }
  function handleChange() {
    toggleCompleted(task.id)
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
              <form
                action=""
                onSubmit={(event) => event.preventDefault()}
                className="flex flex-col w-full">
                <label htmlFor="EventName">Evento</label>
                <input type="text" name="EventName" />
                <label htmlFor="EventNote" value={"Notas"}>
                  Notas
                </label>
                <input type="text" name="EventNote" />
                <label htmlFor="EventDate">Hora y fecha</label>
                <input type="datetime-local" name="EventDate" />
                <div>
                  <input type="checkbox" name="reminder" id="reminder" />
                  <label htmlFor="reminder"> ¿Añadir recordatorio?</label>
                  <br />
                  <input type="datetime-local" name="reminderDate" />
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
