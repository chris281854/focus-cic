import React from "react"
import { Link } from "react-router-dom"

const Footer = () => {
//links styles
const twLinks = "text-white pl-3 pr-3 hover:text-blue transition-all duration-200"

  return (
    <footer className="footer-welcome flex static bottom-0 h-fit w-full pt-4 pb-4 items-center flex-wrap justify-center bg-[color:var(--primary)]">
        <p>FOCUS PROJECT</p>
        <img src="/Focus Logo Vector Large.png" alt="Logo" />
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
