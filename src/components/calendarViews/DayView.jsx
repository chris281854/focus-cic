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
  //Variables de fecha
  const now = new Date()

  let day = now.getDate()
  let [month, setMonth] = useState(now.getMonth())
  let [year, setYear] = useState(now.getFullYear())

  let currentMonth = now.getMonth()
  let currentYear = now.getFullYear()
  //Datos de la Tabla:
  const currentDate = `${currentYear}-${currentMonth}-${day}`
  const monthDayCalList = []
  const monthDays = []
  const [visibleDay, setVisibleDay] = useState()

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

  // // Días del mes pasado
  // for (let i = startDay(); i > 0; i--) {
  //   const dayOfPrevMonth = getTotalDays(month - 1) - (i - 1)

  //   monthDayCalList.push(
  //     <div
  //       key={`prev-${dayOfPrevMonth}`}
  //       className="celda row-span-1 col-span-1 border p-2 opacity-50">
  //       <p> {dayOfPrevMonth} </p>
  //       {/* <p>{content}</p> */}
  //       {/* Aquí puedes agregar tu lógica para las listas de tareas */}
  //     </div>
  //   )
  // }

  // Días del mes actual:
  for (let i = 1; i <= getTotalDays(month); i++) {
    //Y determinar el día actual

    monthDays.push({ id: i, content: `Descripción para el día ${i}` })
  }
  for (let i = 0; i < monthDays.length; i++) {
    const { id, content } = monthDays[i]
    const dataDate = `${year}-${month}-${id}`
    const weekDay = dataDate.getDay()

    monthDayCalList.push(
      <div
        key={id}
        data-date={dataDate}
        className={`celda row-span-1 col-span-1 border p-2 overflow-hidden ${
          dataDate == currentDate ? "bg-green-400" : ""
        }`}>
        <p>{id}</p>
        <p>{content}</p>
        <div className="grid grid-rows-12 grid-cols-1">
          <div>1
            <div></div>
          </div>
          <div>2
            <div></div>
          </div>
          <div>3
            <div></div>
          </div>
          <div>4
            <div></div>
          </div>
          <div>5
            <div></div>
          </div>
          <div>6
            <div></div>
          </div>
          <div>7
            <div></div>
          </div>
          <div>8
            <div></div>
          </div>
          <div>9
            <div></div>
          </div>
          <div>10
            <div></div>
          </div>
          <div>11
            <div></div>
          </div>
          <div>12
            <div></div>
          </div>

        </div>
        {/* Aquí puedes agregar tu lógica para las listas de tareas */}
      </div>
    )
  }

  //Días del mes siguiente
  // const daysInNextMonth = (() => {
  //   return 7 * 5 - monthDayCalList.length
  // })()

  // if (daysInNextMonth >= 0) {
  //   for (let i = 1; i <= daysInNextMonth; i++) {
  //     const dataDate = `${year}-${month + 1}-${i}`

  //     monthDayCalList.push(
  //       <div
  //         key={`next-${i}`}
  //         data-date={dataDate}
  //         className={`celda row-span-1 col-span-1 border p-2 next-month-day opacity-50`}>
  //         <p>{i}</p>
  //         {/* Aquí puedes agregar tu lógica para las listas de tareas */}
  //       </div>
  //     )
  //   }
  // }

  //Manejar semanas
  const weekOfMonth = [
    monthDayCalList.slice(0, 7),
    monthDayCalList.slice(7, 14),
    monthDayCalList.slice(14, 21),
    monthDayCalList.slice(21, 28),
    monthDayCalList.slice(28, 35),
  ]
  const [week, setWeek] = useState([])

  //(need to fix) => Cambiar el mes actualizará a la primera semana del mes actualizado
  useEffect(() => {
    setWeek(weekOfMonth[0])
  }, [month])

  //Semana correspondiente con la fecha actual, establecida por defecto
  useEffect(() => {
    const currentWeekIndex = weekOfMonth.findIndex((week) =>
      week.some((day) => day.props["data-date"] === currentDate)
    )
    setWeek(weekOfMonth[currentWeekIndex])
  }, [])

  function getPrevWeek() {
    const currentWeekIndex = weekOfMonth.findIndex(
      (currentWeek) => currentWeek[0].key === week[0].key
    )
    if (currentWeekIndex > 0) {
      setWeek(weekOfMonth[currentWeekIndex - 1])
    } else {
      if (month === 0) {
        getPrevYear()
        setMonth(11)
      } else {
        getPrevMonth()
      }
      setWeek(weekOfMonth[weekOfMonth.length - 1])
    }
  }

  function getNextWeek() {
    const currentWeekIndex = weekOfMonth.findIndex(
      (currentWeek) => currentWeek[0].key === week[0].key
    )

    if (currentWeekIndex < weekOfMonth.length - 1) {
      setWeek(weekOfMonth[currentWeekIndex + 1])
    } else if (month === 11) {
      getNextYear()
      setMonth(0)
      setWeek(weekOfMonth[0])
    } else {
      getNextMonth()
    }
  }

  //manejar días
  visibleDay.push(week[0])

  //Selector de fecha sobre el calendario
  function selectDate() {}



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
          <div className="container_change_date flex items-center justify-around">
            <button id="last_year" onClick={getPrevYear}>
              &lt;
            </button>
            <button id="last_month" onClick={getPrevMonth}>
              &lt;
            </button>
            <button id="last_week" onClick={getPrevWeek}>
              &lt;
            </button>
            <div className="date-picker" onClick={selectDate}>
              <span id="text_month_02"> {textMonth} </span>
              <span id="text_year"> {textYear} </span>
              <input
                type="date"
                name="date-input"
                id="date-input"
                className="border-none outline-none bg-transparent text-white"
              />
            </div>
            <button id="next_week" onClick={getNextWeek}>
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
            <span className="week_days_item">DOM</span>
          </div>
          <div className="container_days grid grid-rows-1 grid-cols-1 grid-flow-row w-full border-2">
            {visibleDay}
          </div>
        </div>
      </div>
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
    </>
  )
}