import { NavLink, useMatch } from "react-router-dom"
import React from "react"

export default function Panel() {
  const wtActiveLinks = "p-4 bg-primary text-accent transition-all duration-500"
  const wtInactiveLinks = "p-4 bg-bg-bg-main-color text-white transition-all duration-500"
  //Para isActive
  const homeMatch = useMatch("/home")
  const CalendarMatch = useMatch("/home/calendar")

  return (
      <nav className="flex bg-bg-main-color flex-col w-52 h-full content-between border-solid border-2">
        <NavLink
          to="/home"
          className={homeMatch ? wtActiveLinks : wtInactiveLinks}>
          Vista General
        </NavLink>
        <NavLink
          to="/home/calendar"
          className={CalendarMatch ? wtActiveLinks : wtInactiveLinks}>
          Calendario
        </NavLink>
        <NavLink
          to="/home"
          className={homeMatch ? wtActiveLinks : wtInactiveLinks}>
          Etc
        </NavLink>
        <NavLink
          to="/home"
          className={homeMatch ? wtActiveLinks : wtInactiveLinks}>
          Etc
        </NavLink>
        <NavLink
          to="/home"
          className={homeMatch ? wtActiveLinks : wtInactiveLinks}>
          Etc
        </NavLink>
      </nav>
  )
}
