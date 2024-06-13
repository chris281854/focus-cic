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
// Recibir datos
app.get("/api/get/events", async (req, res) => {
  const userId = req.query.userId

  try {
    const result = await pool.query(
      'SELECT * FROM "Events" WHERE user_id = $1',
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error al obtener los eventos")
  }
})

app.get("/api/get/tasks", async (req, res) => {
  const userId = req.query.userId

  try {
    const result = await pool.query(
      'SELECT * FROM "Tasks" WHERE user_id = $1',
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error al obtener las tareas")
  }
})

//Insertar
app.post("/api/post/events", async (req, res) => {
  const client = await pool.connect() // Obtén un cliente de la pool de conexiones

  try {
    const {
      reminderDate,
      state,
      endDate,
      eventName,
      eventCategory,
      eventDate,
      eventPriority,
      eventDescription,
      userId,
      mail,
    } = req.body

    await client.query("BEGIN") // Iniciar una transacción

    // Insertar los datos del nuevo evento en la base de datos utilizando el cliente PostgreSQL
    const eventResult = await client.query(
      'INSERT INTO "Events" (state, end_date, name, category, date, priority_level, description, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id',
      [
        state,
        endDate,
        eventName,
        eventCategory,
        eventDate,
        eventPriority,
        eventDescription,
        userId,
      ]
    )

    console.log("Resultado de inserción del evento:", eventResult)

    if (!eventResult.rows || eventResult.rows.length === 0) {
      throw new Error("Error al insertar el evento")
    }
    const eventID = eventResult.rows[0].event_id // Obtener el ID del nuevo evento
    // Insertar el recordatorio en la tabla Reminders
    if (reminderDate) {
      const reminderResult = await client.query(
        'INSERT INTO "Reminders" (date, user_id, mail) VALUES ($1, $2, $3) RETURNING reminder_id',
        [reminderDate, userId, mail]
      )

      if (!reminderResult.rows || reminderResult.rows.length === 0) {
        throw new Error("Error al insertar el recordatorio")
      }

      const newReminderID = reminderResult.rows[0].reminder_id // Obtener el ID del nuevo recordatorio
      // Insertar la relación en la tabla intermedia Event_Reminder
      await client.query(
        'INSERT INTO "Event_Reminder" (event_id, reminder_id) VALUES ($1, $2)',
        [eventID, newReminderID]
      )
    }
    await client.query("COMMIT") // Confirmar la transacción

    res.status(201).json({ message: "Evento creado correctamente" })
  } catch (error) {
    await client.query("ROLLBACK") // Revertir la transacción en caso de error

    console.error("Error al crear el evento:", error)
    res.status(500).json({ error: "Error al crear el evento" })
  } finally {
    client.release()
  }
})

//Eliminar Items
app.delete("/api/items/delete", async (req, res) => {
  const { id, type } = req.body
  console.log(id, type)

  if (!id || !type) {
    return res.status(400).json({ error: "ID y tipo requeridos" })
  }
  try {
    let tableName
    let idName
    if (type === "task") {
      tableName = "Tasks"
      idName = "task_id"
    } else if (type === "event") {
      tableName = "Events"
      idName = "event_id"
    } else {
      return res.status(400).json({ error: "Tipo inválido" })
    }

    const result = await pool.query(
      `DELETE FROM "${tableName}" WHERE ${idName} = $1 RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item no encontrado" })
    }

    res.status(200).json({ message: "Item eliminado exitosamente" })
  } catch (error) {
    console.error(error)
    res.status.apply(500).json({ error: "¿ interno del servidor" })
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
