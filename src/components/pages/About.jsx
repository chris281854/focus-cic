import React from "react"
import Header from "../Header"
import Footer from "../Footer"

export default function About() {

  return (
    <>
    <div className="flex items-center content-center flex-col bg-white text-primary dark:bg-bg-main-color dark:text-white pb-8">
        <Header></Header>
        <div className="start-div flex top-0 static w-full content-center items-center">
          <div className="box">
            <h1 className="text-white">
              Un poco sobre nosotros
            </h1>
          </div>
        </div>
        <div className="container static flex content-center items-center flex-col border-solid border-2 p-8 pb-12 w-11/12 mt-8 rounded-xl dark:border-0">
          <div className="text-block text-center text-2xl">
            <h1>The Focus Project</h1>
            <br />
            {/* <SplitLine color="white" height="2px" /> */}
            <hr className="border-primary border-2 rounded-full dark:border-white" />
            <br />
            <p>
              Focus es tu aliado definitivo para dirigir todos los aspectos de
              tu vida hacia la estabilidad y el éxito. Nuestra plataforma te
              proporciona las herramientas esenciales para organizar tu estilo
              de vida, desarrollar hábitos sólidos y embarcarte en un viaje de
              superación personal.
            </p>
            <br />
            <br />
            <h2>Enfoque:</h2>
            <br />
            <p>
              En la vertiginosa era moderna, las distracciones interminables nos
              impiden concentrarnos en lo que realmente importa. The Focus
              Project te ayuda a dirigir tu atención hacia lo correcto: tu
              futuro, tus relaciones, tu salud física, mental y espiritual, tu
              bienestar general.
            </p>
            <br />
            <br />
            <h2>Control:</h2>
            <br />
            <p>
              Recupera el control de tu vida al rechazar la distracción del
              entretenimiento instantáneo. Construye tu fuerza de voluntad,
              elige tu propio camino y conviértete en la mejor versión de ti
              mismo.
            </p>

          </div>
        </div>
      </div>
    <Footer></Footer>
    </>
  )
}