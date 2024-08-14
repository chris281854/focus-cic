import React, { useContext, useState, useEffect } from "react"
import { Await, useNavigate, Link } from "react-router-dom"
import { UserContext } from "../../context/UserContext"
import { useUser } from "../../context/UserContext"
import Header from "../Header"
import Footer from "../Footer"
import axios from "axios"

export default function Login() {
  const { user, login, loading, updateLifeAreas } = useUser()
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    // Si el usuario ya está autenticado, redirige a la página de inicio
    if (user) {
      navigate("/home")
    }
  }, [loading])

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
        await login(userData)
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
      <Header />
      <div className="bg-gray-100 dark:bg-bg-main-color flex justify-center items-center h-screen">
        {/* <!-- Left: Image --> */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src="public\Wallpaper.jpg"
            alt="Placeholder Image"
            className="object-cover w-full h-full"
          />
        </div>
        {/* <!-- Right: Login Form --> */}
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold mb-4">Inicio de Sesión</h1>
          <form onSubmit={handleSubmit}>
            {/* <!-- Username Input --> */}
            <div className="mb-4">
              <label for="email" className="block text-gray-600 dark:text-white">
                Correo Electrónico
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
                value={email}
                placeholder="Correo Electrónico"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* <!-- Password Input --> */}
            <div className="mb-4">
              <label for="password" className="block text-gray-600 dark:text-white">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
                autocomplete="off"
                placeholder="Contaseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* <!-- Remember Me Checkbox --> */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="text-blue-500"
              />
              <label for="remember" className="text-gray-600 ml-2 dark:text-white">
                Recordarme
              </label>
            </div>
            {/* <!-- Forgot Password Link --> */}
            {/* <div className="mb-6 text-blue-500">
              <a href="#" className="hover:underline">
                ¿Olvidaste la contraseña?
              </a>
            </div> */}
            {/* <!-- Login Button --> */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
              Iniciar sesión
            </button>
          </form>
          {/* <!-- Sign up  Link --> */}
          <div className="mt-6 text-blue-500 text-center">
            <Link to="/register" classNameName="hover:underline">
              Registrarse
            </Link>
          </div>
          {error && <p>{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  )
}
