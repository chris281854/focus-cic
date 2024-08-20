import { useEffect } from "react"
import React from "react"
import dayjs from "dayjs"

const DayDiv = React.memo(
  ({
    id,
    content,
    dataDate,
    selectedDiv,
    handleSelectedDiv,
    datedEvents,
    currentDate,
  }) => {
    // const isToday = () => {
    //   // const today = dayjs().date()
    //   // const todayMonth = dayjs().month()
    //   // const thisYear = dayjs().year()
    //   // const formattedToday = `${thisYear}-${todayMonth}-${today}` // Formatea la fecha

    //   // console.log(formattedToday === dataDate, formattedToday, dataDate)

    // }

    const divClassnames = {
      base: "row-span-1 h-36 col-span-1 border p-1 font-bold overflow-hidden",
      otherMonthDays: "opacity-50",
      selectedDay: "border-8",
      today: "bg-blue-900/40",
    }

    const computeDivClass = () => {
      const todayFormatted = dayjs().format("YYYY-M-D")
      const isToday = currentDate === dataDate
      const isSelected = selectedDiv === dataDate

      return `${divClassnames.base} ${isToday ? divClassnames.today : ""} ${
        isSelected ? divClassnames.selectedDay : ""
      }`
    }

    return (
      <div
        key={dataDate}
        onClick={() => handleSelectedDiv(dataDate)}
        data-date={dataDate}
        className={computeDivClass()}>
        <p>{id}</p>
        <p>{content}</p>
        {datedEvents &&
          datedEvents.map((event, index) => (
            <div
              key={index}
              className="rounded-3xl h-min w-min p-2 m-1"
              style={{backgroundColor: `${event.life_areas[0]?.color || "#808080"} `}}>
              <p>{event.name}</p>
            </div>
          ))}
        {/* lógica para las listas de tareas */}
      </div>
    )
  }
)

export default DayDiv
