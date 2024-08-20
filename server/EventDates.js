// import dayjs from "dayjs"

// const EventDates = ({ userId }) => {
//   const [events, setEvents] = useState([])

//   const eventDates = (events) => {
//     const now = dayjs()
//     const tomorrow = now.add(1, "day").startOf("day")
//     const thisWeek = now.add(1, "week").startOf("day")
//     const thisMonth = now.add(1, "month").startOf("day")

//     return events.map((event) => {
//       const eventDate = dayjs(event.date) // Convierte la fecha del evento a un objeto dayjs

//       if (event.state === 0) {
//         //No se modifica
//         return { ...event, state: 0 }
//       }

//       let newState
//       if (eventDate.isBefore(now)) {
//         newState = 1 //Atrasado
//       } else if (eventDate.isBefore(tomorrow)) {
//         newState = 2 //Hoy
//       } else if (eventDate.isBefore(tomorrow.add(1, "day"))) {
//         newState = 6 //Para mañana
//       } else if (eventDate.isBefore(thisWeek)) {
//         newState = 3 //Esta semana
//       } else if (eventDate.isBefore(thisMonth)) {
//         newState = 4 //Este mes
//       } else {
//         newState = 5 //Después
//       }

//       return { ...event, state: newState }
//     })
//   }
// }

// const fetchEvents = async (userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3001/api/get/events?userId=${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       )
//       if (response.ok) {
//         const updatedEvents
//       }

//       setEvents(response.data)
//     } catch (error) {
//       console.error("Error al obtener los eventos: ", error)
//     }
//   }