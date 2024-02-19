import { React } from "react"
import MonthView from "../calendarViews/MonthView"
import WeekView from "../calendarViews/WeekView"

export default function Calendar() {

  return (
    <>
    <div className="">
      <MonthView></MonthView>
      <WeekView></WeekView>
    </div>
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
    </>
  )
}
