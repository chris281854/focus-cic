const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
app.use(cors()) // Permite solicitudes desde el front-end
app.use(express.json()) // Permite parsear JSON en solicitudes

// Configura PostgreSQL
const pool = new Pool({
  user: "tu_usuario",
  host: "localhost", // Cambia según tu configuración
  database: "tu_base_de_datos",
  password: "tu_contraseña",
  port: 5432, // Puerto por defecto de PostgreSQL
})

// Endpoint para obtener datos de PostgreSQL
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tu_tabla")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error en el servidor")
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`)
})
1