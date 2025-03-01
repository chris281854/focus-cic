import { NavLink, useMatch } from "react-router-dom"
import React from "react"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHouse,
  faCalendar,
  faGear,
  faMeteor,
  faFolder,
  faChevronLeft,
  faChevronRight,
  faSun,
  faMoon,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"
import { Moon, Sun } from "lucide-react"
import { useUser } from "../../../context/UserContext"

export default function Panel({ panelVisibility, setPanelVisibility }) {
  const wtActiveLinks =
    "bg-tertiary text-white hover:text-primary dark:hover:text-white dark:bg-slate-500 dark:text-accent"
  const wtInactiveLinks =
    "bg-transparent text-gray-700 dark:text-white hover:text-tertiary dark:hover:text-blue-500"
  //Para isActive
  const homeMatch = useMatch("/home")
  const calendarMatch = useMatch("/home/calendar")
  const contactsMatch = useMatch("/home/contacts")
  const habitsMatch = useMatch("home/habits")
  const settingsMatch = useMatch("/home/settings")
  const { user, logout, darkMode, toggleDarkMode } = useUser()
  const handleLogOut = () => {
    logout()
  }

  useEffect(() => {
    if (darkMode === "dark") {
      document.querySelector("html").classList.add("dark")
    } else {
      document.querySelector("html").classList.remove("dark")
    }
  }),
    []

  return (
    <nav
      className={
        "bg-secondary/70 dark:bg-bg-main-color flex sticky whitespace-nowrap top-0 h-screen max-h-screen max-w-14 flex-col transition-all duration-300 overflow-x-hidden justify-items-start text-left scrollbar-none" +
        (panelVisibility ? "w-56 min-w-56" : "w-14 min-w-14")
      }>
      <button
        className={`bg-transparent text-primary dark:text-accent rounded-none border-0 focus:outline-none ${
          panelVisibility ? "" : "text-tertiary"
        }`}
        onClick={() => setPanelVisibility(!panelVisibility)}>
        {panelVisibility ? (
          <FontAwesomeIcon icon={faChevronLeft} />
        ) : (
          <FontAwesomeIcon icon={faChevronRight} className="dark:text-accent" />
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
      <section className="mt-auto bg-secondary dark:bg-bg-main-color">
        <button
          className={`w-full bg-transparent text-gray-900 dark:text-white hover:text-blue-700 transition-all duration-300 content-center`}
          onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode === "light" ? faMoon : faSun} />
        </button>
        <NavLink
          onClick={handleLogOut}
          to="/login"
          className={`h-14 text-gray-900  dark:text-white transition-all duration-300 flex rounded-2xl`}>
          <div className="flex h-full min-w-14 justify-center items-center">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </div>
          <div
            className={`content-center ${
              panelVisibility
                ? "opacity-100 mr-2 overflow-hidden"
                : "opacity-0 transition-all duration-200"
            }
            `}>
            Cerrar Sesión
          </div>
        </NavLink>
      </section>
    </nav>
  )
}
