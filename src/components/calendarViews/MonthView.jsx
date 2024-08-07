import { React, useState, useEffect } from "react"
import DayDiv from "./DayDiv"
import dayjs from "dayjs"

export default function MonthView({ events }) {
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

  //Variables de fecha
  const now = new Date()
  const currentDay = now.getDate()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const [day, setDay] = useState(currentDay)
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())

  //Datos de la Tabla
  const currentDate = `${currentYear}-${currentMonth}-${currentDay}`
  const [selectedDate, setSelectedDate] = useState(
    new Date(`${year}-${month + 1}-${day}`)
  )
  const [selectedDiv, setSelectedDiv] = useState(null)

  // const handleSelectedDiv = (dataDate) => {
  //   setSelectedDiv(() => {
  //     if (dataDate === selectedDiv) {
  //       return null
  //     } else {
  //       setDay(() => parseInt(dataDate.split("-")[2]))
  //       // console.log(day)
  //       return dataDate
  //     }
  //   })
  // }

  // Fechas en encabezados
  const handleSelectedDiv = (dataDate) => {
    setSelectedDiv((prevSelectedDiv) => {
      if (dataDate === prevSelectedDiv) {
        return null // No hacer cambios si ya está seleccionado
      } else {
        setDay(() => parseInt(dataDate.split("-")[2]))
        return dataDate
      }
    })
  }

  let textMonth = monthName[month]
  let currentTextMonth = monthName[currentMonth]
  let textDay = currentDay
  let textYear = year

  //UseEffect para la actualización de los valores de selectedDate:
  useEffect(() => {
    const newDate = new Date(`${year}-${month + 1}-${day}`)
    if (newDate.getTime() !== selectedDate.getTime()) {
      //Revisar esto
      setSelectedDate(newDate)
      setDatePickValue(newDate)
    }
  }, [year, month, day])

  function getNextMonth() {
    if (month !== 11) setMonth(month + 1)
    else {
      setYear(year + 1)
      setMonth(0)
    }
  }
  function getPrevMonth() {
    if (month !== 0) setMonth(month - 1)
    else {
      setYear(year - 1)
      setMonth(11)
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

  const getMatchingEvents = (events, dataDate) => {
    const matchingEvents = events.filter(
      (event) => dayjs(event.date).format("YYYY-M-D") === dataDate
    )
    return matchingEvents
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
    selectedDay: "",
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
      monthDays.push({ id: i, content: "" })
    }

    for (let i = 0; i < monthDays.length; i++) {
      const { id, content } = monthDays[i]
      const dataDate = `${year}-${month}-${id}`

      const matchingEvents = getMatchingEvents(events, dataDate)

      monthDayCalList.push(
        <DayDiv
          datedEvents={matchingEvents}
          key={id}
          id={id}
          content={content}
          dataDate={dataDate}
          currentDate={currentDate}
          selectedDiv={selectedDiv}
          handleSelectedDiv={handleSelectedDiv}
        />
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

  //Date picker:
  const [datePickValue, setDatePickValue] = useState(selectedDate)
  const handleDatePickChange = (event) => {
    const date = event.target.value

    //parsear para obtener año, mes y día por separado
    const parsedDate = new Date(date)
    const parsedYear = parsedDate.getFullYear()
    const parsedMonth = parsedDate.getMonth()
    const parsedDay = parsedDate.getDate() + 1

    setYear(parsedYear)
    setMonth(parsedMonth)
    setDay(parsedDay)
  }

  return (
    <>
      <div className="container_calendar">
        <div className="header_calendar flex">
          <p className="text-xl flex self-center pr-3">Today:</p>
          <h1 id="text_day" className="font-bold">
            {textDay}
          </h1>
          <h5 id="text_month" className="flex self-center pl-4 text-xl">
            {currentTextMonth} {currentYear}
          </h5>
        </div>
        <div className="body_calendar border-2">
          <div className="spans-div flex justify-center content-center">
            <span className="p-2"> {textMonth} </span>
            <span className="p-2"> {textYear} </span>
          </div>
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
              <input
                value={datePickValue.toISOString().split("T")[0]}
                onChange={handleDatePickChange}
                type="date"
                name="date-input"
                id="date-input"
                className="border-none outline-none bg-transparent text-white"
              />
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
          <div className="grid grid-rows-5 grid-cols-7 grid-flow-row border-2 text-xs">
            {monthDayCalList}
          </div>
        </div>
      </div>
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
    </>
  )
}
