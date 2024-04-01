import { React, useState } from "react"

export default function MonthView() {
  const monthName = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const now = new Date()
  let [month, setMonth] = useState(now.getMonth())
  let [year, setYear] = useState(now.getFullYear())
  let day = now.getDate()
  let currentMonth = now.getMonth()
  let currentYear = now.getFullYear()
  const currentDate = `${currentYear}-${currentMonth}-${day}`

  // Fechas en encabezados
  let textMonth = monthName[month]
  let currentTextMonth = monthName[currentMonth]
  let textDay = day
  let textYear = year

  function getNextMonth() {
    if (month !== 11) setMonth(month + 1)
    else {
      setYear(year + 1)
      setMonth((month = 0))
    }
    //se deben actualizar fechas en encabezados
  }
  function getPrevMonth() {
    if (month !== 0) setMonth(month - 1)
    else {
      setYear(year - 1)
      setMonth((month = 11))
    }
    //se deben actualizar fechas en encabezados
  }
  function getPrevYear() {
    setYear(year - 1)
  }
  function getNextYear() {
    setYear(year + 1)
  }
  //Calcula el primer día de la semana
  function startDay() {
    let start = new Date(year, month, 1)
    return start.getDate() - 1 === -1 ? 6 : start.getDay()
    // return start.getDate() === 1 ? start.getDay() : (start.getDay() + 1) % 7;
  }

  function leapYear() {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
  }

  function getTotalDays(monthValue) {
    if (monthValue === -1) monthValue = 11
    if (
      monthValue == 3 ||
      monthValue == 5 ||
      monthValue == 8 ||
      monthValue == 10
    )
      return 30
    else if (
      monthValue == 0 ||
      monthValue == 2 ||
      monthValue == 4 ||
      monthValue == 6 ||
      monthValue == 7 ||
      monthValue == 9 ||
      monthValue == 11
    )
      return 31
    else return leapYear() ? 29 : 28
  }

  //Datos de la Tabla:
  const monthDayCalList = []
  const monthDays = []
  const divClassname = {
    actualDays: "celda row-span-1 h-36 col-span-1 border p-2 overflow-hidden",
    prevDays:
      "celda row-span-1 h-36 col-span-1 border p-2 overflow-hidden opacity-50",
    nextDays:
      "celda row-span-1 h-36 col-span-1 border p-2 overflow-hidden opacity-50",
  }
  // Días del mes pasado
  for (let i = startDay(); i > 0; i--) {
    const dayOfPrevMonth = getTotalDays(month - 1) - (i - 1)

    monthDayCalList.push(
      <div key={`prev-${dayOfPrevMonth}`} className={divClassname.prevDays}>
        <p> {dayOfPrevMonth} </p>
        {/* <p>{content}</p> */}
        {/* Aquí puedes agregar tu lógica para las listas de tareas */}
      </div>
    )
  }
  // Días del mes actual:
  for (let i = 1; i <= getTotalDays(month); i++) {
    //Y determinar el día actual

    monthDays.push({ id: i, content: `Descripción para el día ${i}` })
  }

  for (let i = 0; i < monthDays.length; i++) {
    const { id, content } = monthDays[i]
    const dataDate = `${year}-${month}-${id}`

    monthDayCalList.push(
      <div
        key={id}
        data-date={dataDate}
        className={`${divClassname.actualDays} ${
          dataDate == currentDate ? "bg-green-400" : ""
        }`}>
        <p>{id}</p>
        <p>{content}</p>
        {/* Aquí puedes agregar tu lógica para las listas de tareas */}
      </div>
    )
  }
  //Días del mes siguiente
  const daysInNextMonth = (() => {
    return 7 * 6 - monthDayCalList.length
  })()

  for (let i = 1; i <= daysInNextMonth; i++) {
    const dataDate = `${year}-${month + 1}-${i}`

    monthDayCalList.push(
      <div
        key={`next-${i}`}
        data-date={dataDate}
        className={divClassname.nextDays}>
        <p>{i}</p>
        {/* Aquí puedes agregar tu lógica para las listas de tareas */}
      </div>
    )
  }

  return (
    <>
      <div className="container_calendar">
        <div className="header_calendar flex">
          <h1 id="text_day" className="font-bold">
            {textDay}
          </h1>
          <h5 id="text_month" className="flex self-center pl-4 text-xl">
            {currentTextMonth} {currentYear}
          </h5>
        </div>
        <div className="body_calendar border-2">
          <div className="container_change_date flex items-center justify-center">
            <button
              className="last_year rounded-full bg-transparent selection:outline-none m-1 focus:outline-none"
              onClick={getPrevYear}>
              &lt;
            </button>
            <button
              className="last_month rounded-full bg-transparent focus:outline-1 selection:outline-none m-1 focus:outline-none"
              onClick={getPrevMonth}>
              &lt;
            </button>
            <div className="min-w-40 text-center">
              <span id="text_month_02"> {textMonth} </span>
              <span id="text_year"> {textYear} </span>
            </div>
            <button
              className="next_month rounded-full bg-transparent focus:outline-1 selection:outline-none m-1 focus:outline-none"
              onClick={getNextMonth}>
              &gt;
            </button>
            <button
              className="next_year rounded-full bg-transparent focus:outline-1 selection:outline-none m-1 focus:outline-none"
              onClick={getNextYear}>
              &gt;
            </button>
          </div>
          <div className="container_weedays grid grid-rows-1 grid-cols-7 text-center">
            <span className="week_days_item">DOM</span>
            <span className="week_days_item">LUN</span>
            <span className="week_days_item">MAR</span>
            <span className="week_days_item">MIÉ</span>
            <span className="week_days_item">JUE</span>
            <span className="week_days_item">VIE</span>
            <span className="week_days_item">SÁB</span>
          </div>
          <div className="container_days grid grid-rows-5 grid-cols-7 grid-flow-row border-2 text-xs">
            {monthDayCalList}
          </div>
        </div>
      </div>
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
    </>
  )
}
