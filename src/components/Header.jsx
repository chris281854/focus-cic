import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Header = () => {
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

  //links styles
  const twLinks = "text-white pl-3 pr-3 hover:text-blue transition-all duration-200"

  return (
    <header
      className={`flex fixed top-0 w-full pt-4 pb-4 items-center justify-between z-50 bg-primary transition-all duration-1000 rounded-b-3xl flex-row ${
        scrollY > 0 ? "bg-opacity-30 bg-black backdrop-blur" : ""
      }`}>
      <Link className="tittle-header hover:text-accent transition-all duration-500">
        <img src="/Focus Logo Vector Large.png" alt="Logo" />
        <h2>Focus</h2>
      </Link>
      <div>
        <Link to="/about-us" className={twLinks}>
          About Us
        </Link>
        <Link to="/" className={twLinks}>
          Log In
        </Link>
        <Link to="/" className={twLinks}>
          Sign Up
        </Link>
      </div>
    </header>
  )
}

export default Header

//Sombreado de header
// const [scrollY, setScrollY] = useState(0)
// useEffect(() => {
//   const handleScroll = () => {
//     setScrollY(window.scrollY)
//   }
//   window.addEventListener("scroll", handleScroll)
//   return () => {
//     window.removeEventListener("scroll", handleScroll)
//   }
// }, [])
