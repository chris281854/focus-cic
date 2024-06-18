import { React, useState, useEffect } from "react"
import DayDiv from "./DayDiv"

export default function WeekView() {
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

  //Datos de la Tabla:
  const currentDate = `${currentYear}-${currentMonth}-${currentDay}`
  const [selectedDate, setSelectedDate] = useState(
    new Date(`${year}-${month + 1}-${day}`)
  )
  const [selectedDiv, setSelectedDiv] = useState(null)
  const handleSelectedDiv = (dataDate) => {
    setSelectedDiv(() => {
      if (dataDate === selectedDiv) {
        return null
      } else {
        setDay(() => parseInt(dataDate.split("-")[2]))
        console.log(day)
        return dataDate
      }
    })
  }

  const monthDayCalList = []
  const monthDays = []

  // Fechas en encabezados
  let textMonth = monthName[month]
  let currentTextMonth = monthName[currentMonth]
  let textDay = day
  let textYear = year

  //UseEffect para la actualización de los valores de selectedDate:
  useEffect(() => {
    const newDate = new Date(`${year}-${month + 1}-${day}`)
    setSelectedDate(newDate)
    setDatePickValue(newDate)
    console.log(week)
  }, [year, month, day])

  function getNextMonth() {
    if (month !== 11) setMonth(month + 1)
    else {
      setYear(year + 1)
      setMonth(0)
    }
    //se deben actualizar fechas en encabezados
  }
  function getPrevMonth() {
    if (month !== 0) setMonth(month - 1)
    else {
      setYear(year - 1)
      setMonth(11)
    }
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

  // Días del mes pasado
  for (let i = startDay(); i > 0; i--) {
    const dayOfPrevMonth = getTotalDays(month - 1) - (i - 1)

    monthDayCalList.push(
      <div
        key={`prev-${dayOfPrevMonth}`}
        className="celda row-span-1 col-span-1 border p-2 opacity-50">
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
      <DayDiv
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
    return 7 * 5 - monthDayCalList.length
  })()

  if (daysInNextMonth >= 0) {
    for (let i = 1; i <= daysInNextMonth; i++) {
      const dataDate = `${year}-${month + 1}-${i}`

      monthDayCalList.push(
        <div
          key={`next-${i}`}
          data-date={dataDate}
          className={`celda row-span-1 col-span-1 border p-2 next-month-day opacity-50`}>
          <p>{i}</p>
          {/* Aquí puedes agregar tu lógica para las listas de tareas */}
        </div>
      )
    }
  }

  //Manejar semanas
  const weekOfMonth = {
    primera: monthDayCalList.slice(0, 7),
    segunda: monthDayCalList.slice(7, 14),
    tercera: monthDayCalList.slice(14, 21),
    cuarta: monthDayCalList.slice(21, 28),
    quinta: monthDayCalList.slice(28, 35),
  }
  
  const [week, setWeek] = useState([])

  //Cambiar el mes actualizará a la primera semana del mes
  useEffect(() => {
    setWeek(weekOfMonth.primera)
  }, [month])

  //Semana correspondiente con la fecha actual, establecida por defecto
  // useEffect(() => {
  //   const currentWeekKey = Object.keys(weekOfMonth).find((key) =>
  //     weekOfMonth[key].some((day) => day.props["data-date"] === currentDate)
  //   )
  //   setWeek(weekOfMonth[currentWeekKey])
  // }, [])
  

  function getPrevWeek() {
    const currentWeekKeys = Object.keys(weekOfMonth)
    const currentWeekIndex = currentWeekKeys.findIndex(
      (key) => weekOfMonth[key][0].props["data-date"] === week[0].props["data-date"]
    )
    if (currentWeekIndex > 0) {
      setWeek(weekOfMonth[currentWeekKeys[currentWeekIndex - 1]])
    } else {
      if (month === 0) {
        getPrevYear()
        setMonth(11)
      } else {
        getPrevMonth()
      }
    }
  }

  function getNextWeek() {
    const currentWeekKeys = Object.keys(weekOfMonth);
    const currentWeekIndex = currentWeekKeys.findIndex(
      (key) => weekOfMonth[key][0].props["data-date"] === week[0].props["data-date"]
    );
  
    if (currentWeekIndex < currentWeekKeys.length - 1) {
      setWeek(weekOfMonth[currentWeekKeys[currentWeekIndex + 1]]);
      console.log(weekOfMonth[currentWeekKeys[currentWeekIndex + 1]])
    } else {
      // Manejo para ir a la semana siguiente o al mes/año siguiente si corresponde
      setMonth(month + 1)
    }
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
          <h1 id="text_day" className="font-bold">
            {textDay}
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
            <button
              className="prev_week rounded-full bg-transparent focus:outline-1 selection:outline-none m-1 focus:outline-none"
              onClick={getPrevWeek}>
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
              className="next_week rounded-full bg-transparent focus:outline-1 selection:outline-none m-1 focus:outline-none"
              onClick={getNextWeek}>
              &gt;
            </button>
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
          <div className="container_days grid grid-rows-5 grid-cols-7 grid-flow-row w-full border-2">
            {week}
          </div>
        </div>
      </div>
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
    </>
  )
}
