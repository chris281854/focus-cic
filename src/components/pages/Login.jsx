import React, { useContext, useState, useEffect } from "react"
import { Await, useNavigate } from "react-router-dom"
import { UserContext } from "../../context/UserContext"
import { useUser } from "../../context/UserContext"
import Header from "../Header"
import Footer from "../Footer"

export default function Login() {
  const { user , login, loading } = useUser();
  const navigate = useNavigate()
  const [error, setError] = useState("")
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  useEffect(() => {
    // Si el usuario ya está autenticado, redirige a la página de inicio
    if (user) {
      navigate("/home");
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const userData = await response.json()
        login(userData)
        console.log("Iniciando sesión")
        navigate("/home")
      } else {
        const errorData = await response.json()
        setError(errorData.error)
        console.error(errorData.error)
      }
    } catch (error) {
      setError("Error de red o problema con el servidor")
      console.error(error)
    }
  }

  return (
    <>
    <Header></Header>
    <div className="flex items-center content-center flex-col bg-white text-primary dark:bg-bg-main-color dark:text-white pb-8">
    <div className="flex flex-col min-h-screen min-w-full items-center">
      <h1>Inicio de Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
        {error && <p>{error}</p>}
      </form>
    </div>
      </div>
      <Footer></Footer>
    </>
  )
}
