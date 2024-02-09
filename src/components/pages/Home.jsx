import React from "react"
import { Outlet } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"
import Panel from "../Panel"


export default function Home() {
  return (
    <>
      <div className="container static flex h-fit min-h-full w-full max-w-full right-0 pt-20 bg-white dark:bg-bg-main-color">
        <Header></Header>
        <Panel></Panel>
        <div className="section static flex-grow ml-52 flex border-solid border-2 p-4">
          <Outlet />
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
