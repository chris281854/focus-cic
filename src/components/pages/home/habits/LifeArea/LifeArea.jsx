import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Dot,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../ui/card"
import { ChartContainer } from "../../../../ui/chart"
import dayjs from "dayjs"
import { TypeOutline } from "lucide-react"
import ToDoItem from "../../../../ToDoItem"
import { useUser } from "../../../../../context/UserContext"

export default function LifeArea({
  area,
  overView,
  setOverView,
  areaEvents,
  areaHasEvents,
}) {
  const { user, fetchEvents, events } = useUser()

  const satisfaction = area.scores[0]?.score_value
  const [newSatisfaction, setNewSatisfaction] = useState(satisfaction)
  const [longTermGoal, setLongTermGoal] = useState(area.long_goal)
  const [weekGoal, setWeekGoal] = useState(area.goals[0])

  const relatedGoals = []
  const [areaName, setAreaName] = useState(area.name)
  const [scoreBar, setScoreBar] = useState(satisfaction * 10)
  const scoresChartData = area.scores
  const areaColor = area.color

  function scoreBarHandler() {
    if (satisfaction === null || satisfaction === NaN) {
      setScoreBar(1)
    }
  }

  useEffect(() => {
    scoreBarHandler()
  }, [])

  useEffect(() => {
    // re-render the component when newSatisfaction changes
  }, [newSatisfaction])

  function handleOverview() {
    setOverView(!overView)
  }
  function handleChildClick(e) {
    e.stopPropagation()
  }
  function handleSliderChange(e) {
    const newValue = e.target.value
    setScoreBar(newValue)
    setNewSatisfaction(newValue / 10)
  }

  // Transformar los datos para el gráfico
  const chartData = scoresChartData.map((score) => ({
    Fecha: dayjs(score.date).format("YYYY-MM-DD"),
    Satisfacción: score.score_value,
  }))

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  }

  // const [tableModified, setTableModified] = useState(false)

  const handleTableModified = () => {
    fetchEvents(user.user_id)
  }

  function generateEvents(areaEvents) {
    if (!areaHasEvents) {
      return <p>No hay eventos para mostrar.</p>
    }
    return areaEvents.map((event) => (
      <ToDoItem
        key={event.event_id}
        event={event}
        onEventModified={handleTableModified}
      />
    ))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverview}>
      <div
        className="flex flex-col w-full max-w-6xl h-full max-h-[90vh] p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 rounded-lg shadow-xl overflow-auto scrollbar-thumb-slate-700 dark:scrollbar-thumb-slate-700"
        onClick={handleChildClick}>
        <div className="flex items-center justify-between p-4 mb-6 bg-primary/50 dark:bg-slate-900 rounded-lg shadow-md transition-all">
          <input
            type="text"
            className="w-72 mr-3 text-3xl font-bold text-white bg-transparent border-b-2 border-transparent focus:border-white focus:outline-none transition-all"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value.toUpperCase())}
          />
          <div className="flex-grow mx-4">
            <div className="w-full bg-gray-700 rounded-full h-4 relative">
              <div
                className="h-4 rounded-full transition-all"
                style={{
                  width: `${scoreBar}%`,
                  backgroundColor: areaColor,
                }}
              />
              <input
                type="range"
                min="10"
                max="100"
                step={10}
                value={scoreBar}
                onChange={handleSliderChange}
                className="absolute top-0 left-0 w-full h-4 opacity-0 cursor-pointer"
              />
            </div>
            <label className="text-sm text-white mt-1 block">
              Modifica el valor ⬆
            </label>
          </div>
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl font-bold"
            style={{ backgroundColor: areaColor }}>
            {newSatisfaction}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <Card className="bg-primary/75 dark:bg-slate-800 hover:bg-slate-900 transition-all">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">
                  Metas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="long_goal"
                  id="long_goal"
                  className="w-full h-32 p-2 text-white bg-transparent border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  onChange={(e) => setLongTermGoal(e.target.value)}
                  value={longTermGoal}
                />
              </CardContent>
            </Card>
            <Card className="bg-primary/60 dark:bg-slate-800 hover:bg-slate-900 transition-all">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">
                  Objetivos de la semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="week_goal"
                  id="week_goal"
                  className="w-full h-32 p-2 text-white bg-transparent border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  onChange={(e) => setWeekGoal(e.target.value)}
                  value={weekGoal}
                />
              </CardContent>
            </Card>
          </div>
          <Card className="bg-primary/30 dark:bg-slate-800 transition-all">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Seguidor de Satisfacción
              </CardTitle>
              <CardDescription className="text-white/70">
                Valoraciones del último mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-64 w-full">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Fecha" stroke="#fff" />
                  <YAxis type="number" domain={[0, 10]} stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Satisfacción"
                    stroke={areaColor}
                    strokeWidth={2}
                    dot={{ fill: areaColor }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-white/70">
                {dayjs().format("MMMM YYYY")}
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="mt-6 space-y-4">
          {areaHasEvents && generateEvents(areaEvents)}
        </div>
      </div>
    </div>
  )
}
