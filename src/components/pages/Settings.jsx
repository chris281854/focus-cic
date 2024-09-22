import React, { useState, useEffect } from "react"
import { useUser } from "../../context/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faPalette,
  faCalendarAlt,
  faDatabase,
  faGear,
} from "@fortawesome/free-solid-svg-icons" // Importar íconos
import axios from "axios"
import Footer from "../Footer"
import dayjs from "dayjs"

export default function Settings() {
  const { user, userProfile, updateUserProfile, getUserProfile } = useUser()

  const [onEdition, setOnEdition] = useState(false)
  const [nickName, setNickName] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [activeSection, setActiveSection] = useState("general") // Estado para controlar la sección activa

  const wtActiveLinks = "bg-slate-500 text-accent"
  const wtInactiveLinks = "bg-transparent text-white hover:text-blue-600"

  useEffect(() => {
    getUserProfile()
  }, [onEdition])

  useEffect(() => {
    setName(userProfile.name)
    setLastName(userProfile.last_name)
    setNickName(userProfile.nickname)
    setBirthDate(dayjs(userProfile.birthdate).format("YYYY-MM-DD"))
    setEmail(userProfile.email)
    setPhoneNumber(userProfile.phone_number)
  }, [userProfile])

  const handleEdition = async () => {
    axios
      .patch(
        `http://localhost:3001/api/updateProfile?userId=${user.user_id}`,
        {
          name,
          lastName,
          birthDate,
          phoneNumber,
          email,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Actualización exitosa:", response.data)
        setOnEdition(false)
      })
      .catch((error) => {
        console.error(
          "Error al actualizar el perfil de usuario:",
          error.response ? error.response.data : error.message
        )
      })
  }

  const cancelEdition = () => {
    getUserProfile()
    setOnEdition(false)
  }

  const changePassword = async (userId) => {
    try {
      const response = await fetch("http://localhost:3001/api/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ user_id: userId, password: newPassword }),
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Contraseña creada exitosamente", data)
      } else {
        const errorData = await response.json()
        console.error("Error al cambiar la contraseña", errorData.error)
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error)
    }
  }

  const handleButtonClick = (section) => {
    setActiveSection(section)
  }

  return (
    <div className="flex select-none w-full h-screen">
      <nav className="flex-1 bg-gray-800 dark:bg-gray-900 flex sticky top-0 h-screen max-h-screen flex-col transition-all duration-300 w-56 min-w-56 pt-11">
        <button
          onClick={() => handleButtonClick("general")}
          className={`h-14 flex items-center transition-all duration-300 rounded-2xl space-x-2 px-4 ${
            activeSection === "general" ? wtActiveLinks : wtInactiveLinks
          }`}>
          <FontAwesomeIcon icon={faGear} />
          <span>General</span>
        </button>
        <button
          onClick={() => handleButtonClick("perfil")}
          className={`h-14 flex items-center transition-all duration-300 rounded-2xl space-x-2 px-4 ${
            activeSection === "perfil" ? wtActiveLinks : wtInactiveLinks
          }`}>
          <FontAwesomeIcon icon={faUser} />
          <span>Perfil</span>
        </button>
        <button
          onClick={() => handleButtonClick("personalizacion")}
          className={`h-14 flex items-center transition-all duration-300 rounded-2xl space-x-2 px-4 ${
            activeSection === "personalizacion"
              ? wtActiveLinks
              : wtInactiveLinks
          }`}>
          <FontAwesomeIcon icon={faPalette} />
          <span>Personalización</span>
        </button>
        <button
          onClick={() => handleButtonClick("datos")}
          className={`h-14 flex items-center transition-all duration-300 rounded-2xl space-x-2 px-4 ${
            activeSection === "datos" ? wtActiveLinks : wtInactiveLinks
          }`}>
          <FontAwesomeIcon icon={faDatabase} />
          <span>Exportación de Datos</span>
        </button>
      </nav>
      <div className="w-full overflow-scroll">
        {/* General Section */}
        {activeSection === "general" && (
          <section className="mb-8 p-6 w-full">
            <h1 className="text-5xl font-semibold mb-4">General</h1>
            <h2 className="text-2xl font-semibold mb-2">Zona Horaria</h2>
            <label className="block text-white">
              Selecciona tu Zona Horaria
            </label>
            <select className="w-full p-2 border border-gray-300 rounded mt-1">
              {/* Opciones de zona horaria */}
              <option value="GMT-12">GMT-12:00</option>
              <option value="GMT+12">GMT+12:00</option>
              {/* Más opciones... */}
            </select>
          </section>
        )}
        {/* Perfil Section */}
        {activeSection === "perfil" && (
          <section className="flex flex-col md:flex-row mb-8 p-6 w-full space-y-6 md:space-y-0 md:space-x-6">
            {/* Sección del formulario */}
            <div className="md:w-2/3 space-y-6">
              <h2>Editar perfil</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white">Nombre</label>
                  <input
                    required
                    disabled={!onEdition}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="block text-white">Apellido</label>
                  <input
                    required
                    disabled={!onEdition}
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 rounded mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white ">Nombre de Usuario</label>
                  <div
                    title="No puedes modificar tu nombre de usuario"
                    className="bg-slate-800 hover:bg-slate-900 transition-all w-full h-10 rounded mt-1 content-center p-2 text-slate-300 select-text">
                    <label>@{nickName}</label>
                  </div>
                </div>
                <div>
                  <label className="block text-white">
                    Fecha de Nacimiento
                  </label>
                  <input
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    disabled={!onEdition}
                    type="date"
                    className="w-full p-2 rounded mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white">Número de Teléfono</label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!onEdition}
                    type="text"
                    className="w-full p-2 rounded mt-1 text-black"
                  />
                </div>
                <div>
                  <label className="block text-white">Correo Electrónico</label>
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!onEdition}
                    type="email"
                    className="w-full p-2 rounded mt-1 text-black"
                  />
                </div>
              </div>

              {/* Botones de edición */}
              <div className="flex space-x-4">
                {onEdition ? (
                  <>
                    <button
                      onClick={() => handleEdition()}
                      className="bg-blue-500 text-white px-4 py-2 rounded">
                      Guardar
                    </button>
                    <button
                      onClick={() => cancelEdition()}
                      className="bg-red-500 text-white px-4 py-2 rounded">
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setOnEdition(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded">
                    Editar
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
        {/* Personalización Section */}
        {activeSection === "personalizacion" && (
          <section className="mb-8 shadow rounded-lg p-6">
            <h1 className="text-5xl font-semibold mb-4">Personalización</h1>
            <h2 className="text-2xl font-semibold mb-2">Tema</h2>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer"></div>
              <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"></div>
              <div className="w-8 h-8 bg-red-500 rounded-full cursor-pointer"></div>
              <div className="w-8 h-8 bg-yellow-500 rounded-full cursor-pointer"></div>
            </div>
          </section>
        )}
        {/* Datos Section */}
        {activeSection === "datos" && (
          <section className="mb-8 shadow rounded-lg p-6">
            <h1 className="text-5xl font-semibold mb-4">Datos</h1>
            <h2 className="text-2xl font-semibold mb-2">Google Calendar</h2>
            <button className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              Importar
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Exportar
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
