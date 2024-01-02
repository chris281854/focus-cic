import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import Welcome from './components/pages/Welcome'
import Mainpage from './components/pages/Mainpage'

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/home' element={<Welcome />} />
      <Route path='/main' element={<Mainpage />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
