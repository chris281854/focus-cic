import { React, useEffect, useState } from "react"
import MonthView from "../calendarViews/MonthView"
import WeekView from "../calendarViews/WeekView"
import DayView from "../calendarViews/DayView"
import axios from "axios"
import { useUser } from "../../context/UserContext"

export default function Calendar() {
  const { user } = useUser()
  const [viewSelector, setViewSelector] = useState("mes")
  const [events, setEvents] = useState([])

  const handleSelectView = (e) => {
    setViewSelector(e.target.value)
  }

  useEffect(() => {
    console.log("renderizando")
    const fetchEvents = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/get/events?userId=${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        )
        setEvents(response.data)
      } catch (error) {
        console.error("Error al obtener los eventos: ", error)
      }
    }
    fetchEvents(user.user_id)
  }, [])

  return (
    <>
      <div className="w-full">
        
        <select
          name="dropdown"
          id="dropdown"
          className="bg-white text-primary rounded-md w-fit h-10 absolute right-5"
          onChange={handleSelectView}>
          <option value="mes">Mes</option>
          <option value="semana">Semana</option>
          <option value="dia">Día</option>
        </select>
        <div>
          {viewSelector === "mes" && <MonthView events={events} />}
          {viewSelector === "semana" && <WeekView events={events} />}
          {viewSelector === "dia" && <DayView events={events} />}
        </div>
      </div>
    </>
  )
}
