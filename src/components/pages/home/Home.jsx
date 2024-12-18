import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "../../Header"
import Footer from "../../Footer"
import Panel from "./Panel"
import axios from "axios"
// import requestNotificationPermission from "../../../../server/RequestNotification"

export default function Home() {
  const [panelVisibility, setPanelVisibility] = useState(true)
  const PUBLIC_VAPID_KEY =
    "BEiybRMQEqnja71SML1ISBb99aNQz_vxWBhwXS6Xucbh_-s7xTwqKq4f9gYn8ShmGuYs3x2tAR0lavFFVEub4uI"

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
      <button onClick={subscription}>NOTIFICAR</button>
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
