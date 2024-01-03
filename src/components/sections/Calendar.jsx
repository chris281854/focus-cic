import { React } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Calendar() {

  return (
    <>
      <div>
        <h2>Sección Calendario</h2>
        <p>Contenido de la sección Calendario</p>
        <Link to="/home">Volver a la página principal</Link>
      </div>
    </>
  )
}
