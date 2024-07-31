import React from "react"
import { Outlet } from "react-router-dom"
import Header from "../../Header"
import Footer from "../../Footer"
import Panel from "../../Panel"
import { useState } from "react"

export default function Home() {

  const [panelVisibility, setPanelVisibility] = useState(true)

  return (
    <>
      <Header></Header>
      <div className="container static flex h-fit min-h-full w-full max-w-full right-0 p-0 bg-white dark:bg-bg-main-color">
        <Panel
          panelVisibility={panelVisibility}
          setPanelVisibility={setPanelVisibility}></Panel>
        <div className="section static flex-grow flex border-solid border-2 p-4 transition-all duration-300">
          <Outlet />
        </div>
      </div>
      <Footer
        panelVisibility={panelVisibility}
        setPanelVisibility={setPanelVisibility}></Footer>
    </>
  )
}
