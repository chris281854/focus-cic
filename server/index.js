const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")

const app = express()
const SECRET_KEY = "1234"

//MIDDLEWARE
app.use(cors()) // Permite solicitudes desde el front-end
app.use(express.json()) // Permite parsear JSON en solicitudes
app.use(bodyParser.json())

// Configura PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "focus",
  password: "1234",
  port: 5432,
})

// Función para autenticar el token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

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
    events
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

//Iniciar sesión
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body
  console.log(email, password)

  try {
    const result = await pool.query('SELECT * FROM "Users" WHERE email = $1', [
      email,
    ])
    if (result.rows.length === 0) {
      console.error("invalid email")
      return res.status(401).json({ error: "Invalid email" })
    }
    const user = result.rows[0]
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      console.error("invalid password")
      return res.status(401).json({ error: "Invalid password" })
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    )

    res.json({ token, user: { user_id: user.user_id, email: user.email } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/verifyToken", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" })
    } else {
      //decoded debe poseer los datos del usuario
      return res.json({ user: decoded })
    }
  })
})

app.post("/api/register", async (req, res) => {
  const { name, lastName, birthDate, phoneNumer, nickName, email, password } =
    req.body

  try {
    // Genera un hash seguro de la contraseña

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      'INSERT INTO "Users" (name, birthdate, last_name, password, nickname, phone_number, email) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [name, birthDate, lastName, hashedPassword, nickName, phoneNumer, email]
    )

    res.status(201).json({ message: "Usuario registrado exitosamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

app.get("api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`)
})
