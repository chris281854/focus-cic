import React, { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading, verifyToken } = useUser()

  useEffect(() => {
    // Verificar el token cuando el componente se monta
    if (!loading && !user) {
      verifyToken()
    }
  }, [user, loading, verifyToken])

  if (loading) {
    return <>Cargando...</>
  }

  if (!user) {
    console.log(user)
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute
