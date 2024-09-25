import React, { useState, useEffect } from "react"
import { useUser } from "../../../../context/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faPalette,
  faCalendarAlt,
  faDatabase,
  faGear,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import dayjs from "dayjs"
import TimezoneSelector from "./TimezoneSelector"
import ThemeSelector from "./ThemeSelector"

export default function Settings() {
  const { user, userProfile, updateUserProfile, getUserProfile } = useUser()

  const [onEdition, setOnEdition] = useState(false)
  const [nickName, setNickName] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [activeSection, setActiveSection] = useState("general")
  const [panelVisibility, setPanelVisibility] = useState(true)

  const wtActiveLinks =
    "bg-primary/70 text-white hover:text-primary dark:hover:text-white dark:bg-slate-500 dark:text-accent"
  const wtInactiveLinks =
    "bg-transparent text-gray-700 dark:text-white hover:text-tertiary dark:hover:text-blue-500"

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

  const handleButtonClick = (section) => {
    setActiveSection(section)
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

  return (
    <div className="flex select-none w-full h-screen">
      <nav
        className={`bg-secondary dark:bg-gray-900 flex sticky top-0 h-screen max-h-screen flex-col transition-all duration-300 overflow-x-hidden justify-items-start text-left scrollbar-none ${
          panelVisibility ? "w-56 min-w-56" : "w-14 min-w-14"
        }`}>
        <button
          className={`bg-transparent text-primary dark:text-accent rounded-none border-0 focus:outline-none h-14 flex items-center justify-center ${
            panelVisibility ? "" : "text-tertiary"
          }`}
          onClick={() => setPanelVisibility(!panelVisibility)}>
          <FontAwesomeIcon
            icon={panelVisibility ? faChevronLeft : faChevronRight}
          />
        </button>
        <button
          onClick={() => handleButtonClick("general")}
          className={`h-14 flex items-center transition-all duration-300 rounded-2xl ${
            activeSection === "general" ? wtActiveLinks : wtInactiveLinks
          }`}>
          <div className="flex h-full min-w-14 justify-start items-center">
            <FontAwesomeIcon icon={faGear} />
          </div>
          <div
            className={`content-center ${
              panelVisibility
                ? "opacity-100 mr-2 overflow-hidden"
                : "opacity-0 transition-all duration-200"
            }`}>
            General
          </div>
        </button>
        <button
          onClick={() => handleButtonClick("perfil")}
          className={`h-14 flex items-center transition-all duration-300 rounded-2xl ${
            activeSection === "perfil" ? wtActiveLinks : wtInactiveLinks
          }`}>
          <div className="flex h-full min-w-14 justify-start items-center">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div
            className={`content-center ${
              panelVisibility
                ? "opacity-100 mr-2 overflow-hidden"
                : "opacity-0 transition-all duration-200"
            }`}>
            Perfil
          </div>
        </button>
        <button
          onClick={() => handleButtonClick("personalizacion")}
          className={`h-14 flex items-center transition-all duration-300 rounded-2xl ${
            activeSection === "personalizacion"
              ? wtActiveLinks
              : wtInactiveLinks
          }`}>
          <div className="flex h-full min-w-14 justify-start items-center">
            <FontAwesomeIcon icon={faPalette} />
          </div>
          <div
            className={`content-center ${
              panelVisibility
                ? "opacity-100 mr-2 overflow-hidden"
                : "opacity-0 transition-all duration-200"
            }`}>
            Personalización
          </div>
        </button>
        <button
          onClick={() => handleButtonClick("datos")}
          className={`h-14 flex items-center transition-all duration-300 rounded-2xl ${
            activeSection === "datos" ? wtActiveLinks : wtInactiveLinks
          }`}>
          <div className="flex h-full min-w-14 justify-start items-center">
            <FontAwesomeIcon icon={faDatabase} />
          </div>
          <div
            className={`content-center ${
              panelVisibility
                ? "opacity-100 mr-2 overflow-hidden"
                : "opacity-0 transition-all duration-200"
            }`}>
            Exportación de Datos
          </div>
        </button>
      </nav>
      <div className="w-full overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
        {activeSection === "general" && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              General
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Zona Horaria
              </h3>
              <TimezoneSelector />
            </div>
          </section>
        )}
        {activeSection === "perfil" && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Editar perfil
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 dark:text-white">
                    Nombre
                  </label>
                  <input
                    required
                    disabled={!onEdition}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded mt-1 bg-secondary/40 dark:!bg-gray-600 text-gray-900 dark:text-white disabled:!text-gray-600 dark:disabled:!text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-white">
                    Apellido
                  </label>
                  <input
                    required
                    disabled={!onEdition}
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 rounded mt-1 bg-secondary/40 dark:!bg-gray-600 text-gray-900 dark:text-white disabled:!text-gray-600 dark:disabled:!text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-white">
                    Nombre de Usuario
                  </label>
                  <div
                    title="No puede modificar su nombre de usuario"
                    className="bg-gray-200 dark:bg-gray-600 w-full h-10 rounded mt-1 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    @{nickName}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-white">
                    Fecha de Nacimiento
                  </label>
                  <input
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    disabled={!onEdition}
                    type="date"
                    className="w-full p-2 rounded mt-1 !bg-secondary/40 dark:!bg-gray-600 text-gray-900 dark:text-white disabled:!text-gray-600 dark:disabled:!text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-white">
                    Número de Teléfono
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!onEdition}
                    type="text"
                    className="w-full p-2 rounded mt-1 bg-secondary/40 dark:!bg-gray-600 text-gray-900 dark:text-white disabled:!text-gray-600 dark:disabled:!text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-white">
                    Correo Electrónico
                  </label>
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!onEdition}
                    type="email"
                    className="w-full p-2 rounded mt-1 bg-secondary/40 dark:!bg-gray-600 text-gray-900 dark:text-white disabled:!text-gray-600 dark:disabled:!text-gray-300"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                {onEdition ? (
                  <>
                    <button
                      onClick={cancelEdition}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300">
                      Cancelar
                    </button>
                    <button
                      onClick={handleEdition}
                      className="bg-primary hover:bg-tertiary dark:bg-slate-600 dark:hover:bg-slate-500 text-white px-4 py-2 rounded transition duration-300">
                      Guardar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setOnEdition(true)}
                    className="bg-primary hover:bg-tertiary dark:bg-slate-600 dark:hover:bg-slate-500 text-white px-4 py-2 rounded transition duration-300">
                    Editar
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
        {activeSection === "personalizacion" && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Personalización
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <ThemeSelector />
            </div>
          </section>
        )}
        {activeSection === "datos" && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Exportación de Datos
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Google Calendar
              </h3>
              <div className="flex space-x-4">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300">
                  Importar
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300">
                  Exportar
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
