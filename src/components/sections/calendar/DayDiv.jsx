import { useEffect, useState } from "react"
import React from "react"
import dayjs from "dayjs"
import NewEvent from "../../NewEvent"
import EditItem from "../../EditItem"

const DayDiv = React.memo(
  ({
    id,
    content,
    dataDate,
    handleSelectedDiv,
    datedEvents,
    currentDate,
    onEventCreated,
  }) => {
    const divClassnames = {
      base: "row-span-1 col-span-1 border p-1 font-bold overflow-hidden hover:bg-slate-900 h-full min-h-full",
      otherMonthDays: "opacity-50",
      today: "bg-blue-900/40",
    }

    const computeDivClass = () => {
      const todayFormatted = dayjs().format("YYYY-M-D")
      const isToday = currentDate === dataDate

      return `${divClassnames.base} ${isToday ? divClassnames.today : ""}`
    }

    const [onEdit, setOnEdit] = useState(false)
    const [toggleNewEvent, setToggleNewEvent] = useState(false)
    const [timedEvent, setTimedEvent] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)

    function handleNewEvent(date) {
      const dateYear = dayjs(date).format("YYYY")
      const dateMonth = parseInt(dayjs(date).format("MM"))
      const fixedDateMonth = dateMonth + 1
      const dateDay = dayjs(date).format("DD")
      const formattedDate = `${dateYear}-${fixedDateMonth}-${dateDay}`
      const eventTime = dayjs(`${formattedDate} 8:00`).format(
        "YYYY-MM-DD HH:mm"
      )
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
          key={dataDate}
          onClick={() => {
            handleSelectedDiv(dataDate)
            if (!onEdit) handleNewEvent(dataDate)
          }}
          data-date={dataDate}
          className={computeDivClass()}>
          <p>{id}</p>
          <p>{content}</p>
          {datedEvents &&
            datedEvents.map((event, index) => (
              <div
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleEditEventVisibility(event)
                }}
                key={index}
                className="rounded-lg h-min w-min p-2 m-1"
                style={{
                  backgroundColor: `${
                    event.life_areas[0]?.color || "#808080"
                  } `,
                }}>
                <p>{event.name}</p>
              </div>
            ))}
          {/* lógica para las listas de tareas */}
        </div>
      </>
    )
  }
)

export default DayDiv
