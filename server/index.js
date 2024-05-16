const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")
const { v4: uuidv4 } = require('uuid');


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
app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM eventos")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error al obtener los eventos")
  }
})

//Insertar eventos
app.post('/api/events', async (req, res) => {
  try {
    const randomId = uuidv4()
    const { eventName, eventNote, eventDate } = req.body;
    // Insertar los datos del nuevo evento en la base de datos utilizando el cliente PostgreSQL
    await pool.query('INSERT INTO eventos (id_evento, nombre, nota, fecha) VALUES ($1, $2, $3, $4)', [randomId, eventName, eventNote, eventDate]);
    res.status(201).json({ message: 'Evento creado correctamente' });
  } catch (error) {
    console.error('Error al crear el evento:', error);
    res.status(500).json({ error: 'Error al crear el evento' });
  }
});


const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`)
})