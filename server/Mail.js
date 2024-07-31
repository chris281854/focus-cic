const express = require("express")
const bodyParser = require("body-parser")
const { Resend } = require("resend")
const fs = require("fs")
const path = require("path")
const app = express()
const port = 3001

const resend = new Resend("re_9DHfUfrU_JxrQMSXi6DMnaiqfUqVpUrys")

app.use(bodyParser.json())

app.post("/send-email", async (req, res) => {
  const { to, type, variables } = req.body

  let templatePath
  switch (type) {
    case "welcome":
      templatePath = path.join(__dirname, "templates", "welcome.html")
      break
    case "notification":
      templatePath = path.join(__dirname, "templates", "notification.html")
      break
    default:
      return res.status(400).json({ error: "Invalid email type" })
  }

  const htmlTemplate = fs.readFileSync(templatePath, "utf8")
  const htmlContent = htmlTemplate.replace(
    /{{(\w+)}}/g,
    (_, key) => variables[key] || ""
  )

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [to],
      subject: "Notification",
      html: htmlContent,
    })

    if (error) {
      return res.status(500).json({ error })
    }

    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
