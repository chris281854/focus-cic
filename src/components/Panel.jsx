import { NavLink, useMatch } from "react-router-dom"
import React from "react"

export default function Panel({ panelVisibility, setPanelVisibility }) {
  const wtActiveLinks =
    "p-4 bg-primary text-accent transition-all duration-500 flex"
  const wtInactiveLinks =
    "p-4 bg-bg-bg-main-color text-white transition-all duration-500 flex"
  //Para isActive
  const homeMatch = useMatch("/home")
  const calendarMatch = useMatch("/home/calendar")
  const contactsMatch = useMatch("/home/contacts")
  const habitsMatch = useMatch("home/habits")
  const settingsMatch = useMatch("/home/settings")

  return (
    <nav
      className={
        "bg-bg-main-color flex sticky whitespace-nowrap top-0 h-full max-h-screen flex-col transition-all duration-300 overflow-y-scroll overflow-x-hidden justify-items-start text-left scrollbar-none " +
        (panelVisibility
          ? "w-56 min-w-56"
          : "w-14 min-w-14")
      }>
      <button
        className={
          panelVisibility
            ? "bg-bg-main-color border-0 focus:outline-none"
            : "bg-bg-main-color text-accent border-0 focus:outline-none"
        }
        onClick={() => setPanelVisibility(!panelVisibility)}>
        {panelVisibility ? "<" : ">"}
      </button>
      <NavLink
        to="/home"
        className={homeMatch ? wtActiveLinks : wtInactiveLinks}>
        <div className="flex w-8 justify-start">🏠</div>
        <div
          className={
            (panelVisibility ? "opacity-100 mr-2 overflow-hidden" : "opacity-0 transition-all duration-200")
          }>
          Vista Principal
        </div>
      </NavLink>
      <NavLink
        to="/home/calendar"
        className={calendarMatch ? wtActiveLinks : wtInactiveLinks}>
        <div className="flex w-8 justify-start">📅</div>
        <div
          className={
            (panelVisibility ? "opacity-100 mr-2 overflow-hidden" : "opacity-0 transition-all duration-200")
          }>
          Calendario
        </div>
      </NavLink>
      <NavLink
        to="/home/contacts"
        className={contactsMatch ? wtActiveLinks : wtInactiveLinks}>
        <div className="flex w-8 justify-start">📞</div>
        <div
          className={
            (panelVisibility ? "opacity-100 mr-2 overflow-hidden" : "opacity-0 transition-all duration-200")
          }>
          Mis contactos
        </div>
      </NavLink>
      <NavLink
        to="/home/habits"
        className={habitsMatch ? wtActiveLinks : wtInactiveLinks}>
        <div className="flex w-8 justify-start">💪</div>
        <div
          className={
            (panelVisibility ? "opacity-100 mr-2 overflow-hidden" : "opacity-0 transition-all duration-200")
          }>
          Hábitos
        </div>
      </NavLink>
      <NavLink
        to="/home/settings"
        className={settingsMatch ? wtActiveLinks : wtInactiveLinks}>
        <div className="flex w-8 justify-start">⚙</div>
        <div
          className={
            (panelVisibility ? "opacity-100 mr-2 overflow-hidden" : "opacity-0 transition-all duration-200")
          }>
          Configuración
        </div>
      </NavLink>
    </nav>
  )
}
