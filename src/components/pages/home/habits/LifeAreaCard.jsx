import React, { useState, useEffect } from "react"
import LifeArea from "./LifeArea/LifeArea"
import { useUser } from "../../../../context/UserContext"
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../../../ui/card"
import dayjs from "dayjs"
import { Calendar, CheckCircle } from "lucide-react"

export default function LifeAreaCard({ area, allEvents, events }) {
  const title = area.name
  const [satisfaction, setSatisfaction] = useState(
    area.scores[area.scores.length - 1]?.score_value
  )
  const areaColor = area.color

  const [scoreBar, setScoreBar] = useState(satisfaction * 10)
  const [overView, setOverView] = useState(false)

  useEffect(() => {
    if (satisfaction === null || isNaN(satisfaction)) {
      setScoreBar(0)
    } else {
      setScoreBar(satisfaction * 10)
    }
  }, [satisfaction])

  function handleOverview() {
    setOverView(true)
  }

  const areaEvents = events.filter((event) =>
    event.life_areas.some((lifeArea) => lifeArea.name === area.name)
  )
  const areaHasEvents = areaEvents.length > 0

  const [parentState, setParentState] = useState(0)

  const onAreaModified = () => {}
  useEffect(() => {
    setSatisfaction(area.scores[area.scores.length - 1]?.score_value)
  }, [parentState, area])

  return (
    <>
      <Card
        onClick={handleOverview}
        className="bg-primary/30 dark:bg-gray-800 h-72 w-full sm:w-80 md:w-96 duration-300 hover:shadow-lg hover:scale-102 overflow-hidden cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
            {title}
          </CardTitle>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
            <div
              className="h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${scoreBar}%`,
                backgroundColor: areaColor,
              }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Satisfacción: {satisfaction}/10
          </p>
        </CardHeader>
        <CardContent className="overflow-y-auto h-48">
          <h6 className="text-sm font-semibold text-neutral-800 dark:text-gray-300 mb-2">
            Tareas y eventos pendientes
          </h6>
          {areaHasEvents ? (
            <div className="space-y-2">
              {areaEvents.map((event, key) => (
                <div
                  key={key}
                  className="p-2 rounded bg-secondary/50 dark:bg-gray-700 flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary dark:text-gray-400" />
                    <p className="text-gray-800 dark:text-white">
                      {event.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-800 dark:text-white">
                    <Calendar className="w-3 h-3" />
                    <p>{dayjs(event.date).format("DD/MM/YY")}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 italic">
              Nada que mirar por aquí
            </p>
          )}
        </CardContent>
        <CardFooter className="pt-2 pb-3 px-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Haz clic para ver más detalles
          </p>
        </CardFooter>
      </Card>
      {overView && (
        <LifeArea
          area={area}
          overView={overView}
          setOverView={setOverView}
          areaEvents={areaEvents}
          areaHasEvents={areaHasEvents}
          onAreaModified={onAreaModified}
        />
      )}
    </>
  )
}
