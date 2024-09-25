import { React, useState, useEffect } from "react"
import DayDiv from "./DayDiv"
import dayjs from "dayjs"
import NewEvent from "../../../NewEvent"
import EditItem from "../../../EditItem"

export default function MonthView({ events, onEventCreated }) {
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
  const [selectedDiv, setSelectedDiv] = useState(null) //Debe eliminarse
  const [eventsInThisMonth, setEventsInThisMonth] = useState([])

  useEffect(() => {
    const eventsInMonth = events.filter((event) => {
      const eventMonth = dayjs(event.date).format("M YYYY")
      const thisMonth = dayjs(selectedDate).format("M YYYY")
      return eventMonth === thisMonth
    })

    setEventsInThisMonth(eventsInMonth)
  }, [events, selectedDate])

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
    // Extrae año, mes y día de dataDate
    const [year, month, day] = dataDate.split("-").map(Number)
    // Ajusta el mes para que coincida con la indexación de 1-12
    const adjustedDataDate = `${year}-${month + 1}-${day}`
    const matchingEvents = events.filter((event) => {
      const eventDate = dayjs(event.date).format("YYYY-M-D")
      // console.log(eventDate, adjustedDataDate)
      return eventDate === adjustedDataDate
    })

    return matchingEvents
  }

  //Datos de la Tabla:
  const monthDayCalList = []
  const monthDays = []
  const divClassname = {
    prevDays: "row-span-1 col-span-1 border p-1 h-full opacity-50",
    nextDays: "row-span-1 col-span-1 border p-1 h-full opacity-50",
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
        onEventCreated={onEventCreated}
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

  const [toggleAside, setToggleAside] = useState(true)
  const handleToggleAside = () => {
    setToggleAside(!toggleAside)
  }
  //NewEvent - EditItem variables
  const [toggleNewEvent, setToggleNewEvent] = useState(false)
  const [onEdit, setOnEdit] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const toggleEditEventVisibility = (event) => {
    setSelectedEvent(event)
    setOnEdit(true)
  }
  function handleNewEvent(dataDate) {
    const eventTime = dayjs(`${dataDate} 8:00am`).format("YYYY-MM-DD HH:mm")
    setTimedEvent(eventTime)
    setToggleNewEvent(true)
    console.log(eventTime)
  }

  return (
    <>
      {toggleNewEvent && (
        <NewEvent setToggleNewEvent={setToggleNewEvent}></NewEvent>
      )}
      {onEdit && (
        <EditItem
          onEdit={onEdit}
          setOnEdit={setOnEdit}
          event={selectedEvent}
          onEventModified={onEventCreated}
        />
      )}
      <div className="flex">
        <div className="relative grid grid-flow-row grid-rows-[80px,30px,100%] max-h-screen h-screen w-full overflow-y-scroll">
          <header className="flex content-center items-center gap-1 bg-secondary/50 dark:bg-transparent">
            <div className="flex ml-auto">
              <span className="text-2xl">
                {" "}
                {textMonth} {textYear}{" "}
              </span>
            </div>
            <section className="flex items-center justify-center">
              <button
                className="last_year rounded-full bg-transparent selection:outline-none m-1 focus:outline-none"
                onClick={getPrevYear}>
                &lt;&lt;
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
                  className="border-none outline-none bg-transparent text-white rounded p-1"
                />
              </div>
              <button
                className="rounded-full bg-transparent focus:outline-1 selection:outline-none m-1 focus:outline-none"
                onClick={getNextMonth}>
                &gt;
              </button>
              <button
                className="next_year rounded-full bg-transparent focus:outline-1 selection:outline-none m-1 focus:outline-none"
                onClick={getNextYear}>
                &gt;&gt;
              </button>
            </section>
          </header>
          <div className="grid grid-rows-1 grid-cols-7 text-center bg-secondary/50 dark:bg-transparent">
            {["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="grid grid-rows-6 grid-cols-7 grid-flow-row text-xs">
            {monthDayCalList}
          </div>
        </div>
        <aside
          className={`${
            !toggleAside ? "hidden" : "w-60 min-w-60"
          } p-4 shadow-lg overflow-y-auto h-screen`}>
          <main>
            {eventsInThisMonth.length > 0 ? (
              <ul>
                {eventsInThisMonth.map((event) => (
                  <li
                    key={event.event_id}
                    onClick={() => toggleEditEventVisibility(event)}
                    className="mb-3 p-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg shadow-sm overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${
                        event.life_areas[0]?.color || "#808080"
                      } 0%, #f0f0f0 150%)`,
                    }}>
                    <h6 className="text-lg font-semibold mb-2">{event.name}</h6>
                    <div className="flex items-center justify-between text-gray-900 rounded">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-calendar-alt text-gray-900"></i>
                        <p className="text-sm">
                          {dayjs(event.date).format("dddd")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-clock text-gray-900"></i>
                        <p className="text-sm">
                          {dayjs(event.date).format("h:mm A")}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      {event.life_areas.map((area, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-medium rounded bg-white text-black"
                          style={{ backgroundColor: area.color || "#ddd" }}>
                          {area.name}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay tareas para este día.</p>
            )}
          </main>
        </aside>
        <button
          className={`${
            toggleAside ? "" : "text-accent"
          } bg-blue-950 fixed z-10 bottom-3 right-5 rounded-full`}
          onClick={handleToggleAside}>
          {toggleAside ? <p>&gt;</p> : <p>&lt;</p>}
        </button>
      </div>
    </>
  )
}
