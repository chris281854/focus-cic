import { React, useEffect, useState } from "react"
import MonthView from "./MonthView"
import WeekView from "./WeekView"
import DayView from "./DayView"
import axios from "axios"
import { useUser } from "../../../context/UserContext"

export default function Calendar() {
  const { user } = useUser()
  const [viewSelector, setViewSelector] = useState("mes")
  const [events, setEvents] = useState([])
  const [togglePosition, setTogglePosition] = useState("left")

  const handleSelectView = (e) => {
    setViewSelector(e)
  }

  const handleToggle = (position) => {
    setTogglePosition(position)
  }

  useEffect(() => {
    console.log("renderizando")
    const fetchEvents = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/get/events?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
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
      <div className="w-full select-none">
        <div className="flex items-center space-x-1 ">
          <button
            onClick={() => handleSelectView("mes")}
            className={`cursor-pointer py-1 px-4 rounded-l-full ${
              viewSelector === "mes" ? "bg-blue-500 text-white" : "bg-gray-400"
            }`}>
            Mes
          </button>
          <button
            onClick={() => handleSelectView("semana")}
            className={`cursor-pointer py-1 px-4 rounded-none ${
              viewSelector === "semana"
                ? "bg-blue-500 text-white"
                : "bg-gray-400"
            }`}>
            Semana
          </button>
          <button
            onClick={() => handleSelectView("dia")}
            className={`cursor-pointer py-1 px-4 rounded-r-full ${
              viewSelector === "dia" ? "bg-blue-500 text-white" : "bg-gray-400"
            }`}>
            Día
          </button>
        </div>
        <div>
          {viewSelector === "mes" && <MonthView events={events} />}
          {viewSelector === "semana" && <WeekView events={events} />}
          {viewSelector === "dia" && <DayView events={events} />}
        </div>
      </div>
    </>
  )
}
