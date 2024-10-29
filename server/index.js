const dayjs = require("dayjs")
const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const cron = require("node-cron")

require("dotenv").config()

const app = express()
const SECRET_KEY = process.env.SECRET_KEY
const cookieParser = require("cookie-parser")
app.use(cookieParser())

//MIDDLEWARE
app.use(
  // Permite solicitudes desde el front-end
  cors({
    origin: "http://localhost:5173", //Dominio frontend
    credentials: true, //permitir envío de cookies
  })
)
app.use(express.json()) // Permite parsear JSON en solicitudes
app.use(bodyParser.json())

// Configura PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})

// Función para autenticar el token
function authenticateToken(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: "Token not found" })
  }
  // console.log("Token en cookies:", token)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Token verification error:", err)
      return res.sendStatus(403).json({ error: "invalid token" })
    }
    req.user = user
    next()
  })
}

// Función para generar el token JWT, configurar la cookie y enviar la respuesta
const sendAuthResponse = (res, user, rememberMe = false) => {
  const token = jwt.sign(
    { user_id: user.user_id, email: user.email },
    SECRET_KEY,
    { expiresIn: "1h" }
  )

  // Enviar el token como una cookie
  res.cookie("token", token, {
    httpOnly: true, // La cookie no puede ser leída por JavaScript
    secure: false, // Cambiar a true si usas HTTPS
    sameSite: "lax", // Permitir el envío en solicitudes dentro del mismo dominio
    maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60, // 7 días o 1 hora
  })

  // Devolver la misma estructura de respuesta
  res.json({ user: { user_id: user.user_id, email: user.email } })
}

//Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // O usa otro servicio, como Outlook
  auth: {
    user: process.env.NODEMAILER_GMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
})

transporter.verify(function (error, success) {
  if (error) {
    console.log("Error en la configuración del transporter:", error)
  } else {
    console.log("Servidor de correo listo para enviar mensajes.")
  }
})

async function checkAndSendReminders() {
  try {
    // Obtenemos la fecha y hora actuales usando dayjs en el formato 'YYYY-MM-DD HH:mm:ss'
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss")

    // Consulta a la base de datos para buscar recordatorios con la fecha actual
    const query = `
      SELECT r.name, u.email
      FROM "Reminders" r
      JOIN "Users" u ON r.user_id = u.user_id
      WHERE r.date = $1 AND r.mail = true
    `

    const result = await pool.query(query, [now])

    // Si hay recordatorios para la fecha actual, enviamos correos
    for (const reminder of result.rows) {
      const { name, email } = reminder
      // Envía el correo a través del endpoint de nodemailer
      await sendEmail(name, email)
    }
    await deleteOldReminders(now);

    console.log(
      `Se enviaron ${result.rows.length} recordatorios para la fecha ${now}.`
    )
  } catch (error) {
    console.error("Error al verificar los recordatorios:", error)
  }
}

async function deleteOldReminders(now) {
  try {
    const deleteQuery = `
      DELETE FROM "Reminders"
      WHERE date < $1
    `;
    const result = await pool.query(deleteQuery, [now]);
    console.log(`Se eliminaron ${result.rowCount} recordatorios antiguos.`);
  } catch (error) {
    console.error("Error al eliminar recordatorios antiguos:", error);
  }
}

// Función para enviar el correo usando nodemailer
function sendEmail(name, email) {
  const mailOptions = {
    from: process.env.NODEMAILER_GMAIL,
    to: email,
    subject: `Recordatorio: ${name}`,
    text: `Este es un recordatorio enviado desde Focus. 
    Accede a la aplicación con este link:
    http://localhost:5173/home`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo:", error)
    } else {
      console.log("Correo enviado:", info.response)
    }
  })
}

// Programar la tarea para que se ejecute cada minuto
cron.schedule("* * * * *", () => {
  console.log("Verificando recordatorios...")
  checkAndSendReminders()
})

// Mapeo de días de la semana a números para comparación
const daysOfWeek = {
  Lun: 1,
  Mar: 2,
  Mie: 3,
  Jue: 4,
  Vie: 5,
  Sab: 6,
  Dom: 0,
}

// Función para obtener la próxima fecha para un día específico de la semana
//BORRAR SI NO SE UTILIZA
function getNextWeekdayDate(startDate, dayOfWeek, weeksForward = 0) {
  const start = dayjs(startDate)
  const targetDay = daysOfWeek[dayOfWeek]

  if (targetDay === undefined) {
    throw new Error(`Invalid day of the week: ${dayOfWeek}`)
  }

  // Encontrar el día actual de la semana (0 = Domingo, 1 = Lunes, etc.)
  const currentDay = start.day()

  // Calcular la diferencia en días hacia el próximo día objetivo
  let daysUntilNext = targetDay - currentDay

  // Si el día objetivo ya pasó en esta semana, sumamos 7 días
  if (daysUntilNext < 0) {
    daysUntilNext += 7
  }

  // Añadir semanas adicionales si se especifica
  daysUntilNext += weeksForward * 7

  // Devolver la próxima fecha del día objetivo
  return start.add(daysUntilNext, "day").format("YYYY-MM-DD")
}

//ROUTES

// Recibir datos
app.get("/api/get/events", authenticateToken, async (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Actualizar el estado de los eventos según las fechas
    await client.query(
      `
      UPDATE "Events" 
      SET "state" = CASE
        WHEN "date" < NOW() THEN 1  -- Atrasado
        WHEN "date" >= NOW() AND "date" < date_trunc('day', NOW() + INTERVAL '1 day') THEN 2  -- Para hoy
        WHEN "date" >= date_trunc('day', NOW() + INTERVAL '1 day') AND "date" < date_trunc('day', NOW() + INTERVAL '2 days') THEN 6  -- Para mañana
        WHEN "date" >= date_trunc('day', NOW() + INTERVAL '2 days') AND "date" < date_trunc('day', NOW() + INTERVAL '1 week') THEN 3  -- Dentro de una semana
        WHEN "date" >= date_trunc('day', NOW() + INTERVAL '1 week') AND "date" < date_trunc('day', NOW() + INTERVAL '1 month') THEN 4  -- Dentro de un mes
        ELSE 5  -- Después
      END
      WHERE "user_id" = $1
      AND "state" != 0`,
      [userId]
    )

    await client.query("COMMIT")

    // Obtener los eventos actualizados con los detalles necesarios
    const updatedResult = await client.query(
      `SELECT 
        e.event_id,
        e.name,
        e.category,
        e.description,
        e.priority_level,
        e.iteration_id,
        e.recurrency_type,
        e.date,
        e.state,
        er.reminder_id, 
        r.date AS reminder_date, 
        r.mail AS reminder_mail,
        ARRAY_AGG(
          json_build_object(
            'life_area_id', la.life_area_id,
            'name', la.name,
            'color', la.color
          )
        ) AS life_areas
      FROM "Events" e
      LEFT JOIN "Event_Reminder" er ON e.event_id = er.event_id
      LEFT JOIN "Reminders" r ON er.reminder_id = r.reminder_id
      LEFT JOIN "Event_Life_Areas" ela ON e.event_id = ela.event_id
      LEFT JOIN "Life_Areas" la ON ela.life_area_id = la.life_area_id
      WHERE e.user_id = $1
      AND e.state != 0
      GROUP BY e.event_id, e.iteration_id, e.recurrency_type, e.date, er.reminder_id, r.date, r.mail
      ORDER BY e.date ASC`, // Ordenamos los eventos por fecha
      [userId]
    )

    const events = updatedResult.rows

    res.status(200).json(events)
  } catch (err) {
    await client.query("ROLLBACK")
    console.error(
      "Error al obtener y actualizar el estado de los eventos:",
      err
    )
    res.status(500).send("Error al obtener los eventos")
  } finally {
    client.release()
  }
})

app.get("/api/get/allEvents", authenticateToken, async (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Actualizar el estado de los eventos según las fechas
    await client.query(
      `
      UPDATE "Events" 
      SET "state" = CASE
        WHEN "date" < NOW() THEN 1  -- Atrasado
        WHEN "date" >= NOW() AND "date" < date_trunc('day', NOW() + INTERVAL '1 day') THEN 2  -- Para hoy
        WHEN "date" >= date_trunc('day', NOW() + INTERVAL '1 day') AND "date" < date_trunc('day', NOW() + INTERVAL '2 days') THEN 6  -- Para mañana
        WHEN "date" >= date_trunc('day', NOW() + INTERVAL '2 days') AND "date" < date_trunc('day', NOW() + INTERVAL '1 week') THEN 3  -- Para esta semana
        WHEN "date" >= date_trunc('day', NOW() + INTERVAL '1 week') AND "date" < date_trunc('day', NOW() + INTERVAL '1 month') THEN 4  -- Para este mes
        ELSE 5  -- Después
      END
      WHERE "user_id" = $1
      AND "state" != 0`,
      [userId]
    )

    await client.query("COMMIT")

    // Obtener todos los eventos actualizados
    const updatedResult = await client.query(
      `SELECT 
        e.event_id,
        e.iteration_id,
        e.recurrency_type,
        e.date,
        e.state,
        er.reminder_id, 
        r.date AS reminder_date, 
        r.mail AS reminder_mail,
        ARRAY_AGG(DISTINCT la.name) AS life_areas
      FROM "Events" e
      LEFT JOIN "Event_Reminder" er ON e.event_id = er.event_id
      LEFT JOIN "Reminders" r ON er.reminder_id = r.reminder_id
      LEFT JOIN "Event_Life_Areas" ela ON e.event_id = ela.event_id
      LEFT JOIN "Life_Areas" la ON ela.life_area_id = la.life_area_id
      WHERE e.user_id = $1
      GROUP BY e.event_id, e.iteration_id, e.recurrency_type, e.date, er.reminder_id, r.date, r.mail
      ORDER BY e.date ASC`,
      [userId]
    )

    res.status(200).json(updatedResult.rows)
  } catch (err) {
    await client.query("ROLLBACK")
    console.error(
      "Error al obtener y actualizar el estado de los eventos:",
      err
    )
    res.status(500).send("Error al obtener los eventos")
  } finally {
    client.release()
  }
})

app.get("/api/get/tasks", async (req, res) => {
  const userId = req.query.userId

  try {
    const result = await pool.query(
      `SELECT 
        t.*, 
        tr.reminder_id, 
        r.date AS reminder_date, 
        r.mail AS reminder_mail
      FROM "Tasks" t
      LEFT JOIN "Task_Reminder" tr ON t.task_id = tr.task_id
      LEFT JOIN "Reminders" r ON tr.reminder_id = r.reminder_id
      WHERE t.user_id = $1`,
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error al obtener las tareas")
  }
})

app.get("/api/get/reminders", async (req, res) => {
  const userId = req.query.userId

  try {
    const result = await pool.query(
      'SELECT * FROM "Reminders" WHERE user_id = $1',
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error al obtener los recordatorios")
  }
})

app.get("/api/get/lifeAreas", async (req, res) => {
  req.query.userId

  try {
    const query = `
SELECT
  la.*, 
  COALESCE(
    json_agg(
      json_build_object(
        'goal_id', g.goal_id,
        'name', g.name,
        'description', g.description,
        'target_date', g.target_date
      )
    ) FILTER (WHERE g.goal_id IS NOT NULL), 
    '[]'
  ) AS goals,
  COALESCE(
    json_agg(
      json_build_object(
        'score_date', las.date,
        'score_value', las.score
      )
    ) FILTER (WHERE las.score IS NOT NULL),
    '[]'
  ) AS scores
FROM "Life_Areas" la
LEFT JOIN "Goals" g ON la.life_area_id = g.life_area_id
LEFT JOIN "Life_Area_Scores" las ON la.life_area_id = las.life_area_id
GROUP BY la.life_area_id, la.name
`
    const result = await pool.query(query)
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error al obtener las Áreas de vida")
  }
})

app.get("/api/get/itemData", async (req, res) => {
  const { userId, itemId, itemType } = req.query

  if (!userId || !itemId || !type) {
    return res
      .status(400)
      .json({ error: "User ID, Item ID, and type are required" })
  }

  try {
    let query
    if (type === "event") {
      query = `SELECT * FROM "Events" WHERE user_id = $1 AND event_id = $2`
    } else if (type === "task") {
      query = `SELECT * FROM "Tasks" WHERE user_id = $1 AND task_id = $2`
    } else {
      return res.status(400).json({ error: "Tipo inválido" })
    }

    const result = await pool.query(query, [userId, itemId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item no encontrado" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/get/userData", authenticateToken, async (req, res) => {
  const userId = req.query.userId
  try {
    const result = await pool.query(
      'SELECT name, nickname, email, birthDate FROM "Users" WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send("Error al obtener datos de usuario")
  }
})

//Insertar
app.post("/api/post/events", async (req, res) => {
  const client = await pool.connect() // Obtener un cliente de la pool de conexiones

  try {
    const {
      reminderDate,
      endDate,
      eventName,
      eventDate,
      category,
      eventPriority,
      eventDescription,
      userId,
      mail,
      lifeAreaIds,
      recurrencyType, // Puede ser "year", "month", o un array de días de la semana [1,2,3,4,5,6,7]
    } = req.body

    await client.query("BEGIN")

    // Insertar el evento principal
    const eventResult = await client.query(
      'INSERT INTO "Events" (end_date, name, category, date, priority_level, description, user_id, recurrency_type, iteration_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING event_id, iteration_id',
      [
        endDate,
        eventName,
        category,
        eventDate,
        eventPriority,
        eventDescription,
        userId,
        recurrencyType, // Asignar el tipo de recurrencia
        null, // iteration_id será null inicialmente para el primer evento (se generarán iteraciones)
      ]
    )

    if (!eventResult.rows || eventResult.rows.length === 0) {
      throw new Error("Error al insertar el evento")
    }
    const eventID = eventResult.rows[0].event_id // Obtener el ID del nuevo evento
    const iterationID = eventID // El primer evento es su propia "base" para las iteraciones

    // Actualizar el iteration_id del evento recién creado
    await client.query(
      `UPDATE "Events" SET iteration_id = $1 WHERE event_id = $2`,
      [iterationID, eventID]
    )

    // Insertar el recordatorio si existe
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

    // Insertar las áreas de vida asociadas al evento
    if (lifeAreaIds && lifeAreaIds.length > 0) {
      const lifeAreasQuery = `
      INSERT INTO "Event_Life_Areas" ("event_id", life_area_id)
      VALUES ${lifeAreaIds.map((_, i) => `($1, $${i + 2})`).join(", ")}
      `
      const lifeAreasValues = [eventID, ...lifeAreaIds]

      await client.query(lifeAreasQuery, lifeAreasValues)
    }

    // Crear eventos recurrentes basados en recurrencyType
    console.log(recurrencyType)
    if (recurrencyType) {
      const today = new Date(eventDate)
      let iterationEvents = []

      // Manejo de recurrencias por tipo
      switch (recurrencyType) {
        case "month":
          // Repetir cada mes durante los próximos 12 meses
          for (let i = 1; i <= 12; i++) {
            const nextDate = new Date(today)
            nextDate.setMonth(today.getMonth() + i)
            if (!endDate || nextDate <= new Date(endDate)) {
              iterationEvents.push(nextDate)
            }
          }
          break

        case "year":
          // Repetir cada año durante los próximos 5 años
          for (let i = 1; i <= 5; i++) {
            const nextDate = new Date(today)
            nextDate.setFullYear(today.getFullYear() + i)
            if (!endDate || nextDate <= new Date(endDate)) {
              iterationEvents.push(nextDate)
            }
          }
          break

        default:
          // Si recurrencyType es un array de días de la semana, tratamos como repetición semanal personalizada
          if (Array.isArray(recurrencyType)) {
            const daysOfWeek = recurrencyType // Ejemplo: [1, 3, 5] -> Lunes, Miércoles, Viernes
            const weeksAhead = 12 // Generar iteraciones para las próximas 12 semanas
            for (let i = 0; i < weeksAhead; i++) {
              daysOfWeek.forEach((day) => {
                const nextDate = new Date(today)
                const currentDay = today.getDay() // Obtener el día actual
                const diffDays = (day - currentDay + 7) % 7 // Calcular la diferencia para el próximo día de la semana
                nextDate.setDate(today.getDate() + i * 7 + diffDays)
                if (!endDate || nextDate <= new Date(endDate)) {
                  iterationEvents.push(nextDate)
                }
              })
            }
          }
          break
      }

      // Insertar los eventos recurrentes en la tabla Events
      for (const iterationDate of iterationEvents) {
        await client.query(
          'INSERT INTO "Events" (end_date, name, category, date, priority_level, description, user_id, recurrency_type, iteration_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [
            endDate,
            eventName,
            category,
            iterationDate,
            eventPriority,
            eventDescription,
            userId,
            recurrencyType.join(","), // Mismo tipo de recurrencia
            iterationID, // Iteration ID que referencia al evento original
          ]
        )
      }
    }

    await client.query("COMMIT") // Confirmar la transacción

    res
      .status(201)
      .json({ message: "Evento e iteraciones creadas correctamente" })
  } catch (error) {
    await client.query("ROLLBACK") // Revertir la transacción en caso de error

    console.error("Error al crear el evento:", error)
    res.status(500).json({ error: "Error al crear el evento" })
  } finally {
    client.release()
  }
})

app.post("/api/post/lifeAreas", authenticateToken, async (req, res) => {
  const { name, userId, score, longTermGoal, color } = req.body

  if (!name || !userId) {
    return res.status(400).json({ error: "Nombre y userId requeridos" })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const lifeAreaResult = await pool.query(
      `INSERT INTO "Life_Areas" (name, user_id, long_goal, color) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, userId, longTermGoal, color]
    )
    const lifeArea = lifeAreaResult.rows[0]

    let lifeAreaScore

    if (score) {
      const lifeAreaScoreResult = await client.query(
        `INSERT INTO "Life_Area_Scores" (life_area_id, user_id, score, date) VALUES ($1, $2, $3, current_timestamp) RETURNING *`,
        [lifeArea.life_area_id, userId, score]
      )
      lifeAreaScore = lifeAreaScoreResult.rows[0]
    }
    await client.query("COMMIT")

    res.status(201).json({ lifeArea, lifeAreaScore })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error al crear life area y life area score", error)
    res
      .status(500)
      .json({ error: "Error al crear life area y life area score" })
  } finally {
    client.release()
  }
})

app.post("/api/post/lifeAreaScore", authenticateToken, async (req, res) => {
  const { lifeAreaId, userId, score, date } = req.body

  if (!date || !lifeAreaId || !userId || !score) {
    return res.status(400).json({ error: "data requerida" })
  }

  try {
    const result = await pool.query(
      `INSERT INTO "Life_Area_Scores" (life_area_id, user_id, score, date) VALUES ($1, $2, $3, $4) RETURNING *`[
        (lifeAreaId, userId, score, date)
      ]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error al crear life area score", error)
    res.status(500).json({ error: "Error al crear life area score" })
  } finally {
    client.release()
  }
})

app.post("/api/post/reminders", authenticateToken, async (req, res) => {
  const { name, reminderDate, userId, reminderMail } = req.body

  if (!reminderDate || !userId) {
    return res.status(400).json({ error: "data requerida" })
  }

  try {
    const result = await pool.query(
      `INSERT INTO "Reminders" (name, user_id, date, mail) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, userId, reminderDate, reminderMail]
    )
    res.status(201).json(result.rows[0]) // Retorna el recordatorio creado
  } catch (error) {
    console.error("Error al crear reminder", error)
    res.status(500).json({ error: "Error al crear reminder" })
  }
})

//Eliminar Items
app.delete("/api/items/delete", async (req, res) => {
  const { id, type } = req.query
  console.log(id, type)

  if (!id || !type) {
    return res.status(400).json({ error: "ID y tipo requeridos" })
  }
  try {
    let tableName
    let idName
    if (type === "event") {
      tableName = "Events"
      idName = "event_id"
    } else if (type === "reminder") {
      tableName = "Reminders"
      idName = "reminder_id"
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
    res.status(500).json({ error: "error interno del servidor" })
  }
})

app.delete("/api/lifeAreas/:id", authenticateToken, async (req, res) => {
  const { id } = req.params
  const { userId } = req.body
  if (!userId) {
    return res.status(400).json({ error: "userId is required" })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    await client.query(
      `DELETE FROM "Life_Area_Score" WHERE life_area_id = $1`,
      [id]
    )

    const result = await client.query(
      `DELETE FROM "Life_Areas" Where life_area_id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      await client.query("ROLLBACK")
      return res
        .status(404)
        .json({ error: "Life area no encontrada o usuario no autorizado" })
    }

    await client.query("COMMIT")

    res
      .status(200)
      .json({ message: "Life area y scores relacionados elimidados" })
  } catch (error) {
    await client.query("ROLLBACK")
    return res
      .status(500)
      .json({ error: "Error al eliminar life area y score relacionado" })
  } finally {
    client.release()
  }
})

//Actualizar
app.patch("/api/items/complete", authenticateToken, async (req, res) => {
  const { eventId, userId } = req.body

  if (!eventId || !userId) {
    return res.status(400).json({ error: "EventId and userId is required" })
  }

  if (req.user.user_id !== userId) {
    return res
      .status(403)
      .json({ error: "User not authorized to update this event" })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const updateResult = await client.query(
      `UPDATE "Events" 
      SET "state" = 0
      WHERE "event_id" = $1 AND "user_id" = $2
      RETURNING *;`,
      [eventId, userId]
    )

    if (updateResult.rows.length === 0) {
      await client.query("ROLLBACK")
      return res
        .status(404)
        .json({ error: "Event not found or user not authorized" })
    }

    const reminderIdsResult = await client.query(
      `SELECT "reminder_id"
      FROM "Event_Reminder"
      WHERE "event_id" = $1`,
      [eventId]
    )

    const reminderIds = reminderIdsResult.rows.map((row) => row.reminder_id)

    if ((reminderIds, reminderIds.length > 0)) {
      await client.query(
        `DELETE FROM "Reminders"
        WHERE "reminder_id" = ANY($1::BIGINT[])`,
        [reminderIds]
      )
    }

    await client.query(
      `DELETE FROM "Event_Reminder"
      WHERE "event_id" = $1`,
      [eventId]
    )

    await client.query("COMMIT")

    res.status(200).json({ message: "Evento completado" })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error al marcar como completado", error)
    res.status(500).json({
      error: "An error occurred while updating the event and reminder tables",
    })
  } finally {
    client.release()
  }
})

app.patch("/api/event/update", authenticateToken, async (req, res) => {
  const {
    eventReminderDate,
    state,
    endDate,
    eventName,
    lifeAreaIds,
    eventDate,
    category,
    eventPriority,
    eventDescription,
    eventMail,
    eventId,
    userId,
    eventReminderId,
  } = req.body

  const client = await pool.connect()

  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" })
  }

  if (req.user.user_id !== userId) {
    return res
      .status(403)
      .json({ error: "User not authorized to update this event" })
  }

  try {
    await client.query("BEGIN")

    const updateEventQuery = `
      UPDATE "Events" 
      SET 
        "state" = $1,
        "end_date" = $2,
        "name" = $3,
        "category" = $4,
        "date" = $5,
        "priority_level" = $6,
        "description" = $7,
        "user_id" = $8
      WHERE "event_id" = $9 AND "user_id" = $8
      RETURNING *;
    `
    const eventValues = [
      state,
      endDate,
      eventName,
      category,
      eventDate,
      eventPriority,
      eventDescription,
      userId,
      eventId,
    ]

    const eventResult = await client.query(updateEventQuery, eventValues)

    if (eventResult.rows.length === 0) {
      await client.query("ROLLBACK")
      return res
        .status(404)
        .json({ error: "Event not found or user not authorized" })
    }

    if (!eventReminderId && eventReminderDate) {
      const insertReminderQuery = `
        INSERT INTO "Reminders" ("date", "mail", "user_id")
        VALUES ($1, $2, $3)
        RETURNING "reminder_id";
      `
      const insertReminderValues = [eventReminderDate, eventMail, userId]
      const reminderResult = await client.query(
        insertReminderQuery,
        insertReminderValues
      )
      const newReminderId = reminderResult.rows[0].reminder_id

      const insertEventReminderQuery = `
        INSERT INTO "Event_Reminder" ("event_id", "reminder_id")
        VALUES ($1, $2);
      `
      await client.query(insertEventReminderQuery, [eventId, newReminderId])
    } else if (eventReminderId) {
      const deleteReminderQuery = `
        DELETE FROM "Reminders"
        WHERE "reminder_id" = $1;
      `
      await client.query(deleteReminderQuery, [eventReminderId])

      const insertReminderQuery = `
        INSERT INTO "Reminders" ("date", "mail", "user_id")
        VALUES ($1, $2, $3)
        RETURNING "reminder_id";
      `
      const insertReminderValues = [eventReminderDate, eventMail, userId]

      const reminderResult = await client.query(
        insertReminderQuery,
        insertReminderValues
      )
      const newReminderId = reminderResult.rows[0].reminder_id

      const insertEventReminderQuery = `
        INSERT INTO "Event_Reminder" ("event_id", "reminder_id")
        VALUES ($1, $2);
      `

      await client.query(insertEventReminderQuery, [eventId, newReminderId])
    }

    //Manejar áreas de vida

    const deleteLifeAreasQuery = `
      DELETE FROM "Event_Life_Areas" WHERE "event_id" = $1;
    `
    await client.query(deleteLifeAreasQuery, [eventId])

    console.log("lifeAreaIds:", lifeAreaIds)

    if (lifeAreaIds && lifeAreaIds.length > 0) {
      console.log("lifeAreaIds:", lifeAreaIds)
      const lifeAreasQuery = `
      INSERT INTO "Event_Life_Areas" ("event_id", life_area_id)
      VALUES ${lifeAreaIds.map((_, i) => `($1, $${i + 2})`).join(", ")}
      `
      const lifeAreasValues = [eventId, ...lifeAreaIds]

      await client.query(lifeAreasQuery, lifeAreasValues)
    }

    await client.query("COMMIT")

    res.status(200).json({
      message: "Event, related Reminder and life area updated successfully",
      event: eventResult.rows[0],
    })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error updating event and reminder", error)
    res.status(500).json({
      error: "An error occurred while updating the event and reminder",
    })
  } finally {
    client.release()
  }
})

app.patch("/api/update/lifeArea", authenticateToken, async (req, res) => {
  const {
    userId,
    areaId,
    areaName,
    satisfaction,
    longTermGoal = "",
    weekGoal = "",
  } = req.body

  // Verificar si se pasaron los campos obligatorios
  if (!userId || !areaId) {
    return res.status(400).json({ error: "userId y areaId son requeridos" })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Verificar si el área de vida existe
    const lifeAreaCheck = await client.query(
      `SELECT * FROM "Life_Areas" WHERE life_area_id = $1 AND user_id = $2`,
      [areaId, userId]
    )

    if (lifeAreaCheck.rowCount === 0) {
      return res.status(404).json({ error: "Life area no encontrada" })
    }

    // Actualizar campos de Life_Areas, asignando "" si los valores vienen vacíos
    const updateLifeAreaFields = []
    const updateLifeAreaValues = []
    let index = 1

    if (areaName) {
      updateLifeAreaFields.push(`name = $${index}`)
      updateLifeAreaValues.push(areaName)
      index++
    }

    // Insertar cadena vacía si no hay valores en longTermGoal o weekGoal
    updateLifeAreaFields.push(`long_goal = $${index}`)
    updateLifeAreaValues.push(longTermGoal)
    index++

    updateLifeAreaFields.push(`week_goal = $${index}`)
    updateLifeAreaValues.push(weekGoal)
    index++

    // Ejecutar el UPDATE para actualizar Life_Areas
    await client.query(
      `UPDATE "Life_Areas" SET ${updateLifeAreaFields.join(
        ", "
      )} WHERE life_area_id = $${index} AND user_id = $${index + 1}`,
      [...updateLifeAreaValues, areaId, userId]
    )

    let lifeAreaScore
    if (satisfaction !== undefined) {
      // Insertar siempre un nuevo score
      const lifeAreaScoreResult = await client.query(
        `INSERT INTO "Life_Area_Scores" (life_area_id, user_id, score, date) VALUES ($1, $2, $3, current_timestamp) RETURNING *`,
        [areaId, userId, satisfaction]
      )
      lifeAreaScore = lifeAreaScoreResult.rows[0]
    }

    await client.query("COMMIT")

    res.status(200).json({
      message: "Life area y nuevo score insertados",
      areaId,
      lifeAreaScore,
    })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error al actualizar life area y score", error)
    res.status(500).json({ error: "Error al actualizar life area y score" })
  } finally {
    client.release()
  }
})

app.patch("/api/update/userConfig", authenticateToken, async (req, res) => {
  const { userId, timezone, theme } = req.body

  if (timezone) {
    try {
      const userConfigResult = await pool.query(
        `UPDATE "User_Config" SET "timezone" = $1 WHERE user_id = $2 RETURNING *`,
        [timezone, userId]
      )
      res.status(200).json(userConfigResult.rows[0])
    } catch (error) {
      console.error("Error al actualizar configuración del usuario: ", error)
      res.status(500).json({
        error: "Error al actualizar configuración del usuario",
        details: error.message,
      })
    }
  }
  if (theme) {
    try {
      const userConfigResult = await pool.query(
        `UPDATE "User_Config" SET "theme" = $1 WHERE user_id = $2
        RETURNING *`,
        [theme, userId]
      )
    } catch (error) {
      console.error("Error al actualizar configuración del usuario: ", error)
      res
        .status(500)
        .json({ error: "Error al actualizar configuración del usuario" })
    }
  }
})

//Iniciar sesión
app.post("/api/login", async (req, res) => {
  const { email, password, rememberMe } = req.body

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

    sendAuthResponse(res, user, rememberMe)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
  res.sendStatus(200)
})

app.post("/api/verifyToken", authenticateToken, (req, res) => {
  res.json({ user: req.user }) // El usuario ya estará en `req.user`
})

app.post("/api/register", async (req, res) => {
  const { name, birthDate, nickName, email, password } = req.body

  try {
    // Genera un hash seguro de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO "Users" (name, birthdate, password, nickname, email) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
      [name, birthDate, hashedPassword, nickName, email]
    )

    const userId = result.rows[0].user_id

    await pool.query(`INSERT INTO "User_Config" (user_id) VALUES ($1)`, [
      userId,
    ])

    res.status(201).json({ message: "Usuario registrado exitosamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

app.get("/api/protected", (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(403).send("No token, acces no authorized")
  }
  // res.json({ message: "This is a protected route", user: req.user, token })

  try {
    const data = jwt.verify(token, SECRET_KEY)
    res.render("protected", data)
  } catch (error) {}
})

app.post("/api/googleLogin", async (req, res) => {
  const { token, google_id, email, name, nickname, birthdate } = req.body

  try {
    // Verificar si el usuario ya existe en la tabla Users
    const result = await pool.query('SELECT * FROM "Users" WHERE email = $1', [
      email,
    ])

    let user
    if (result.rows.length === 0) {
      // Si no existe, crear un nuevo usuario
      const newUser = await pool.query(
        `INSERT INTO "Users" (name, nickname, birthdate, email) 
         VALUES ($1, $2, $3, $4) 
         RETURNING user_id, email`,
        [name, nickname, birthdate, email]
      )
      user = newUser.rows[0] // usuario recién creado
    } else {
      // Si el usuario existe, asignarlo para el siguiente paso
      user = result.rows[0]
    }

    // Ahora guardar en la tabla "Google_Auth"
    const now = new Date()
    const tokenUpdateTime = now.toISOString()

    await pool.query(
      `INSERT INTO "Google_Auth" (user_id, google_id, token, token_update) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_id) DO UPDATE 
       SET token = $3, token_update = $4`,
      [user.user_id, google_id, token, tokenUpdateTime]
    )

    const rememberMe = true
    sendAuthResponse(res, user, rememberMe)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

//Actualizar perfil
app.patch("/api/updateProfile", authenticateToken, async (req, res) => {
  const userId = req.query.userId

  const { name, birthDate, password } = req.body

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  try {
    let updateFields = []
    let values = []
    let valueIndex = 1

    if (name) {
      updateFields.push(`name = $${valueIndex}`)
      values.push(name)
      valueIndex++
    }
    if (birthDate) {
      updateFields.push(`birthdate = $${valueIndex}`)
      values.push(birthDate)
      valueIndex++
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateFields.push(`password = $${valueIndex}`)
      values.push(hashedPassword)
      valueIndex++
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" })
    }

    values.push(userId)

    const query = `UPDATE "Users" SET ${updateFields.join(
      ", "
    )} WHERE user_id = $${valueIndex} RETURNING *`
    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.status(200).json({
      message: "Usuario actualizado exitosamente",
      user: result.rows[0],
    })
  } catch (error) {
    console.error("Internal server error:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

//Cambiar contraseña
app.post("/api/verifyPassword", authenticateToken, async (req, res) => {
  const { password, userId, userNickName } = req.body

  if (!userId || !password || !userNickName) {
    return res
      .status(400)
      .json({ error: "User ID, password and Nickname are required" })
  }

  try {
    const user = await pool.query(
      `SELECT password FROM "Users" WHERE user_id = $1 AND nickname = $2`,
      [userId, userNickName]
    )
    if (!user.rows[0]) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    const hashedPassword = user.rows[0].password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword)

    res.json({ verified: isPasswordValid })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

app.patch("/api/changePassword", authenticateToken, async (req, res) => {
  const { userId, password } = req.body

  if (!userId || !password) {
    return res.status(400).json({ error: "User ID adn password are required" })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `UPDATE "Users" SET password = $1 WHERE user_id = $2 RETURNING *`,
      [hashedPassword, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
      user: result.rows[0],
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

app.post("/api/userDisponibility", async (req, res) => {
  const { nickName } = req.body

  if (!nickName) {
    return res.status(400).json({ error: "Nickname es requerido" })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM "Users" WHERE nickname = $1',
      [nickName]
    )

    if (result.rows.length > 0) {
      return res.json(false) // El nickname ya está en uso
    } else {
      return res.json(true) // El nickname está disponible
    }
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: "Error al verificar disponibilidad del nickname" })
  }
})

app.post("/api/emailDisponibility", async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: "Nickname es requerido" })
  }

  try {
    const result = await pool.query('SELECT * FROM "Users" WHERE email = $1', [
      email,
    ])

    if (result.rows.length > 0) {
      return res.json(false) // El nickname ya está en uso
    } else {
      return res.json(true) // El nickname está disponible
    }
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: "Error al verificar disponibilidad del email" })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`)
})
