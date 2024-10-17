import { useUser } from "./context/UserContext"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Welcome from "./components/pages/Welcome"
import Home from "./components/pages/home/Home"
import GeneralView from "./components/pages/home/GeneralView"
import Calendar from "./components/pages/home/calendar/Calendar"
import Settings from "./components/pages/home/settings/Settings"
import Login from "./components/pages/Login"
import Register from "./components/pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import "@fortawesome/fontawesome-free/css/all.min.css"
import Habits from "./components/pages/home/habits/Habits"
import dayjs from "dayjs"
import es from "dayjs/locale/es"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import clientId from "../server/clientId"

import { useEffect } from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {
  const { themeColor, secondaryColor, tertiaryColor } = useUser()
  const clientid = clientId()

  dayjs.locale("es")
  dayjs.locale({
    ...es,
    weekStart: 0,
  })
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const verifyToken = useUser((state) => state.verifyToken)
  useEffect(() => {
    verifyToken()
  }, [verifyToken])

  useEffect(() => {
    // Actualiza la variable CSS --primary con el valor de themeColor
    document.documentElement.style.setProperty("--primary", themeColor)
    document.documentElement.style.setProperty("--secondary", secondaryColor)
    document.documentElement.style.setProperty("--tertiary", tertiaryColor)
  }, [themeColor])

  return (
    <>
      <GoogleOAuthProvider clientId={clientid}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route
              path="/home/*"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }>
              {/* Rutas secundarias dentro de /home */}
              <Route index element={<GeneralView />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="settings" element={<Settings />} />
              <Route path="habits" element={<Habits />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
