import { React } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function GeneralView() {
  // const { sectionId } = useParams()
  // const navigate = useNavigate()

  // const handleCloseSection = () => {
  //   // Redirigir de nuevo a la página principal cuando se cierra la sección
  //   navigate("/")
  // }
  return(
    <>
    <div>
      <h2>Vista Principal</h2>
      <p>Contenido de la vista principal</p>
      <Link to="/home">Volver a la página principal</Link>
    </div>
    </>  
  ) 
}
