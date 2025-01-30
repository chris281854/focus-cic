import { useState, useEffect } from "react"
import axios from "axios"
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
import { ChevronLeft } from "lucide-react"

export default function LifeArea({
  area,
  overView,
  setOverView,
  areaEvents,
  areaHasEvents,
  onAreaModified,
}) {
  const { user, fetchEvents, events, fetchLifeAreas } = useUser()

  const [satisfaction, setSatisfaction] = useState(
    area.scores[area.scores.length - 1]?.score_value
  )
  const [newSatisfaction, setNewSatisfaction] = useState()
  const [longTermGoal, setLongTermGoal] = useState(area.long_goal)
  const [relatedGoals, setRelatedGoals] = useState(area.goals[0])
  const [weekGoal, setWeekGoal] = useState(area.week_goal)
  const [areaName, setAreaName] = useState(area.name)
  const [scoreBar, setScoreBar] = useState(satisfaction * 10)
  const scoresChartData = area.scores
  const areaColor = area.color

  const [changeRealized, setChangeRealized] = useState(false)

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

  const updateArea = async () => {
    if (areaName === "") {
      setAreaName(area.name)
    }
    try {
      const res = await axios.patch(
        "http://localhost:3001/api/update/lifeArea",
        {
          userId: user.user_id,
          areaId: area.life_area_id,
          areaName,
          satisfaction: newSatisfaction,
          longTermGoal: longTermGoal || "",
          weekGoal,
        },
        { withCredentials: true }
      )

      if (res.status === 200) {
        console.log(res.data)
        console.log("Actuallización exitosa")
        fetchLifeAreas()
        onAreaModified()
        setChangeRealized(null)
        setSatisfaction(newSatisfaction)
        setNewSatisfaction(null)
      }
    } catch (error) {
      console.error(
        "Error durante el proceso de actualización:",
        error.response?.data || error.message,
        error
      )
    }
  }

  //Close with scape key
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        handleOverview()
      }
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])

  return (
    <div className="absolute top-0 left-0 w-full h-full z-50 p-6 gap-2 bg-white dark:bg-slate-900 overflow-auto scrollbar-thumb-slate-700 dark:scrollbar-thumb-slate-700">
      <div className="flex items-center justify-between gap-3 p-3 bg-primary/30 dark:bg-slate-900 rounded-lg shadow-md transition-all mb-3 flex-wrap">
        <button
          className="h-fit w-fit bg-slate-400 rounded-full content-center items-center text-white"
          onClick={handleOverview}>
          <ChevronLeft />
        </button>
        <input
          type="text"
          className="w-72 mr-3 text-3xl font-bold text-primary dark:text-white !bg-transparent border-b-2 border-primary dark:border-gray-700 focus:border-white dark:focus:border-white focus:outline-none transition-all"
          value={areaName}
          onChange={(e) => {
            setAreaName(e.target.value.toUpperCase())
            setChangeRealized(true)
          }}
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
          <label className="text-sm text-primary dark:text-white mt-1 block">
            Modifica el valor ⬆
          </label>
        </div>
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl font-bold"
          style={{ backgroundColor: areaColor }}>
          {newSatisfaction || satisfaction}
        </div>
      </div>
      {(newSatisfaction || changeRealized) && (
        <div className="flex m-2">
          <span className="text-primary dark:text-white">
            Hay cambios sin guardar
          </span>
          <button
            onClick={updateArea}
            className="bg-primary text-white dark:bg-slate-800 ml-auto">
            Guardar
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card className="bg-primary/50 dark:bg-slate-800 h-fit">
            <CardHeader>
              <CardTitle className="text-primary dark:text-white">
                Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                name="long_goal"
                id="long_goal"
                className="w-full h-32 p-1 text-white bg-transparent border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                onChange={(e) => {
                  setLongTermGoal(e.target.value)
                  setChangeRealized(true)
                }}
                value={longTermGoal}
              />
            </CardContent>
          </Card>
          <Card className="bg-primary/30 dark:bg-slate-800 h-fit">
            <CardHeader>
              <CardTitle className="text-primary dark:text-white">
                Objetivos de la semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                name="week_goal"
                id="week_goal"
                className="w-full h-32 p-1 text-white bg-transparent border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                onChange={(e) => {
                  setWeekGoal(e.target.value)
                  setChangeRealized(true)
                }}
                value={weekGoal}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="bg-primary/30 dark:bg-slate-800 transition-all h-fit">
          <CardHeader>
            <CardTitle className="text-primary dark:text-white">
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
        </Card>
      </div>
      <div className="mt-6 space-y-4">
        {areaHasEvents && generateEvents(areaEvents)}
      </div>
    </div>
  )
}
