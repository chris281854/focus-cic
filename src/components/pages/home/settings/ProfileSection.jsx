import { useState, useEffect } from "react"
import { useUser } from "../../../../context/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown, faTruckPlane } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import dayjs from "dayjs"
import TimezoneSelector from "./TimezoneSelector"
import ThemeSelector from "./ThemeSelector"

export default function ProfileSection() {
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

  // New state for password change section
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)

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
  console.log(user.user_id)

  const verifyCurrentPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/verifyPassword",
        {
          userId: user.user_id,
          password: currentPassword,
          userNickName: userProfile.nickname,
        },
        {
          withCredentials: true,
        }
      )
      setIsPasswordVerified(response.data.verified)
    } catch (error) {
      console.error("Error al verificar la contraseña:", error)
      setIsPasswordVerified(false)
    }
  }
  console.log(isPasswordVerified)

  const changePassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/api/changePassword",
        {
          userIdd: user.user_id,
          password: newPassword,
        },
        {
          withCredentials: faTruckPlane,
        }
      )
      console.log("Contraseña cambiada exitosamente", response.data)
      setShowPasswordSection(false)
      setCurrentPassword("")
      setNewPassword("")
      setIsPasswordVerified(false)
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error)
    }
  }

  return (
    <>
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
      {/* New Password Change Section */}
      <section className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <button
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="flex items-center justify-between w-full text-left text-gray-700 dark:text-white hover:text-primary dark:hover:text-primary-light transition duration-300 bg-transparent">
          <span className="text-xl font-semibold">Cambiar Contraseña</span>
          <FontAwesomeIcon
            icon={showPasswordSection ? faChevronUp : faChevronDown}
          />
        </button>

        {showPasswordSection && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-white mb-2">
                Contraseña Actual
              </label>
              <div className="flex">
                <input
                  type="password"
                  autocomplete="off"
                  value={currentPassword}
                  require
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="flex-grow p-2 rounded-l bg-secondary/40 dark:bg-gray-600 text-gray-900 dark:text-white"
                />
                <button
                  onClick={verifyCurrentPassword}
                  className="bg-primary hover:bg-tertiary dark:bg-slate-600 dark:hover:bg-slate-500 text-white px-4 py-2 rounded-r transition duration-300">
                  Verificar
                </button>
              </div>
            </div>

            {isPasswordVerified && (
              <div>
                <label className="block text-gray-700 dark:text-white mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 rounded bg-secondary/40 dark:bg-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowPasswordSection(false)
                  setCurrentPassword("")
                  setNewPassword("")
                  setIsPasswordVerified(false)
                }}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded transition duration-300">
                Cancelar
              </button>
              <button
                onClick={changePassword}
                disabled={!isPasswordVerified || !newPassword}
                className={`${
                  isPasswordVerified && newPassword
                    ? "bg-primary hover:bg-tertiary dark:bg-slate-600 dark:hover:bg-slate-500"
                    : "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                } text-white px-4 py-2 rounded transition duration-300`}>
                Confirmar Cambio
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
