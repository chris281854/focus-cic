import React, { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lifeAreas, setLifeAreas] = useState([])

  const login = async (userData) => {
    setUser(userData.user)
    //token en el almacenamiento local por si acaso
    localStorage.setItem("token", userData.token)

    try {
      const areasResponse = await axios.get(
        "http://localhost:3001/api/get/lifeAreas",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
      const areas = areasResponse.data
      setLifeAreas(areas) // Actualizar las áreas de vida en el contexto
      console.log("Áreas de vida obtenidas:", areas)
    } catch (areasError) {
      console.error("Error al obtener las áreas de vida:", areasError)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const updateLifeAreas = (areas) => {
    setLifeAreas(areas)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Enviar el token al servidor para verificar su validez
      const verifyToken = async (token) => {
        try {
          const response = await axios.post(
            "http://localhost:3001/api/verifyToken",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (response.status !== 200) {
            throw new Error("Token inválido")
          }

          const userData = response.data

          // Obtener las áreas de vida del usuario
          try {
            const areasResponse = await axios.get(
              "http://localhost:3001/api/get/lifeAreas",
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            )

            const areas = areasResponse.data
            updateLifeAreas(areas) // Actualizar las áreas de vida en el contexto
          } catch (areasError) {
            console.error("Error al obtener las áreas de vida:", areasError)
          }

          // Actualizar el estado de usuario con los datos del usuario
          setUser(userData.user)
        } catch (error) {
          console.error("Error al verificar el token:", error)
          localStorage.removeItem("token")
        } finally {
          setLoading(false)
        }
      }

      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        lifeAreas,
        updateLifeAreas,
      }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}

export { UserContext }
