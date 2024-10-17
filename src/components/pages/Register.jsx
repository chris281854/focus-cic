import React, { useState, useEffect } from "react"
import { useUser } from "../../context/UserContext"
import { useNavigate, Link } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"
import sendEmail from "../EmailSender"
import axios from "axios"
import { GoogleLogin } from "@react-oauth/google"

export default function Register() {
  const { login, user } = useUser() // Usamos Zustand en lugar de useContext
  const [error, setError] = useState("")

  const [nickName, setNickName] = useState("")
  const [isNickNameValid, setIsNickNameValid] = useState(true)
  const [isNickNameAvailable, setIsNickNameAvailable] = useState(undefined)
  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [email, setEmail] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [isEmailAvailable, setIsEmailAvailable] = useState(null)
  const [password, setPassword] = useState("")
  const [isValidPassword, setIsValidPassword] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // Si el usuario ya está autenticado, redirige a la página de inicio
    if (user) {
      navigate("/home")
    }
  }, [user, navigate])

  useEffect(() => {
    if (email && isValidEmail) {
      setIsEmailAvailable(null) // Reiniciar el estado mientras se analiza
      axios
        .post("http://localhost:3001/api/emailDisponibility", { email })
        .then((response) => {
          setIsEmailAvailable(response.data)
          console.log("email disp", response.data)
        })
        .catch(() => {
          setIsEmailAvailable(false)
        })
    }
  }, [email, isValidEmail])

  useEffect(() => {
    setIsNickNameAvailable(null) // Reiniciar el estado mientras se analiza
    if (nickName && isNickNameValid) {
      axios
        .post("http://localhost:3001/api/userDisponibility", { nickName })
        .then((response) => {
          setIsNickNameAvailable(response.data)
          console.log("nickname disp", response.data)
        })
        .catch(() => setIsNickNameAvailable(false))
    }
  }, [nickName, isNickNameValid])

  const handlePasswordChange = (e) => {
    const pwd = e.target.value
    setPassword(pwd)
    setIsValidPassword(pwd.length >= 8)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:3001/api/register",
        {
          name,
          birthDate,
          nickName,
          email,
          password,
        },
        { withCredentials: true }
      )
      if (response.status === 200) {
        const userData = response.data
        login(userData) // Llama a la función de login del store de Zustand
        // try {
        //   await sendEmail({
        //     to: email,
        //     type: "welcome",
        //     variables: { name, email },
        //   })
        //   console.log("Welcome email sent successfully")
        // } catch (error) {
        //   console.error("Failed to send welcome email", error)
        // }
        navigate("/home")
      } else {
        throw new Error("Registro fallido")
      }
    } catch (error) {
      setError("Datos inválidos")
    }
  }

  const handleNickNameChange = (e) => {
    const nick = e.target.value
    setNickName(nick)
    const pattern = /^[a-zA-Z0-9_]+$/
    setIsNickNameValid(pattern.test(nick))
  }

  const handleEmailChange = (e) => {
    const mail = e.target.value
    setEmail(mail)
    setIsEmailAvailable(null)
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/
    setIsValidEmail(emailPattern.test(mail))
    console.log(emailPattern.test(mail))
    if (nickName && isNickNameValid) {
      axios
        .post("http://localhost:3001/api/userDisponibility", { nickName })
        .then((response) => {
          setIsNickNameAvailable(response.data)
          console.log("nickname disp", response.data)
        })
        .catch(() => setIsNickNameAvailable(false))
    }
  }

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

  const isFormValid =
    isValidEmail &&
    isEmailAvailable &&
    isValidPassword &&
    isNickNameValid &&
    isNickNameAvailable &&
    name &&
    birthDate

  return (
    <>
      <Header />
      <main className="flex justify-center lg:h-screen h-fit overflow-hidden">
        {/* <!-- Left: Image --> */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src="public\Wallpaper.jpg"
            alt="Placeholder Image"
            className="object-cover w-full h-full"
          />
        </div>
        {/* <!-- Right: Login Form --> */}
        <section className="lg:px-32 md:px-44 sm:px-10 p-10 w-full lg:w-1/2 items-center flex flex-col lg:h-screen h-fit overflow-y-scroll">
          <h2 className="mb-4 text-center">Registrarse con Google</h2>
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
            {/* <!-- Email Input --> */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-white text-center mb-8">
                O crear cuenta con Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
                value={email}
                placeholder="Correo Electrónico"
                onChange={handleEmailChange}
              />
              {email && !isValidEmail && (
                <p className="text-red-600">
                  Este correo electrónico no es válido
                </p>
              )}
              {email && isEmailAvailable === false && (
                <p className="text-red-600">
                  Este correo electrónico no está disponible
                </p>
              )}
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
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 !bg-slate-800 text-white"
                autoComplete="off"
                minLength={8}
                placeholder="Contraseña"
                value={password}
                required
                onChange={handlePasswordChange}
              />
              {password && !isValidPassword && (
                <p className="text-red-600">
                  La contraseña debe tener más de 8 caracteres
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-600 dark:text-white">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
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
                pattern="[a-zA-Z0-9_]+"
                onChange={handleNickNameChange}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-slate-800 text-white"
              />
              {nickName && !isNickNameValid && (
                <p className="text-red-600">
                  El nombre de usuario no es válido (sólo letras, números y
                  guiones bajos)
                </p>
              )}
              {nickName && isNickNameAvailable === false && (
                <p className="text-red-600">
                  El nombre de usuario ya está en uso
                </p>
              )}
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
                min={"1910-01-01"}
                max={"2015-01-01"}
                required
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 !bg-slate-800 text-white"
              />
            </div>
            {/* <!-- Sign up Button --> */}
            <button
              type="submit"
              disabled={
                !isValidPassword ||
                !isValidEmail ||
                !isEmailAvailable ||
                !isNickNameValid ||
                !isNickNameAvailable
              }
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full disabled:hover:bg-blue-500 disabled:cursor-not-allowed">
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
