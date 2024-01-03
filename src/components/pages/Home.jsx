import React, { useEffect, useState } from "react"
import { Route, Outlet, Link } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"
import Panel from "../Panel"
import GeneralView from "../sections/GeneralView"

export default function Home() {
  return (
    <>
      <Header></Header>
      <div className="container h-screen w-full right-0 mr-0 flex pt-16 relative mb-0 bottom-0 bg-bg-main-color flex-row">
        <Panel></Panel>
        <div className="section relative flex self-start">
          <Outlet />
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
