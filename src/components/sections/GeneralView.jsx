import { React, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import NewEvent from "../NewEvent"
import NewTask from "../newTask"
import NewReminder from "../NewReminder"

export default function GeneralView() {

  return (
    <>
      <div className="flex relative p-5 flex-col w-fit">
        <h2>Tareas y Eventos</h2>
        <div className="flex p-4">
          <button>+</button>
          <NewEvent></NewEvent>
          <NewTask></NewTask>
          <NewReminder></NewReminder>
        </div>
        <h2>Hoy</h2>
        <div>Task list</div>
        <h2>Mañana</h2>
        <h2>Semana</h2>
      </div>
    </>
  )
}
