import React, { createContext, useState, useContext, useEffect } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lifeAreas, setLifeAreas] = useState([])

  const login = (userData) => {
    setUser(userData.user)
    //token en el almacenamiento local por si acaso
    localStorage.setItem("token", userData.token)
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
      fetch("http://localhost:3001/api/verifyToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error("Token inválido")
          }
        })
        .then((userData) => {
          // Obtener las áreas de vida del usuario
          fetch("http://localhost:3001/api/get/lifeAreas", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((areas) => {
              updateLifeAreas(areas) // Actualizar las áreas de vida en el contexto
            })
            .catch((error) => {
              console.error("Error al obtener las áreas de vida:", error)
            })

          // Actualizar el estado de usuario con los datos del usuario
          setUser(userData.user)
        })

        .catch((error) => {
          console.error("Error al verificar el token:", error)
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
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
