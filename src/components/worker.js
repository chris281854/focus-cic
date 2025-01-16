self.addEventListener("push", (event) => {
  if (!event.data) {
    console.warn("🔔 Notificación recibida sin datos.")
    return
  }

  let data
  try {
    data = event.data.json()
  } catch (error) {
    console.error("Error al parsear los datos de la notificación:", error)
    return
  }

  console.log("Notificación recibida:", data)
  
  const options = {
    body: data.message || "Tienes un nuevo recordatorio.",
    // icon: "/icon.png",       // Asegúrate de tener este archivo en tu proyecto
    // badge: "/badge.png",     // Badge pequeño (opcional)
    vibrate: [100, 50, 100], // Vibración (opcional)
    data: {
      url: "/", // URL a la que se redirige al hacer clic
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Manejar clic en la notificación
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close()

//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((clientList) => {
//         for (const client of clientList) {
//           if (client.url === event.notification.data.url && "focus" in client) {
//             return client.focus()
//           }
//         }
//         if (clients.openWindow) {
//           return clients.openWindow(event.notification.data.url)
//         }
//       })
//   )
// })
