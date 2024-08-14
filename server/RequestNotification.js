export default function requestNotificationPermission() {
  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      console.log("Permiso:", permission)
      if (permission === "granted") {
        console.log("Notificaciones permitidas.")
      } else {
        console.log("Notificaciones denegadas.")
      }
    })
  } else {
    console.log(`Estado actual del permiso: ${Notification.permission}`)
  }
}
