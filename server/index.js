const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()

//MIDDLEWARE
app.use(cors()) // Permite solicitudes desde el front-end
app.use(express.json()) // Permite parsear JSON en solicitudes

// Configura PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "focus",
  password: "1234",
  port: 5432,
})

//ROUTES
// Endpoint para obtener datos de PostgreSQL
app.get("/api/get/events", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Events"')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error al obtener los eventos")
  }
})

//Insertar eventos
app.post("/api/post/events", async (req, res) => {
  try {
    const {
      reminderID,
      state,
      endDate,
      eventName,
      eventCategory,
      eventDate,
      eventPriority,
      eventDescription,
    } = req.body
    // Insertar los datos del nuevo evento en la base de datos utilizando el cliente PostgreSQL
    await pool.query(
      'INSERT INTO "Events" (state, end_date, name, category, date, priority_level, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        state,
        endDate,
        eventName,
        eventCategory,
        eventDate,
        eventPriority,
        eventDescription,
      ]
    )
    res.status(201).json({ message: "Evento creado correctamente" })
  } catch (error) {
    console.error("Error al crear el evento:", error)
    res.status(500).json({ error: "Error al crear el evento" })
  }
})




const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`)
})
