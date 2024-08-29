import React, { useContext, useState } from "react"
import { UserContext } from "../../context/UserContext"
import { useNavigate, Link } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"
import sendEmail from "../EmailSender"

export default function Register() {
  const { login } = useContext(UserContext)
  const [error, setError] = useState("")

  const [nickName, setNickName] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastName,
          birthDate,
          phoneNumber,
          nickName,
          email,
          password,
        }),
      })
      if (response.ok) {
        const userData = await response.json()
        login(userData)
        try {
          await sendEmail({
            to: email,
            type: "welcome",
            variables: { name, lastName, email },
          })
          console.log("Welcome email sent successfully")
        } catch (error) {
          console.error("Failed to send welcome email", error)
        }
        navigate("/home")
      } else {
        throw new Error("Registro fallido")
      }
    } catch (error) {
      setError("Datos inválidos")
    }
  }

  const emailSender = async () => {
    try {
      await sendEmail({
        to: "josedgonzalez02@gmail.com",
        type: "welcome",
        variables: {
          name: "David",
          lastName: "G",
          email: "josedgonzalez02@gmail.com",
        },
      })
      return console.log("Welcome email sent successfully")
    } catch (error) {
      console.error("Failed to send welcome email", error)
    }
  }

  return (
    <>
      <Header />
      <main className="bg-gray-100 dark:bg-bg-main-color flex justify-center items-center h-screen">
        {/* <!-- Left: Image --> */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src="public\Wallpaper.jpg"
            alt="Placeholder Image"
            className="object-cover w-full h-full"
          />
        </div>
        {/* <!-- Right: Login Form --> */}
        <section className="lg:px-36 md:px-52 sm:px-20 pb-32 w-full lg:w-1/2 mt-24 h-screen overflow-scroll scrollbar-none">
          <h1 className="text-2xl font-semibold mb-4">Registro de Usuario</h1>
          <form onSubmit={handleSubmit}>
            {/* <!-- Email Input --> */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-white">
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
              <label
                htmlFor="password"
                className="block text-gray-600 dark:text-white">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
                autoComplete="off"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 dark:text-white">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-white">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="nickName"
                className="block text-gray-600 dark:text-white">
                Nombre de Usuario
              </label>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-600 dark:text-white">
                Telefono
              </label>
              <input
                type="number"
                name="phone"
                placeholder="Número de teléfono"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="birthDate"
                className="block text-gray-600 dark:text-white">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="birthDate"
                placeholder="Fecha de Nacimiento"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
              />
            </div>
            {/* <!-- Sign up Button --> */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
              Registrarse
            </button>
          </form>
          {/* <!-- Login  Link --> */}
          <div className="mt-6 text-blue-500 text-center">
            <p className="text-white">¿Ya tienes cuenta?</p>
            <Link to="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
          </div>
          {error && <p>{error}</p>}
        </section>
      </main>
      <Footer />
    </>
  )
}
