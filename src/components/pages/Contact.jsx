import React from "react"
import Header from "../Header"
import Footer from "../Footer"

export default function Contact() {
  return (
    <>
      <div className="flex items-center content-center flex-col bg-white text-primary dark:bg-bg-main-color dark:text-white pb-8">
        <Header></Header>
        <div className="start-div flex top-0 static w-full content-center items-center">
          <div className="box">
            <h1 className="text-white">Contáctanos</h1>
          </div>
        </div>
        <div className="container static flex flex-row text-2xl content-center items-center border-solid border-2 p-8 pb-12 w-11/12 mt-8 rounded-xl dark:border-0">
          <div>
            <h2>Comunícate con nosotros</h2>
          </div>
          <div className="text-center bg-primary rounded-xl">
            <div>
              <h3>Envíanos un Correo Electrónico</h3>
              <form
                action=""
                className="flex flex-col text-center content-center ">
                <div>
                  <label htmlFor="name">Nombre</label>
                  <input type="text" name="name" id="name" />
                  <label htmlFor="last-name">Apellido</label>
                  <input type="text" name="last-name" id="last-name" />
                </div>
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" name="email" id="email" />
                <label htmlFor="text">Asunto</label>
                <input type="text" name="text" id="text" />
                <input type="button" value="" />
              </form>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
