import React, { useEffect, useState } from "react"
import "./Welcome.css"
import Header from "../Header"
import Footer from "../Footer"

export default function Wellcome() {
  const [scrollY, setScrollY] = useState(0)

  //Sombreado de header
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  //Barra de separación de texto
  const ColoredLine = ({ color, height, width }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: height,
        width: width,
        border: "none",
      }}
    />
  )

  return (
    <>
      <div className="welcome-container">
        <Header></Header>
        <div className="container">
          <div className="start-div">
            <div className="box">
              <h1>
                Esto, es <mark>Focus</mark>
              </h1>
            </div>
          </div>
          <div className="text-block ">
            <h1>The Focus Project</h1>
            <ColoredLine color="white" height="2px" width="600px" />
            <br />
            <p className="text-white">
              Focus es tu aliado definitivo para dirigir todos los
              aspectos de tu vida hacia la estabilidad y el éxito. Nuestra
              plataforma te proporciona las herramientas esenciales para
              organizar tu estilo de vida, desarrollar hábitos sólidos y
              embarcarte en un viaje de superación personal.
              <br /><br />
              <h2>Enfoque:</h2> En la vertiginosa era moderna, las distracciones
              interminables nos impiden concentrarnos en lo que realmente
              importa. The Focus Project te ayuda a dirigir tu atención hacia lo
              correcto: tu futuro, tus relaciones, tu salud física, mental y
              espiritual, tu bienestar general.
              <br /><br />
              <h2>Control:</h2> Recupera el control de tu vida al rechazar la distracción
              del entretenimiento instantáneo. Construye tu fuerza de voluntad,
              elige tu propio camino y conviértete en la mejor versión de ti
              mismo.
              <br /><br />
              Herramientas de organización, planificación,
              seguimiento y desarrollo de hábitos que necesitas para tomar el
              control de tu vida. 
              <br /><br />
              <mark>Organiza tus tareas diarias:</mark> A través de
              listas de tareas y recordatorios, mantente en la cima de tus
              responsabilidades diarias.
              <br /><br />
              <mark>Planifica tu agenda:</mark> Crea y organiza tu
              futuro con una planificación efectiva.
              <br /><br />
              <mark>Enfócate en lo que importa:</mark>
              Trabaja en las áreas realmente importantes de tu vida. 
              <br /><br />
              <mark>Recordatorios</mark>: Nuestra plataforma se encargará de planificar,
              organizar y recordarte todo de la manera más eficiente posible.
            </p>
          </div>
          <div className="cards">
            <div className="card">
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
            <div className="card">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                distinctio placeat quae voluptatibus nobis odit impedit enim
                neque sint tempore, eligendi hic non molestias perspiciatis aut
                nesciunt, recusandae et necessitatibus?
              </p>
            </div>
          </div>
          <div className="text-box">
            <h1>
              Empieza a tomar el <mark>Control</mark>
            </h1>
            <button className="subscribe-button">
              <h2>¡Regístrate ahora!</h2>
              <br />
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
