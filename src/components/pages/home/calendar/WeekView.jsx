import { useState, useEffect, useMemo } from "react"
import dayjs from "dayjs"
// import "dayjs/locale/es"
// import isoWeek from "dayjs/plugin/isoWeek"
import WeekDayDiv from "./WeekDayDiv"
import EditItem from "../../../EditItem"
import NewEvent from "../../../NewEvent"

export default function WeekView({ events, onEventCreated }) {
  const today = dayjs().locale("es").format("YYYY-MM-DD")

  const [selectedDate, setSelectedDate] = useState(dayjs())
  const startOfWeek = selectedDate.startOf("week") // domingo es el inicio de semana
  const weekEnd = dayjs(selectedDate).endOf("week")

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) =>
    startOfWeek.add(i, "day")
  )
  const [content, setcontent] = useState([])

  const goToNextWeek = () => setSelectedDate(selectedDate.add(1, "week"))
  const goToNextMonth = () => setSelectedDate(selectedDate.add(1, "month"))
  const goToNextYear = () => setSelectedDate(selectedDate.add(1, "year"))
  const goToPreviousWeek = () =>
    setSelectedDate(selectedDate.subtract(1, "week"))
  const goToPreviousMonth = () =>
    setSelectedDate(selectedDate.subtract(1, "month"))
  const goToPreviousYear = () =>
    setSelectedDate(selectedDate.subtract(1, "year"))

  const [toggleAside, setToggleAside] = useState(true)
  const [toggleNewEvent, setToggleNewEvent] = useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12 // Convierte 0 en 12 y mantiene el resto en formato 12h
    const period = i < 12 ? "am" : "pm" // Determina si es AM o PM
    return `${hour}:00 ${period}` // Devuelve la hora en formato 12h con AM o PM
  })
  const handleDivClick = (event) => {
    setSelectedDate(dayjs(event.currentTarget.dataset.date))
  }

  const handleDateInputChange = (e) => {
    const newDate = dayjs(e.target.value)
    if (newDate.isValid() && !newDate.isSame(selectedDate, "day")) {
      setSelectedDate(newDate)
    }
  }

  const getMatchingEvents = (day, events) => {
    return events.filter((event) => dayjs(event.date).isSame(day, "day"))
  }
  const getEventsInWeek = () => {
    return events.filter((event) => {
      const eventDate = dayjs(event.date)
      return eventDate.isAfter(startOfWeek) && eventDate.isBefore(weekEnd)
    })
  }
  const eventsThisWeek = getEventsInWeek()

  const handleToggleAside = () => {
    setToggleAside(!toggleAside)
  }

  const [onEdit, setOnEdit] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const toggleEditEventVisibility = (event) => {
    setSelectedEvent(event)
    setOnEdit(true)
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
        <article className="overflow-y-scroll h-screen w-full">
          <article className="w-full h-full min-h-screen">
            <section className="backdrop-blur-2xl dark:bg-bg-main-color bg-secondary/50 rounded-b-lg">
              <section className="flex items-center justify-end pt-3 mr-4">
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToPreviousYear()}>
                  &lt;&lt;&lt;
                </button>
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToPreviousMonth()}>
                  &lt;&lt;
                </button>
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToPreviousWeek()}>
                  &lt;
                </button>

                <input
                  value={selectedDate.format("YYYY-MM-DD")}
                  onChange={handleDateInputChange}
                  type="date"
                  className="border-none outline-none bg-transparent text-white rounded p-1"
                />
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToNextWeek()}>
                  &gt;
                </button>
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToNextMonth()}>
                  &gt;&gt;
                </button>
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToNextYear()}>
                  &gt;&gt;&gt;
                </button>
              </section>
              <section className="grid grid-cols-8 h-8 pt-3 text-center top-[0px] z-10">
                <span></span> {/* Crear un espacio vacío en el primer row */}
                {["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  )
                )}
              </section>
              <section className="grid grid-cols-8 py-2 z-10  border-b">
                <span></span> {/* Placeholder para el primer espacio */}
                {daysOfWeek.map((day, index) => (
                  <span
                    key={index}
                    className="rounded-full h-12 w-12 text-center content-center bg-tertiary dark:bg-slate-500 justify-self-center">
                    {day.format("D")} {/* Día del mes */}
                  </span>
                ))}
              </section>
            </section>
            <div className="grid grid-cols-8">
              <div className="grid grid-cols-1 max-w-28 max-h-12">
                {hours.map((hour, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-end border-r p-3 border-b-gray-300 dark:border-b-gray-700 h-12 dark:text-white">
                    {hour}
                  </div>
                ))}
              </div>
              {daysOfWeek.map((day, index) => {
                const matchingEvents = getMatchingEvents(day, events)
                return (
                  <WeekDayDiv
                    today={today}
                    key={index}
                    day={day.format("YYYY-MM-DD")}
                    onClick={handleDivClick}
                    content={content}
                    selectedDate={selectedDate.format("YYYY-MM-DD")}
                    matchingEvents={matchingEvents}
                    onEventCreated={onEventCreated}
                  />
                )
              })}
            </div>
          </article>
        </article>
        <aside
          className={`${
            !toggleAside ? "hidden" : "w-60 min-w-60"
          } p-4 shadow-lg overflow-y-auto h-screen border`}>
          <header className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Eventos y Tareas
          </header>
          <main>
            {eventsThisWeek.length > 0 ? (
              <ul>
                {eventsThisWeek.map((event) => (
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
              <p className="text-gray-500">No hay tareas para esta semana.</p>
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
