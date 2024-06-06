import React, { useContext, useState } from "react"
import { UserContext } from "../../context/UserContext"
import { useNavigate } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"

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
        navigate("/home")
      } else {
        throw new Error("Registro fallido")
      }
    } catch (error) {
      setError("Datos inválidos")
    }
  }

  return (
    <>
      <Header></Header>
      <div className="flex items-center content-center flex-col bg-white text-primary dark:bg-bg-main-color dark:text-white pb-8">
        <div className="flex flex-col min-h-screen min-w-full items-center">
          <h1>Registro</h1>
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
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="NickName"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Número de teléfono"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <button type="submit">Registrarse</button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
