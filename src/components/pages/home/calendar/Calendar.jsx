import { React, useEffect, useState } from "react"
import MonthView from "./MonthView"
import WeekView from "./WeekView"
import DayView from "./DayView"
import axios from "axios"
import { useUser } from "../../../../context/UserContext"

export default function Calendar() {
  const { user, lifeAreas, fetchEvents, fetchReminders, events, reminders, allEvents } =
    useUser()
  const [viewSelector, setViewSelector] = useState("mes")
  const [togglePosition, setTogglePosition] = useState("left")
  const [eventCount, setEventCount] = useState(0)

  const handleSelectView = (e) => {
    setViewSelector(e)
  }

  const handleToggle = (position) => {
    setTogglePosition(position)
  }

  useEffect(() => {
    fetchEvents()
  }, [eventCount])

  const handleEventCreated = () => {
    setEventCount((prevCount) => prevCount + 1)
  }

  return (
    <>
      <div className="w-full select-none">
        <div className="fixed top-1 w-fit h-fit justify-self-center z-10 ml-3 mt-3">
          <button
            onClick={() => handleSelectView("mes")}
            className={`cursor-pointer py-1 px-4 rounded-l-full ${
              viewSelector === "mes" ? "bg-primary text-white" : "bg-gray-400"
            }`}>
            Mes
          </button>
          <button
            onClick={() => handleSelectView("semana")}
            className={`cursor-pointer py-1 px-4 rounded-none ${
              viewSelector === "semana"
                ? "bg-primary text-white"
                : "bg-gray-400"
            }`}>
            Semana
          </button>
          <button
            onClick={() => handleSelectView("dia")}
            className={`cursor-pointer py-1 px-4 rounded-r-full ${
              viewSelector === "dia" ? "bg-primary text-white" : "bg-gray-400"
            }`}>
            Día
          </button>
        </div>
        <div>
          {viewSelector === "mes" && (
            <MonthView events={events} onEventCreated={handleEventCreated} />
          )}
          {viewSelector === "semana" && (
            <WeekView events={events} onEventCreated={handleEventCreated} />
          )}
          {viewSelector === "dia" && (
            <DayView events={events} onEventCreated={handleEventCreated} />
          )}
        </div>
      </div>
    </>
  )
}
