import React, { useContext, useState } from "react"
import { UserContext } from "../../context/UserContext"
import Header from "../Header"
import Footer from "../Footer"

export default function Login() {
  const { login } = useContext(UserContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      if (response.ok) {
        const userData = await response.json
        login(userData)
      } else {
        throw new Error("LLogin failed")
      }
    } catch (error) {
      setError("Invalid Username or Password")
    }
  }

  return (
    <>
    <div className="flex items-center content-center flex-col bg-white text-primary dark:bg-bg-main-color dark:text-white pb-8">
    <Header></Header>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      <Footer></Footer>
      </div>
    </>
  )
}
