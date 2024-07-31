import { useEffect } from "react"
import React from "react"

const DayDiv = React.memo(
  ({ id, content, dataDate, selectedDiv, handleSelectedDiv, datedEvents }) => {
    console.log(datedEvents, dataDate)
    const divClassnames = {
      actualDays: "row-span-1 h-36 col-span-1 border p-2 overflow-hidden",
      otherMonthDays:
        "row-span-1 h-36 col-span-1 border p-2 overflow-hidden opacity-50",
      selectedDay:
        "row-span-1 h-36 col-span-1 border p-2 overflow-hidden border-8",
    }
    const divClass = () => {
      let divClass = divClassnames.actualDays
      if (selectedDiv === dataDate) {
        divClass = divClass + " " + divClassnames.selectedDay
      }
      // console.log(selectedDiv," ",dataDate)
      return divClass
    }

    return (
      <div
        key={id}
        onClick={() => handleSelectedDiv(dataDate)}
        data-date={dataDate}
        className={divClass()}>
        <p>{id}</p>
        <p>{content}</p>
        {datedEvents &&
          datedEvents.map((event, index) => (
            <div key={index} className="rounded-3xl bg-green-600 h-min w-min p-2 m-1">
              <p>{event.name}</p>
            </div>
          ))}
        {/* lógica para las listas de tareas */}
      </div>
    )
  }
)

export default DayDiv
