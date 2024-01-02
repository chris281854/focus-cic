import { React } from "react"

//Barra de separación de texto
const SplitLine = ({ color, height, width }) => (
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
export default SplitLine
