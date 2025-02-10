import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "../../Header"
import Footer from "../../Footer"
import Panel from "./Panel"
import axios from "axios"
import { useUser } from "../../../context/UserContext"
// import requestNotificationPermission from "../../../../server/RequestNotification"

export default function Home() {
  const { user } = useUser()
  const [panelVisibility, setPanelVisibility] = useState(true)
  const PUBLIC_VAPID_KEY =
    "BLKrykdHlaoAPXXV2iU8jRnKpaJxP8sM-SVt6IKXKeWJ1HzeMQcvoB_0pjTW7LGAR8cO5KlbRTNsWP57VEZp9ZU"

  const subscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("Service Worker y Push están soportados!")
    } else {
      console.error("El navegador no soporta notificaciones push.")
      return
    }

    try {
      //service worker
      const register = await navigator.serviceWorker.register(
        "/src/components/worker.js"
      )
      console.log("new service worker!")

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: PUBLIC_VAPID_KEY,
      })

      const response = await axios.post(
        "http://localhost:3001/api/subscription",
        {
          userId: user.user_id,
          subscription,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      console.log("subscrito!")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col">
      {/* <button onClick={subscription}>NOTIFICAR</button> */}
      {/* <Header /> */}
      <main className="container static flex h-full min-h-screen w-full max-w-full bg-white dark:bg-bg-main-color">
        <Panel
          panelVisibility={panelVisibility}
          setPanelVisibility={setPanelVisibility}
        />
        <article className="section static flex-grow flex transition-all duration-300 h-fit overflow-hidden">
          <Outlet />
        </article>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
