import React from "react"
import { Link } from "react-router-dom"

const Footer = () => {
//links styles
const twLinks = "text-white pl-3 pr-3 hover:text-blue transition-all duration-200"

const footerClass = "flex relative h-fit w-full pt-4 pb-4 items-center flex-wrap justify-center bg-primary z-40"


  return (
    <footer className="flex place-self-end w-full pt-4 pb-4 items-center flex-wrap justify-center bg-slate-800 dark:bg-slate-900 z-40 select-none">
        <img src="/Focus Logo Vector Large.png" alt="Logo" className="object-contain w-20 h20 ml-1"/>
        <div id="footer-links">
        <Link to="/welcome" className={twLinks}>
          ¿Comenzando en Focus?
        </Link>
        <Link to="/about-us" className={twLinks}>
          Sobre nosotros
        </Link>
        <Link to="/contact-us" className={twLinks}>
          Contáctanos
        </Link>
        </div>
      </footer>
  )
}

export default Footer
