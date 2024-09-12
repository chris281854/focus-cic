import React from "react"
import { useState, useEffect } from "react"
import LifeArea from "./pages/home/habits/LifeArea/LifeArea"
import { useUser } from "../context/UserContext"

export default function LifeAreaCard({ area }) {
  

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

  return (
    <>
      <div
        onClick={handleOverview}
        className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mx-auto max-h-fit h-fit w-fit min-w-80 transition-all duration-300 hover:scale-105">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${scoreBar}%`,
                backgroundColor: `${areaColor}`,
              }}></div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">Metas</h3>
          {longTermGoal}
          {relatedGoals &&
            relatedGoals.map((goal) => <p className="text-gray-300">{goal}</p>)}
        </div>
        <div className="flex">
          {/* <input
          type="text"
          placeholder="Meta a corto plazo"
          value={shortTermGoal}
          onChange={(e) => setShortTermGoal(e.target.value)}
          className="sm:w-auto flex-grow px-4 py-2 rounded-lg bg-gray-800 text-white border-none inline p-0 w-auto"
        />
        <input
          type="text"
          placeholder="Meta a largo plazo"
          value={longTermGoal}
          onChange={(e) => setLongTermGoal(e.target.value)}
          className="sm:w-auto flex-grow px-4 py-2 rounded-lg bg-gray-800 text-white border-none inline p-0 w-auto"
        /> */}
        </div>
      </div>
      {overView && (
        <LifeArea area={area} overView={overView} setOverView={setOverView} />
      )}
    </>
  )
}
