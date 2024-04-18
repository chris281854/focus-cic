export default function DayDiv({
  id,
  content,
  dataDate,
  selectedDiv,
  handleSelectedDiv,
}) {
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
      {/* lógica para las listas de tareas */}
    </div>
  )
}
