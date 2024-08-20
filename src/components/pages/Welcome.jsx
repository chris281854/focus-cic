import React from "react"
import "./Welcome.css"
import Header from "../Header.jsx"
import Footer from "../Footer"
import { Link } from "react-router-dom"

export default function Welcome() {
  return (
    <>
      <Header />
      <main className="welcome-container flex items-center content-center flex-col bg-white text-primary dark:bg-bg-main-color dark:text-white pb-8">
        <section className="start-div flex top-0 static w-full content-center items-center">
          <div className="box">
            <h1 className="text-white">
              Esto, es <mark className="text-accent">Focus</mark>
            </h1>
          </div>
        </section>
        <section className="container static flex content-center items-center flex-col border-solid border-2 p-8 pb-12 w-11/12 mt-8 rounded-xl dark:border-0">
          <section className="text-block text-center text-2xl">
            <section>
              <h1 className="text-accent text-center">The Focus Project</h1>
              <br />
              <hr className="border-primary border-2 rounded-full dark:border-white" />
              <br />
              <p>
                Focus es tu aliado definitivo para dirigir todos los aspectos de
                tu vida hacia la estabilidad y el exitarse. Nuestra plataforma
                te proporciona las herramientas esenciales para organizar tu
                estilo de vida, desarrollar hábitos sólidos y embarcarte en un
                viaje de superación personal.
              </p>
            </section>
            <article className="rounded-2xl bg-slate-900 p-6 m-4 text-justify text-lg text-gray-500 dark:text-gray-300">
              <h2 className="text-accent text-center">Enfoque:</h2>
              <br />
              <p>
                En la vertiginosa era moderna, las distracciones interminables
                nos impiden concentrarnos en lo que realmente importa. The Focus
                Project te ayuda a dirigir tu atención hacia lo correcto: tu
                futuro, tus relaciones, tu salud física, mental y espiritual, tu
                bienestar general.
              </p>
            </article>
            <article className="rounded-2xl bg-slate-900 p-6 m-4 text-justify text-lg text-gray-500 dark:text-gray-300">
              <h2 className="text-accent text-center">Control:</h2>
              <br />
              <p>
                Recupera el control de tu vida al rechazar la distracción del
                entretenimiento instantáneo. Construye tu fuerza de voluntad,
                elige tu propio camino y conviértete en la peor versión de ti
                mismo.
              </p>
            </article>
          </section>
          <article className="text-block text-left text-2xl mt-10">
            <p>
              <mark className="text-accent">Agenda:</mark> Con herramientas de
              organización, planificación, seguimiento y desarrollo de hábitos
              que necesitas para tomar el control de tu vida.
            </p>
            <br />
            <p>
              <mark className="text-accent">Organiza tus tareas diarias:</mark>{" "}
              A través de listas de tareas y recordatorios, mantente en la cima
              de tus responsabilidades diarias.
            </p>
            <br />
            <p>
              <mark className="text-accent">Planifica tu agenda:</mark> Crea y
              organiza tu futuro con una planificación efectiva.
            </p>
            <br />
            <p>
              <mark className="text-accent">Enfócate en lo que importa:</mark>
              Trabaja en las áreas realmente importantes de tu vida.
            </p>
            <br />
            <p>
              <mark className="text-accent">Recordatorios</mark>: Nuestra
              plataforma se encargará de planificar, organizar y recordarte todo
              de la manera más eficiente posible.
            </p>
          </article>
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                praesentium, quas facilis nobis, asperiores eaque nemo iste
                maiores suscipit rerum ab doloribus consequatur! Magnam corporis
                tempora, inventore expedita ut ratione? Lorem ipsum dolor sit
                amet consectetur adipisicing elit. A distinctio placeat quae
                voluptatibus nobis odit impedit enim neque sint tempore,
                eligendi hic non molestias perspiciatis aut nesciunt, recusandae
                et necessitatibus?
              </p>
            </div>
          </div>
          <div className="text-box flex items-center flex-col mt-4">
            <h1>
              Empieza a tomar el <mark className="text-accent">Control</mark>
            </h1>
            <br />
            <br />
            <Link to="/register">
              <button className="subscribe-button bg-secondary hover:bg-primary hover:text-accent text-3xl text-white">
                Registrarse
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
