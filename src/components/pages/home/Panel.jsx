import { NavLink, useMatch } from "react-router-dom"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHouse,
  faCalendar,
  faGear,
  faMeteor,
  faFolder,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"

export default function Panel({ panelVisibility, setPanelVisibility }) {
  const wtActiveLinks = "bg-slate-500 text-accent"
  const wtInactiveLinks = "bg-bg-bg-main-color text-white"
  //Para isActive
  const homeMatch = useMatch("/home")
  const calendarMatch = useMatch("/home/calendar")
  const contactsMatch = useMatch("/home/contacts")
  const habitsMatch = useMatch("home/habits")
  const settingsMatch = useMatch("/home/settings")

  return (
    <nav
      className={
        "bg-bg-main-color/95 dark:bg-bg-main-color flex sticky whitespace-nowrap top-0 h-screen max-h-screen flex-col transition-all duration-300 overflow-x-hidden justify-items-start text-left scrollbar-none " +
        (panelVisibility ? "w-56 min-w-56" : "w-14 min-w-14")
      }>
      <button
        className={`bg-bg-main-color dark:bg-bg-main-color/95 text-white rounded-none border-0 focus:outline-none ${
          panelVisibility ? "" : "text-accent"
        }`}
        onClick={() => setPanelVisibility(!panelVisibility)}>
        {panelVisibility ? (
          <FontAwesomeIcon icon={faChevronLeft} />
        ) : (
          <FontAwesomeIcon icon={faChevronRight} className="text-accent" />
        )}
      </button>
      <NavLink
        to="/home"
        className={`h-14 transition-all duration-300 flex rounded-2xl ${
          homeMatch ? wtActiveLinks : wtInactiveLinks
        }`}>
        <div className="flex h-full min-w-14 justify-center items-center">
          <FontAwesomeIcon icon={faHouse} />
        </div>
        <div
          className={`content-center ${
            panelVisibility
              ? "opacity-100 mr-2 overflow-hidden"
              : "opacity-0 transition-all duration-200"
          }
            `}>
          Vista principal
        </div>
      </NavLink>
      <NavLink
        to="/home/calendar"
        className={`h-14 transition-all duration-300 flex rounded-2xl ${
          calendarMatch ? wtActiveLinks : wtInactiveLinks
        }`}>
        <div className="flex h-full min-w-14 justify-center items-center">
          <FontAwesomeIcon icon={faCalendar} />
        </div>
        <div
          className={`content-center ${
            panelVisibility
              ? "opacity-100 mr-2 overflow-hidden"
              : "opacity-0 transition-all duration-200"
          }
            `}>
          Calendario
        </div>
      </NavLink>
      <NavLink
        to="/home/habits"
        className={`h-14 transition-all duration-300 flex rounded-2xl ${
          habitsMatch ? wtActiveLinks : wtInactiveLinks
        }`}>
        <div className="flex h-full min-w-14 justify-center items-center">
          <FontAwesomeIcon icon={faFolder} />
        </div>
        <div
          className={`content-center ${
            panelVisibility
              ? "opacity-100 mr-2 overflow-hidden"
              : "opacity-0 transition-all duration-200"
          }
            `}>
          Hábitos
        </div>
      </NavLink>
      <NavLink
        to="/home/settings"
        className={`h-14 transition-all duration-300 flex rounded-2xl ${
          settingsMatch ? wtActiveLinks : wtInactiveLinks
        }`}>
        <div className="flex h-full min-w-14 justify-center items-center">
          <FontAwesomeIcon icon={faGear} />
        </div>
        <div
          className={`content-center ${
            panelVisibility
              ? "opacity-100 mr-2 overflow-hidden"
              : "opacity-0 transition-all duration-200"
          }
            `}>
          Configuración
        </div>
      </NavLink>
    </nav>
  )
}
