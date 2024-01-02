import React, { useEffect, useState } from "react"


const Header = () => {
  //scroll effect
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  

  //links styles
  const twClasses = 'text-white pl-3 pr-3 hover:text-blue';
  const linksArray = [
    { id: 1, texto: 'About Us', url: '/About Us' },
    { id: 2, texto: 'Log In', url: '/' },
    { id: 3, texto: 'Sign Up', url: '/' },
  ];

  return (
    
    <header className={`flex fixed top-0 w-full pt-4 pb-4 items-center justify-between z-50 bg-primary transition-all duration-1000 rounded-b-3xl flex-row ${scrollY > 0 ? 'bg-opacity-30 bg-black backdrop-blur' : ''}`}>
      <div className="tittle-header">
        <img src="/Focus Logo Vector Large.png" alt="Logo" />
        <h2>Focus</h2>
      </div>
      <div>
      {linksArray.map((link) => (
        <a key={link.id} href={link.url} className={twClasses}>
          {link.texto}
        </a>
      ))}
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