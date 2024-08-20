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
import getRandomColor from "../../../../../../server/RandomColor"
import { TypeOutline } from "lucide-react"

export default function LifeArea({ area, overView, setOverView }) {
  const satisfaction = area.scores[0]?.score_value
  const [newSatisfaction, setNewSatisfaction] = useState(satisfaction)
  const [longTermGoal, setLongTermGoal] = useState(area.long_goal)
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

  return (
    <div
      className="flex fixed z-50 inset-0 bg-opacity-30 bg-black backdrop-blur"
      onClick={handleOverview}>
      <div
        className="flex bg-slate-800 flex-col justify-start p-4 w-full sm:w-full md:w-11/12 lg:w-11/12 h-full sm:h-5/6 rounded-3xl mx-auto my-auto overflow-scroll no-scrollbar"
        onClick={handleChildClick}>
        <div className="flex p-4 mb-4 shadow-md rounded-md bg-primary/75 dark:bg-slate-900/70 hover:bg-slate-900 transition-all items-center justify-between">
          <input
            type="text"
            className="w-72 mr-3 text-2xl font-bold text-white bg-transparent"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value.toUpperCase())}
          />
          <div className="w-7/12 bg-gray-700 rounded-full h-4 mt-10 mb-10 relative">
            <div
              className={`outline h-4 rounded-full transition-all`}
              style={{
                width: `${scoreBar}%`,
                outlineColor: `${areaColor}`,
                backgroundColor: `${areaColor}`
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
            <label>Modifica el valor ⬆</label>
          </div>
          <div className={`static ml-4 rounded-full h-14 w-14 bg-${areaColor} text-center content-center`}>
            <label>{newSatisfaction}</label>
          </div>
        </div>
        <div className="flex p-2 mb-4 shadow-md rounded-md bg-primary/75 dark:bg-slate-900/70 hover:bg-slate-900 transition-all items-center flex-col w-80 h-fit max-h-72">
          <label htmlFor="long_goal" className="text-xl font-semibold mb-1">
            Metas
          </label>
          <textarea
            name="long_goal"
            id="long_goal"
            className="text-xl h-full w-full min-h-20 font-thin mb-1 text-white bg-transparent scrollbar-none"
            onChange={(e) => setLongTermGoal(e.target.value)}
            value={longTermGoal}></textarea>
        </div>
        {relatedGoals &&
          relatedGoals.map((goal, index) => (
            <div key={index}>
              <p className="text-gray-300">{goal}</p>
            </div>
          ))}

        <Card className={"shadow-md hover:bg-slate-900 transition-all w-10/12"}>
          <CardHeader>
            <CardTitle>Seguidor de Satisfacción</CardTitle>
            <CardDescription>Valoraciones del último mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full">
              <LineChart
                margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                accessibilityLayer
                data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="Fecha"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis type="number" domain={[0, 10]} />
                <Tooltip />
                <Line
                  dataKey="Satisfacción"
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={({ payload, index, ...props }) => {
                    return (
                      <Dot
                        key={`${payload.Fecha}-${index}`}
                        r={5}
                        cx={props.cx}
                        cy={props.cy}
                        fill="var(--color-desktop)"
                        stroke="var(--color-desktop)"
                      />
                    )
                  }}
                />
                <Legend />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              {dayjs().format("MMM YYYY")}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
