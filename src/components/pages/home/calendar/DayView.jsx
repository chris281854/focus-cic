import { React, useState, useEffect } from "react"
import NewEvent from "../../../NewEvent"
import EditItem from "../../../EditItem"
import dayjs from "dayjs"
import "dayjs/locale/es"

export default function DayView({ events, onEventCreated }) {
  dayjs.locale("es")

  const today = dayjs().locale("es").format("YYYY-MM-DD")
  const [selectedDate, setSelectedDate] = useState(dayjs())

  const [weekDayName, setWeekDayName] = useState(
    dayjs(selectedDate).format("dddd")
  )

  const [content, setcontent] = useState([])

  const goToNextWeek = () => setSelectedDate(selectedDate.add(1, "week"))
  const goToNextDay = () => setSelectedDate(selectedDate.add(1, "day"))
  const goToPreviousWeek = () =>
    setSelectedDate(selectedDate.subtract(1, "week"))
  const goToPreviousDay = () => setSelectedDate(selectedDate.subtract(1, "day"))

  const hoursSpan = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12 // Convierte 0 en 12 y mantiene el resto en formato 12h
    const period = i < 12 ? "am" : "pm" // Determina si es AM o PM
    return `${hour}:00 ${period}` // Devuelve la hora en formato 12h con AM o PM
  })
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  const [onEdit, setOnEdit] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [timedEvent, setTimedEvent] = useState(null)
  const [toggleNewEvent, setToggleNewEvent] = useState(false)
  const getMatchingEvents = (day, events) => {
    return events.filter((event) => dayjs(event.date).isSame(day, "day"))
  }
  const matchingEvents = getMatchingEvents(selectedDate, events)

  function handleNewEvent(hour) {
    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD")
    const eventTime = dayjs(`${formattedDate} ${hour}`).format(
      "YYYY-MM-DD HH:mm"
    )
    setTimedEvent(eventTime)
    setToggleNewEvent(true)
  }

  useEffect(() => {
    setWeekDayName(dayjs(selectedDate).format("dddd"))
  }, [selectedDate])

  //Date picker:
  const [datePickValue, setDatePickValue] = useState(selectedDate)

  const handleDateInputChange = (e) => {
    const newDate = dayjs(e.target.value)
    if (newDate.isValid() && !newDate.isSame(selectedDate, "day")) {
      setSelectedDate(newDate)
    }
  }

  const [toggleAside, setToggleAside] = useState(true)
  const handleToggleAside = () => {
    setToggleAside(!toggleAside)
  }
  const toggleEditEventVisibility = (event) => {
    setSelectedEvent(event)
    setOnEdit(true)
  }

  return (
    <>
      {toggleNewEvent && (
        <NewEvent
          setToggleNewEvent={setToggleNewEvent}
          timedEvent={timedEvent}
          onEventCreated={onEventCreated}
        />
      )}
      {onEdit && selectedEvent && (
        <EditItem
          onEdit={onEdit}
          setOnEdit={setOnEdit}
          event={selectedEvent}
          onEventModified={onEventCreated}
        />
      )}
      <div className="flex max-h-screen">
        <article className="overflow-y-scroll w-full">
          <article className="h-full min-h-screen">
            <header className="flex border-b pb-4 pt-3 dark:bg-bg-main-color bg-secondary/50">
              <h2 className="ml-auto mr-3">
                {weekDayName} {dayjs(selectedDate).format("D")}
              </h2>
              <section className="items-center mr-3">
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToPreviousWeek()}>
                  &lt;&lt;
                </button>
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToPreviousDay()}>
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
                  onClick={() => goToNextDay()}>
                  &gt;
                </button>
                <button
                  className="rounded-full bg-transparent focus:outline-1 selection:outline-none focus:outline-none"
                  onClick={() => goToNextWeek()}>
                  &gt;&gt;
                </button>
              </section>
            </header>
            <div className="flex">
              <div className="w-28">
                {hoursSpan.map((hour, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-end border-r p-3 border-b-secondary dark:border-b-gray-700 h-12 text-gray-600 dark:text-white">
                    {hour}
                  </div>
                ))}
              </div>
              <div
                className={`flex-1 border-r font-bold overflow-hidden w-full`}>
                {hours.map((hour, index) => {
                  // Crear la hora actual en el formato adecuado
                  const hourString = index.toString().padStart(2, "0") // Por ejemplo: "08", "14"
                  // Y filtrar eventos que coincidan con la hora actual
                  const eventsAtThisHour = matchingEvents.filter(
                    (event) => dayjs(event.date).format("HH") === hourString
                  )

                  return (
                    <div
                      key={index}
                      className="border-b h-12 hover:bg-secondary dark:hover:bg-slate-800 flex p-1"
                      onClick={(e) => {
                        if (!onEdit) handleNewEvent(hourString)
                      }}>
                      {eventsAtThisHour.map((event) => {
                        return (
                          <div
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleEditEventVisibility(event)
                            }}
                            key={event.event_id}
                            style={{
                              backgroundColor:
                                event.life_areas[0]?.color || "#808080",
                            }}
                            className="rounded-md max-h-full w-full p-1 mx-1 font-thin text-sm overflow-hidden">
                            {event.name}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </article>
        </article>
        <aside
          className={`${
            !toggleAside ? "hidden" : "w-60 min-w-60"
          } p-4 shadow-lg overflow-y-auto h-screen`}>
          <header className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Eventos y Tareas
          </header>
          <main>
            {matchingEvents.length > 0 ? (
              <ul>
                {matchingEvents.map((event) => (
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
              <p className="text-gray-500">No hay eventos este día.</p>
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
