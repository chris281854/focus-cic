import React from "react"
import { Navigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser()

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
