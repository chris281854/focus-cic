import React from "react"
import { useState, useEffect } from "react"
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

export default function LifeAreaCard({ area, allEvents, events }) {
  const title = area.name
  const satisfaction = area.scores[0]?.score_value
  const longTermGoal = area.long_goal
  const relatedGoals = []
  const areaColor = area.color

  const [scoreBar, setScoreBar] = useState(satisfaction * 10)
  const [overView, setOverView] = useState(false)

  function scoreBarHandler() {
    if (satisfaction === null || satisfaction === NaN) {
      setScoreBar(0)
    }
  }

  useEffect(() => {
    scoreBarHandler()
  }, [])

  function handleOverview() {
    setOverView(true)
  }

  const areaEvents = events.filter((event) =>
    event.life_areas.some((lifeArea) => lifeArea.name === area.name)
  )
  const areaHasEvents = areaEvents.length > 0

  return (
    <>
      <Card
        onClick={handleOverview}
        className="bg-gray-800 max-h-72 h-72 w-96 max-w-96 duration-300 hover:scale-105 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${scoreBar}%`,
                backgroundColor: `${areaColor}`,
              }}></div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-1 overflow-y-scroll">
          <h3 className="text-xl font-semibold">Tareas y eventos pendientes</h3>
          {areaHasEvents ? (
            areaEvents.map((event, key) => (
              <div
                key={key}
                className="p-1 px-2 rounded bg-slate-900 flex justify-between items-center">
                <p className="text-gray-300">{event.name}</p>
                <p>{dayjs(event.date).format("DD/MM/YYYY")}</p>
              </div>
            ))
          ) : (
            <p className="p-1 rounded text-base">Nada que mirar por aquí</p>
          )}
        </CardContent>
        {/* <CardFooter className="flex"></CardFooter> */}
      </Card>
      {overView && (
        <LifeArea
          area={area}
          overView={overView}
          setOverView={setOverView}
          areaEvents={areaEvents}
          areaHasEvents={areaHasEvents}
        />
      )}
    </>
  )
}
