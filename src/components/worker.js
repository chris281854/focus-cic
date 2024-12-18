self.addEventListener("push", (event) => {
  const data = event.data.json()
  console.log("Notification received:", data)

  const options = {
    body: data.message,
    //   icon: "/icon.png", // Ruta al icono de la notificación
    //   badge: "/badge.png", // Ruta opcional para el badge
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})
