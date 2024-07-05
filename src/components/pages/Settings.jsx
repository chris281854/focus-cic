import React, { useEffect } from "react"
import { useState } from "react"
import { useUser } from "../../context/UserContext"
import axios from "axios"
import dayjs from "dayjs"

export default function Settings() {
  const { user } = useUser()

  const [onEdition, setOnEdition] = useState(false)
  const [nickName, setNickName] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/get/userData?userId=${userId}`
      )
      setName(response.data.name)
      setLastName(response.data.last_name)
      setNickName(response.data.nickname)
      setBirthDate(dayjs(response.data.birthdate).format("YYYY-MM-DD"))
      setEmail(response.data.email)
      setPhoneNumber(response.data.phone_number)
    } catch (error) {
      console.error("Error al obtener los datos de usuario: ", error)
    }
  }
  useEffect(() => {
    fetchUserData(user.user_id)
  }, [])

  const handleEdition = async (userId) => {
    axios
      .patch(
        `http://localhost:3001/api/updateProfile?userId=${userId}`,
        {
          name,
          lastName,
          birthDate,
          phoneNumber,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("Actualización exitosa:", response.data)
        fetchUserData(user.user_id)
      })
      .catch((error) => {
        console.error(
          "Error al actualizar el perfil de usuario:",
          error.response ? error.response.data : error.message
        )
      })
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
    <>
      <div className="container mx-auto p-4">
        {/* Configuración de Perfil */}
        <section className="mb-8 bg-primary shadow rounded-lg p-6">
          <h1 className="text-5xl font-semibold mb-4">Perfil</h1>
          <div className="mb-8 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Imagen de perfil"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Subir nueva imagen
            </button>
          </div>
          <div className="md:flex md:space-x-4">
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Nombre</label>
              <input
                required
                disabled={onEdition ? "" : "disabled"}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Apellido</label>
              <input
                required
                disabled={onEdition ? "" : "disabled"}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
          </div>
          <div className="md:flex md:space-x-4">
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Nombre de Usuario</label>
              <input
                required
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                disabled={onEdition ? "" : "disabled"}
                type="text"
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Fecha de Nacimiento</label>
              <input
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={onEdition ? "" : "disabled"}
                type="date"
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
          </div>
          <div className="md:flex md:space-x-4">
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Número de Teléfono</label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={onEdition ? "" : "disabled"}
                type="text"
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white">Correo Electrónico</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={onEdition ? "" : "disabled"}
              type="email"
              className="w-full p-2 rounded mt-1 text-black"
            />
          </div>
          {onEdition ? (
            <div className="space-x-4">
              <button
                onClick={() => handleEdition(user.user_id)}
                className="bg-blue-500 text-white px-4 py-2 rounded">
                Guardar
              </button>
              <button
                onClick={() => setOnEdition(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded">
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setOnEdition(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded">
                Editar
              </button>
            </div>
          )}
        </section>
        {/* Personalización */}
        <section className="mb-8 bg-primary shadow rounded-lg p-6">
          <h1 className="text-5xl font-semibold mb-4">Personalización</h1>
          <h2 className="text-2xl font-semibold mb-2">Tema</h2>
          <div className="flex space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"></div>
            <div className="w-8 h-8 bg-red-500 rounded-full cursor-pointer"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full cursor-pointer"></div>
          </div>
        </section>

        {/* Importación/Exportación a Google Calendar */}
        <section className="mb-8 bg-primary shadow rounded-lg p-6">
          <h1 className="text-5xl font-semibold mb-4">Datos</h1>
          <h2 className="text-2xl font-semibold mb-2">Google Calendar</h2>
          <button className="bg-red-500 text-white px-4 py-2 rounded mr-2">
            Importar
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Exportar
          </button>
        </section>

        {/* Configuración de Zona Horaria */}
        <section className="mb-8 bg-primary shadow rounded-lg p-6">
          <h1 className="text-5xl font-semibold mb-4">General</h1>
          <h2 className="text-2xl font-semibold mb-2">Zona Horaria</h2>
          <label className="block text-white">Selecciona tu Zona Horaria</label>
          <select className="w-full p-2 border border-gray-300 rounded mt-1">
            <option value="GMT-12">GMT-12:00</option>
            <option value="GMT-11">GMT-11:00</option>
            <option value="GMT-10">GMT-10:00</option>
            <option value="GMT-9">GMT-09:00</option>
            <option value="GMT-8">GMT-08:00</option>
            <option value="GMT-7">GMT-07:00</option>
            <option value="GMT-6">GMT-06:00</option>
            <option value="GMT-5">GMT-05:00</option>
            <option value="GMT-4">GMT-04:00</option>
            <option value="GMT-3">GMT-03:00</option>
            <option value="GMT-2">GMT-02:00</option>
            <option value="GMT-1">GMT-01:00</option>
            <option value="GMT+0">GMT+00:00</option>
            <option value="GMT+1">GMT+01:00</option>
            <option value="GMT+2">GMT+02:00</option>
            <option value="GMT+3">GMT+03:00</option>
            <option value="GMT+4">GMT+04:00</option>
            <option value="GMT+5">GMT+05:00</option>
            <option value="GMT+6">GMT+06:00</option>
            <option value="GMT+7">GMT+07:00</option>
            <option value="GMT+8">GMT+08:00</option>
            <option value="GMT+9">GMT+09:00</option>
            <option value="GMT+10">GMT+10:00</option>
            <option value="GMT+11">GMT+11:00</option>
            <option value="GMT+12">GMT+12:00</option>
          </select>
        </section>
        <section className="mb-8 bg-primary shadow rounded-lg p-6">
          <div className="mb-4 md:w-1/2">
            <button
              disabled={onEdition ? "" : "disabled"}
              className="w-full p-2 rounded mt-1 text-white bg-secondary">
              Cambiar contraseña
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
