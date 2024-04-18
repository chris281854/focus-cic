import { React, useState, useEffect } from "react"

export default function DayView() {
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
  const weekDayName = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ]

  function leapYear(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
  }

  //Variables de fecha
  const now = new Date()
  const currentDay = now.getDate()
  const [day, setDay] = useState(currentDay)
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())

  let currentMonth = now.getMonth()
  let currentYear = now.getFullYear()

  //Datos de la Tabla:
  const currentDate = `${currentYear}-${currentMonth + 1}-${day}`
  const [selectedDate, setSelectedDate] = useState(
    new Date(`${year}-${month + 1}-${day}`)
  )
  const dataWeekDay = selectedDate.getDay()

  //UseEffect para la actualización de los valores de selectedDate:
  useEffect(() => {
    const newDate = new Date(`${year}-${month + 1}-${day}`)
    setSelectedDate(newDate)
    setDatePickValue(newDate)
  }, [year, month, day])

  // Fechas en encabezados
  const textMonth = monthName[month]
  const currentTextMonth = monthName[currentMonth]
  const textCurrentDay = now.getDate()
  const textYear = year

  function getNextDay() {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
    if (day < lastDayOfMonth) {
      setDay(day + 1)
    } else {
      setDay(1)
      getNextMonth()
    }
  }
  function getPrevDay() {
    const firstDayOfMonth = new Date(year, month + 1, 1).getDate()
    if (day !== firstDayOfMonth) {
      setDay(day - 1)
    } else {
      getPrevMonth()
      const lastDayOfMonth = new Date(year, month, 0).getDate()
      setDay(lastDayOfMonth)
    }
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 1)
  }
  function getNextMonth() {
    if (month !== 11) {
      setMonth(month + 1)
      setDay(1)
    } else {
      setYear(year + 1)
      setMonth(0)
      setDay(1)
    }
    //se deben actualizar fechas en encabezados
  }
  function getPrevMonth() {
    if (month !== 0) {
      const lastDayOfMonth = new Date(year, month, 0).getDate()
      setMonth((oldMonth) => oldMonth - 1)
      setDay(lastDayOfMonth)
    } else {
      const lastDayOfMonth = new Date(year, month, 0).getDate()
      setYear((oldYear) => oldYear - 1)
      setMonth(11)
      setDay(lastDayOfMonth)
    }
  }
  function getPrevYear() {
    setYear((oldYear) => {
      const prevYear = oldYear - 1
      if (!leapYear(prevYear) && month === 1 && day === 29) setDay(1)
      return prevYear
    })
  }
  function getNextYear() {
    setYear((oldYear) => {
      const nextYear = oldYear + 1
      if (!leapYear(nextYear) && month === 1 && day === 29) setDay(1)
      return nextYear
    })
  }

  const dayBox = [
    <div
      key={selectedDate}
      data-date={selectedDate}
      data-week-day={dataWeekDay}
      className={`celda row-span-1 col-span-1 border p-2 overflow-hidden ${
        selectedDate == currentDate ? "bg-green-400" : ""
      }`}>
      <p>{day}</p>
      <div className="grid grid-rows-12 grid-cols-1">
        <div>
          1<div></div>
        </div>
        <div>
          2<div></div>
        </div>
        <div>
          3<div></div>
        </div>
        <div>
          4<div></div>
        </div>
        <div>
          5<div></div>
        </div>
        <div>
          6<div></div>
        </div>
        <div>
          7<div></div>
        </div>
        <div>
          8<div></div>
        </div>
        <div>
          9<div></div>
        </div>
        <div>
          10
          <div></div>
        </div>
        <div>
          11
          <div></div>
        </div>
        <div>
          12
          <div></div>
        </div>
      </div>
      {/* Aquí puedes agregar tu lógica para las listas de tareas */}
    </div>,
  ]

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
          <h1 id="text_day" className="font-bold">
            {textCurrentDay}
          </h1>
          <h5 id="text_month" className="flex self-center pl-4 text-xl">
            {currentTextMonth} {currentYear}
          </h5>
        </div>
        <div className="body_calendar w-full border-2 h-fit">
          <div className="container_details">
            <div className="detail_1">
              <div className="detail">
                <div className="circle">
                  <div className="column"></div>
                </div>
              </div>
              <div className="detail">
                <div className="circle">
                  <div className="column"></div>
                </div>
              </div>
            </div>
            <div className="detail_2">
              <div className="detail">
                <div className="circle">
                  <div className="column"></div>
                </div>
              </div>
              <div className="detail">
                <div className="circle">
                  <div className="column"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="container_change_date flex items-center justify-around">
            <button id="last_year" onClick={getPrevYear}>
              &lt;
            </button>
            <button id="last_month" onClick={getPrevMonth}>
              &lt;
            </button>
            <button id="last_day" onClick={getPrevDay}>
              &lt;
            </button>
            <div className="date-picker">
              <span id="text_month_02"> {textMonth} </span>
              <span id="text_year"> {textYear} </span>
              <input
                value={datePickValue.toISOString().split('T')[0]}
                onChange={handleDatePickChange}
                type="date"
                name="date-input"
                id="date-input"
                className="border-none outline-none bg-transparent text-white"
              />
            </div>
            <button id="next_day" onClick={getNextDay}>
              &gt;
            </button>
            <button id="next_month" onClick={getNextMonth}>
              &gt;
            </button>
            <button id="next_year" onClick={getNextYear}>
              &gt;
            </button>
          </div>
          <div className="container_weedays grid grid-rows-1 grid-cols-1 text-center">
            <span className="week_days_item">{weekDayName[dataWeekDay]}</span>
          </div>
          <div className="grid grid-rows-1 grid-cols-1 grid-flow-row w-full border-2">
            {dayBox}
          </div>
        </div>
      </div>
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
    </>
  )
}
