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
app.get("/api/get/events", authenticateToken, async (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const result = await client.query(
      `
      UPDATE "Events" 
      SET "state" = CASE
        WHEN "date" < NOW() THEN 0
        WHEN "date" < NOW() + INTERVAL '1 day' THEN 1
        WHEN "date" < NOW() + INTERVAL '1 week' THEN 2
        ELSE 3
      END
      WHERE "user_id" = $1
      AND "state" != 4`,
      [userId]
    )

    await client.query("COMMIT")

    // Obtener los eventos actualizados
    const updatedResult = await client.query(
      `SELECT 
        e.*, 
        er.reminder_id, 
        r.date AS reminder_date, 
        r.mail AS reminder_mail,
        ARRAY_AGG(la.name) AS life_areas
      FROM "Events" e
      LEFT JOIN "Event_Reminder" er ON e.event_id = er.event_id
      LEFT JOIN "Reminders" r ON er.reminder_id = r.reminder_id
      LEFT JOIN "Event_Life_Areas" ela ON e.event_id = ela.event_id
      LEFT JOIN "Life_Areas" la ON ela.life_area_id = la.life_area_id
      WHERE e.user_id = $1
      GROUP BY e.event_id, er.reminder_id, r.date, r.mail`,
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

app.get("/api/get/allEvents", authenticateToken, async (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const result = await client.query(
      `
      UPDATE "Events" 
      SET "state" = CASE
        WHEN "date" < NOW() THEN 0
        WHEN "date" < NOW() + INTERVAL '1 day' THEN 1
        WHEN "date" < NOW() + INTERVAL '1 week' THEN 2
        ELSE 3
      END
      WHERE "user_id" = $1`,
      [userId]
    )

    await client.query("COMMIT")

    // Obtener los eventos actualizados
    const updatedResult = await client.query(
      `SELECT 
        e.*, 
        er.reminder_id, 
        r.date AS reminder_date, 
        r.mail AS reminder_mail,
        ARRAY_AGG(la.name) AS life_areas
      FROM "Events" e
      LEFT JOIN "Event_Reminder" er ON e.event_id = er.event_id
      LEFT JOIN "Reminders" r ON er.reminder_id = r.reminder_id
      LEFT JOIN "Event_Life_Areas" ela ON e.event_id = ela.event_id
      LEFT JOIN "Life_Areas" la ON ela.life_area_id = la.life_area_id
      WHERE e.user_id = $1
      GROUP BY e.event_id, er.reminder_id, r.date, r.mail`,
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
    res.status(500).send("Error al obtener las tareas")
  }
})

app.get("/api/get/lifeAreas", async (req, res) => {
  const userId = 2
  // req.query.userId

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
    ) AS goals
  FROM "Life_Areas" la
  LEFT JOIN "Goals" g ON la.life_area_id = g.life_area_id
  GROUP BY la.life_area_id, la.name, la.score
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

app.get("/api/get/userData", async (req, res) => {
  const userId = req.query.userId

  try {
    const result = await pool.query(
      'SELECT name, last_name, nickname, phone_number, email, birthDate FROM "Users" WHERE USER_ID = $1',
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
      lifeAreaIds,
    } = req.body

    await client.query("BEGIN") // Iniciar una transacción

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

    if (lifeAreaIds && lifeAreaIds.length > 0) {
      const lifeAreasQuery = `
      INSERT INTO "Event_Life_Areas" ("event_id", life_area_id)
      VALUES ${lifeAreaIds.map(() => "($1, $2)").join(", ")}
      `
      const lifeAreasValues = lifeAreaIds.flatMap((lifeAreaId) => [
        eventID,
        lifeAreaId,
      ])
      await client.query(lifeAreasQuery, lifeAreasValues)
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

app.post("/api/post/tasks", async (req, res) => {
  const client = await pool.connect() // Obtén un cliente de la pool de conexiones

  try {
    const {
      taskReminderDate,
      state,
      endDate,
      taskName,
      taskCategory,
      taskDate,
      taskPriority,
      taskDescription,
      userId,
      taskMail,
      taskId,
      taskReminderId,
    } = req.body

    await client.query("BEGIN") // Iniciar una transacción

    const taskResult = await client.query(
      'INSERT INTO "Tasks" (state, end_date, name, category, date, priority_level, description, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING task_id',
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

app.post("/api/post/lifeAreas", authenticateToken, async (req, res) => {
  const { name, userId, score, longGoal } = req.body

  if (!name || userId) {
    return res.status(400).json({ error: "Nombre y userId requeridos" })
  }

  try {
    await client.query("BEGIN")

    const lifeAreaResult = await pool.query(
      `INSERT INTO "Life_Areas" (name, user_id) VALUES ($1, $2) RETURNING *`[
        (name, userId)
      ]
    )
    const lifeArea = lifeAreaResult.rows[0]

    if (score) {
      const lifeAreaScoreResult = await client.query(
        `INSERT INTO "Life_Area_Scores" (life_area_id, user_id, score, date) VALUES ($1, $2,) RETURNING *`,
        [lifeArea.id, userId, score, date]
      )
      const lifeAreaScore = lifeAreaScoreResult.rows[0]
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
    res.status.apply(500).json({ error: "¿ interno del servidor" })
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
app.patch("/api/event/update", authenticateToken, async (req, res) => {
  const {
    eventReminderDate,
    endDate,
    eventName,
    eventCategory,
    eventDate,
    eventPriority,
    eventDescription,
    eventMail,
    eventId,
    userId,
    eventReminderId,
    lifeAreas,
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
        "end_date" = $1,
        "name" = $2,
        "category" = $3,
        "date" = $4,
        "priority_level" = $5,
        "description" = $6,
        "user_id" = $7
      WHERE "event_id" = $8 AND "user_id" = $7
      RETURNING *;
    `
    const eventValues = [
      endDate,
      eventName,
      eventCategory,
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

    if (lifeAreas && lifeAreas.length > 0) {
      const insertLifeAreaQueries = lifeAreas.map((areaId) => {
        return client.query(
          `INSERT INTO "Event_Life_Areas" ("event_id", "life_area_id") VALUES ($1, $2);`,
          [eventId, areaId]
        )
      })
      await Promise.all(insertLifeAreaQueries)
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
      SET "state" = 4
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
    endDate,
    eventName,
    eventCategory,
    eventDate,
    eventPriority,
    eventDescription,
    eventMail,
    eventId,
    userId,
    eventReminderId,
    lifeAreas,
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
      endDate,
      eventName,
      eventCategory,
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

    if (lifeAreas && lifeAreas.length > 0) {
      const insertLifeAreaQueries = lifeAreas.map((areaId) => {
        return client.query(
          `INSERT INTO "Event_Life_Areas" ("event_id", "life_area_id") VALUES ($1, $2);`,
          [eventId, areaId]
        )
      })
      await Promise.all(insertLifeAreaQueries)
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

app.patch("/api/task/update", authenticateToken, async (req, res) => {})

app.patch("api/update/lifeAreas/:id", authenticateToken, async (req, res) => {
  const { id } = req.params
  const { userId, name } = req.body

  if (!name || !userId || score) {
    return res
      .status(400)
      .json({ error: "Name, userId, score, date son requeridos" })
  }

  try {
    const lifeAreaResult = await pool.query(
      `UPDATE "Life_Areas" SET name = $1 WHERE life_area_id = $2 AND user_id = $3 RETURNING *`,
      [name, id, userId]
    )

    if (lifeAreaResult.rows.length === 0) {
      return res.status(404).json({
        error: "life area no ha sido encontrada o usuario no autorizado",
      })
    }
    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar life area: ", error)
    res.status(500).json({ error: "Error al actualizar life area" })
  }
})

//Iniciar sesión
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body

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

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user })
})

//Actualizar perfil
app.patch("/api/updateProfile", authenticateToken, async (req, res) => {
  const userId = req.query.userId

  const { name, lastName, birthDate, phoneNumber, email, password } = req.body

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
    if (lastName) {
      updateFields.push(`last_name = $${valueIndex}`)
      values.push(lastName)
      valueIndex++
    }
    if (birthDate) {
      updateFields.push(`birthdate = $${valueIndex}`)
      values.push(birthDate)
      valueIndex++
    }
    if (phoneNumber) {
      updateFields.push(`phone_number = $${valueIndex}`)
      values.push(phoneNumber)
      valueIndex++
    }
    if (email) {
      updateFields.push(`email = $${valueIndex}`)
      values.push(email)
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
app.patch("/api/changePassword", authenticateToken, async (req, res) => {
  const userId = req.query.userId
  const { password } = req.body

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      `UPDATE "Users" SET password = $1 WHERE user_id  = $2 RETURNING *`,
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

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`)
})
