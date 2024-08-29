import { useState, useEffect } from "react"
import dayjs from "dayjs"
import NewEvent from "../../NewEvent"
import EditItem from "../../EditItem"

export default function WeekDayDiv({
  today,
  content,
  day,
  onClick,
  selectedDate,
  matchingEvents,
  onEventCreated,
}) {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const [onEdit, setOnEdit] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const [toggleNewEvent, setToggleNewEvent] = useState(false)
  const [timedEvent, setTimedEvent] = useState(null)

  function handleNewEvent(hour) {
    const eventTime = dayjs(`${day} ${hour}`).format("YYYY-MM-DD HH:mm")
    setTimedEvent(eventTime)
    setToggleNewEvent(true)
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
      <div
        data-date={day}
        className={`${day === today ? "bg-emerald-600/40" : ""} ${
          selectedDate === day ? "bg-slate-900" : ""
        } row-span-1 h-max col-span-1 border-r font-bold overflow-hidden`}>
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
              className="border-b h-12 max-h-12 hover:bg-slate-800 flex p-1"
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
                      backgroundColor: event.life_areas[0]?.color || "#808080",
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
    </>
  )
}
