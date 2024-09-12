import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "../../Header"
import Footer from "../../Footer"
import Panel from "./Panel"
// import requestNotificationPermission from "../../../../server/RequestNotification"

export default function Home() {
  const [panelVisibility, setPanelVisibility] = useState(true)

  return (
    <div className="flex flex-col">
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
