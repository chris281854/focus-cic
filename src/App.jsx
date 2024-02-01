// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Welcome from "./components/pages/Welcome"
import Home from "./components/pages/Home"
import About from "./components/pages/About"
import Contact from "./components/pages/Contact"
import GeneralView from "./components/sections/GeneralView"
import Calendar from "./components/sections/Calendar"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/home/*" element={<Home />}>
            {/* Rutas secundarias dentro de /home */}
            <Route index element={<GeneralView />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
