import React, { useEffect } from "react"
import { useState } from "react"
import { useUser } from "../../context/UserContext"
import axios from "axios"

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

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/get/userData?userId=${userId}`
        )
        setName(response.data.name)
        setLastName(response.data.last_name)
      } catch (error) {
        console.error("Error al obtener las tareas: ", error)
      }
    }
    fetchUserData(user.user_id)
  }, [])

  const handleEdition = async (userId) => {
    
    try {
      const response = await axios.get(
        `http://localhost:3001/api/get/userData?userId=${userId}`
      )
      fetchUserData(user.user_id)
    } catch (error) {
      console.error("Error al actualizar el perfil de usuario")
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
                disabled={onEdition ? "" : "disabled"}
                type="text"
                value={name}
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Apellido</label>
              <input
                disabled={onEdition ? "" : "disabled"}
                type="text"
                value={lastName}
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
          </div>
          <div className="md:flex md:space-x-4">
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Nombre de Usuario</label>
              <input
                disabled={onEdition ? "" : "disabled"}
                type="text"
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Fecha de Nacimiento</label>
              <input
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
                disabled={onEdition ? "" : "disabled"}
                type="text"
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
            <div className="mb-4 md:w-1/2">
              <label className="block text-white">Contraseña</label>
              <input
                disabled={onEdition ? "" : "disabled"}
                type="password"
                className="w-full p-2 rounded mt-1 text-black"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white">Correo Electrónico</label>
            <input
              disabled={onEdition ? "" : "disabled"}
              type="email"
              className="w-full p-2 rounded mt-1 text-black"
            />
          </div>
          {onEdition ? (
            <div className="space-x-4">
              <button
                onClick={handleEdition}
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
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </section>
        {/* Personalización */}
        <section className="mb-8 bg-primary shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Personalización</h2>
          <div className="flex space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"></div>
            <div className="w-8 h-8 bg-red-500 rounded-full cursor-pointer"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full cursor-pointer"></div>
          </div>
        </section>

        {/* Importación/Exportación a Google Calendar */}
        <section className="mb-8 bg-primary shadow rounded-lg p-6">
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
      </div>
    </>
  )
}
