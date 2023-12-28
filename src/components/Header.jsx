import React from "react"

const Header = () => {
  return (
    <header
      className={`${
        scrollY > 0 ? "header-welcome scrolled-header" : "header-welcome"
      }`}>
      <div className="tittle-header">
        <img src="/Focus Logo Vector Large.png" alt="Logo" />
        <h2>Focus</h2>
      </div>
      <div>
        <a href="" className="font-bold text-red-50">About Us</a>
        <a href="">log In</a>
        <a href="">Register</a>
      </div>
    </header>
  )
}

export default Header
