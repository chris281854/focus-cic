import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"

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
  const twLinks =
    "text-white pl-3 pr-3 hover:text-blue transition-all duration-200"

  return (
    <header
      className={`flex top-0 w-full h-20 items-center justify-between z-50 bg-slate-800 dark:bg-slate-900 transition-all duration-300 flex-row select-none`}>
      <Link className="hover:text-accent transition-all bg-cover duration-500 w-fit h-full flex items-center p-3">
        <img src="/Focus Logo Vector Large.png" alt="Logo" className="object-contain h-full w-full" />
        <h2>Focus</h2>
      </Link>
      <div>
        <button
          className="border-2 border-white bg-transparent focus:outline-none w-16 transition-all"
          onClick={toggleDarkMode}>
          {darkMode === "dark" ? "💡" : "🌙"}
        </button>
        <Link to="/about-us" className={twLinks}>
          Sobre nosotros
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
