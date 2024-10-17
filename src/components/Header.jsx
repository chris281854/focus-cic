import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"

const Header = () => {
  const { user, logout, darkMode, toggleDarkMode } = useUser()

  const handleLogOut = () => {
    logout()
  }

  //scroll effect
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (darkMode === "dark") {
      document.querySelector("html").classList.add("dark")
    } else {
      document.querySelector("html").classList.remove("dark")
    }
  }, [])

  //links styles
  const twLinks = "text-white lg:px-3 px-1 text-xs hover:text-blue"

  return (
    <header
      className={`flex top-0 w-full lg:h-20 h-10 items-center z-50 bg-slate-800 dark:bg-slate-900 select-none overflow-hidden text-center`}>
      <Link className="bg-cover w-fit h-full flex items-center p-2">
        <img
          src="/Focus Logo Vector Large.png"
          alt="Logo"
          className="object-contain h-full w-full"
        />
        <h3 className="max-sm:hidden hover:text-accent transition-all">Focus</h3>
      </Link>
      <div className="flex ml-auto items-center">
      <button
          className={`w-fit bg-transparent text-white hover:text-blue-700 content-center`}
          onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode === "light" ? faMoon : faSun} />
        </button>
        <Link to="/welcome" className={twLinks}>
          ¿Comenzando en Focus?
        </Link>
        {user ? (
          <Link onClick={handleLogOut} to="/login" className={twLinks}>
            Cerrar sesión
          </Link>
        ) : (
          <Link to="/login" className={twLinks}>
            Iniciar sesión
          </Link>
        )}
        {!user ? (
          <Link to="/register" className={twLinks}>
            Registrarse
          </Link>
        ) : (
          <></>
        )}
      </div>
    </header>
  )
}

export default Header
