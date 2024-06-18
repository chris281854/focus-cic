import React from "react"
import "./Welcome.css"
import Header from "../Header.jsx"
import Footer from "../Footer"
// import SplitLine from "../SplitLine.jsx"

export default function Welcome() {
  return (
    <>
      <div className="welcome-container flex items-center content-center flex-col bg-white text-primary dark:bg-bg-main-color dark:text-white pb-8">
        <Header></Header>
        <div className="start-div flex top-0 static w-full content-center items-center">
          <div className="box">
            <h1 className="text-white">
              Esto, es <mark>Focus</mark>
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
          <div className="text-block text-left text-2xl mt-10">
            <p>
              <mark>Agenda:</mark> Con herramientas de organización,
              planificación, seguimiento y desarrollo de hábitos que necesitas
              para tomar el control de tu vida.
            </p>
            <br />
            <p>
              <mark>Organiza tus tareas diarias:</mark> A través de listas de
              tareas y recordatorios, mantente en la cima de tus
              responsabilidades diarias.
            </p>
            <br />
            <p>
              <mark>Planifica tu agenda:</mark> Crea y organiza tu futuro con
              una planificación efectiva.
            </p>
            <br />
            <p>
              <mark>Enfócate en lo que importa:</mark>
              Trabaja en las áreas realmente importantes de tu vida.
            </p>
            <br />
            <p>
              <mark>Recordatorios</mark>: Nuestra plataforma se encargará de
              planificar, organizar y recordarte todo de la manera más eficiente
              posible.
            </p>
          </div>
          <div className="cards flex">
            <div className="card bg-primary text-white dark:text-white">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
                nisi laborum, nobis alias assumenda in ullam quis iste veritatis
                recusandae aliquid delectus cupiditate, quo tenetur pariatur
                omnis soluta quidem temporibus!
              </p>
            </div>
            <div className="img-div">
              <img src="https://placebear.com/g/300/300" alt="Test img" />
            </div>
            <div className="img-div">
              <img src="https://placebear.com/g/300/300" alt="Test img" />
            </div>
            <div className="card bg-primary text-white dark:text-white">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                distinctio placeat quae voluptatibus nobis odit impedit enim
                neque sint tempore, eligendi hic non molestias perspiciatis aut
                nesciunt, recusandae et necessitatibus?
              </p>
            </div>
          </div>
          <div className="text-box flex items-center flex-col mt-4">
            <h1>
              Empieza a tomar el <mark>Control</mark>
            </h1>
            <br />
            <br />
            <button className="subscribe-button">
              <h2>¡Regístrate ahora!</h2>
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
