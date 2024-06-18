import { React, useState } from "react"
import MonthView from "../calendarViews/MonthView"
import WeekView from "../calendarViews/WeekView"
import DayView from "../calendarViews/DayView"

export default function Calendar() {
  const [viewSelector, setViewSelector] = useState("mes")

  const handleSelectView = (e) => {
    setViewSelector(e.target.value)
  }

  return (
    <>
      <div>
        <select
          name="dropdown"
          id="dropdown"
          className="bg-white text-primary rounded-md w-fit h-10 absolute right-5"
          onChange={handleSelectView}>
          <option value="mes">Mes</option>
          <option value="semana">Semana</option>
          <option value="dia">Día</option>
        </select>
        <div className="">
          {viewSelector === "mes" && <MonthView />}
          {viewSelector === "semana" && <WeekView />}
          {viewSelector === "dia" && <DayView />}
        </div>
        {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
      </div>
    </>
  )
}
