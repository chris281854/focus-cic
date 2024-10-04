import React, { useState, useEffect } from "react"
import { useUser } from "../../context/UserContext"
import { useNavigate, Link } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"
import axios from "axios"
import { GoogleLogin } from "@react-oauth/google"
import clientId from "../../../server/clientId"
import { jwtDecode } from "jwt-decode"

export default function Login() {
  const { user, login, loading } = useUser()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const clientid = clientId()

  const googleResponseMessage = async (response) => {
    console.log("OAuth valid", response)
    const decoded = jwtDecode(response.credential)

    try {
      const token = response.credential
      const google_id = decoded.sub
      const email = decoded.email
      const name = decoded.name
      const nickname = decoded.given_name + Math.random().toString()
      const birthdate = null

      const res = await axios.post(
        "http://localhost:3001/api/googleLogin",
        { token, google_id, email, name, nickname, birthdate },
        { withCredentials: true }
      )

      // Si es exitoso, redirigir al usuario
      if (res.status === 200) {
        const userData = res.data
        await login(userData, rememberMe) // Llama a la función de login de Zustand
        console.log("Iniciando sesión")
        navigate("/home")
        console.log("Exito al iniciar sesión")
      }
    } catch (error) {
      console.error(
        "Error durante el proceso de login:",
        error.response?.data || error.message
      )
    }
  }

  const googleErrorMessage = (error) => {
    console.log("Error OAuth", error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:3001/api/login",
        { email, password },
        { withCredentials: true } //Envía la cookie
      )

      if (response.status === 200) {
        const userData = response.data
        await login(userData, rememberMe) // Llama a la función de login de Zustand
        console.log("Iniciando sesión")
        navigate("/home")
      } else {
        const errorData = await response.json()
        setError(errorData.error)
        console.error(errorData.error)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error) // Error del servidor
        console.error(error.response.data.error)
      } else {
        setError("Error de red o problema con el servidor", error) // Error de red u otro
        console.error("Error de red o problema con el servidor", error)
      }
    }
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center lg:h-screen h-fit overflow-hidden">
        {/* <!-- Left: Image --> */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src="\Wallpaper.jpg"
            alt="Placeholder Image"
            className="object-cover w-full h-full"
          />
        </div>
        {/* <!-- Right: Login Form --> */}
        <div className="lg:px-32 md:px-44 sm:px-10 p-10 w-full lg:w-1/2 items-center flex flex-col lg:h-screen h-fit overflow-scroll">
          <h2 className="mb-4">Inicio de Sesión</h2>
          <div className="border-b pb-8 w-full justify-center flex">
            <GoogleLogin
              onSuccess={googleResponseMessage}
              onError={googleErrorMessage}
              style={{
                backgroundColor: "blue",
              }}
            />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
            {/* <!-- Username Input --> */}
            <div className="">
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-white text-center mb-8">
                O continuar con email
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
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
                autoComplete="off"
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
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember"
                className="text-gray-600 ml-2 dark:text-white">
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
            <Link to="/register" className="hover:underline">
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
