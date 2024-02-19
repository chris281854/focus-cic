import React from "react"
import { Link } from "react-router-dom"

const Footer = () => {
//links styles
const twLinks = "text-white pl-3 pr-3 hover:text-blue transition-all duration-200"

const footerClass = "flex relative h-52 w-full pt-4 pb-4 items-center flex-wrap justify-center bg-primary z-40"


  return (
    <footer className={footerClass}>
        <img src="/Focus Logo Vector Large.png" alt="Logo" className="ml-1"/>
        <h2>FOCUS PROJECT</h2>
        <div id="footer-links">
        <Link to="/welcome" className={twLinks}>
          ¿Starting in Focus?
        </Link>
        <Link to="/about-us" className={twLinks}>
          About Us
        </Link>
        <Link to="/contact-us" className={twLinks}>
          Contact Us
        </Link>
        </div>
      </footer>
  )
}

export default Footer
