import React, { useState, useEffect } from "react"
import { useUser } from "../../../../context/UserContext"
import axios from "axios"
import dayjs from "dayjs"
import LifeAreaCard from "./LifeAreaCard"
import { PlusCircle, TrendingUp } from "lucide-react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip as ChartTooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui/card"
import { ChartContainer } from "../../../ui/chart"

export default function Habits() {
  // Manejar eventos base
  const baseAreas = [
    "Relaciones Sociales",
    "Intelecto",
    "Salud Física",
    "Espiritualidad",
  ]
  const optionalAreas = [
    { id: 1, value: "Finanzas" },
    { id: 2, value: "Familia" },
    { id: 3, value: "Carrera" },
    { id: 5, value: "Salud Mental" },
    { id: 6, value: "Ejercicio" },
    { id: 8, value: "Relaciones Sociales" },
    { id: 9, value: "Crecimiento Personal" },
    { id: 10, value: "Trabajo" },
    { id: 11, value: "Educación" },
    { id: 12, value: "Espiritualidad" },
    { id: 16, value: "Hobbies" },
    { id: 18, value: "Relación Amorosa" },
    { id: 20, value: "Desarrollo Profesional" },
  ]

  const [latestScores, setLatestScores] = useState([])
  const [selectedValues, setSelectedValues] = useState([])

  const {
    user,
    lifeAreas,
    updateLifeAreas,
    allEvents,
    fetchAllEvents,
    events,
    fetchEvents,
  } = useUser()
  const [newLifeArea, setNewLifeArea] = useState("")
  const [newScore, setNewScore] = useState(5)
  const [editingLifeArea, setEditingLifeArea] = useState(null)
  const [updatedName, setUpdatedName] = useState("")
  const [updatedScore, setUpdatedScore] = useState("")

  const [relatedGoals, setRelatedGoal] = useState("")
  const [longTermGoal, setLongTermGoal] = useState("")

  const [randomColor, setRandomColor] = useState() //Utilizar o eliminar

  const fetchLifeAreas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/get/lifeAreas`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      updateLifeAreas(response.data)
    } catch (error) {
      console.error("Error fetching life areas:", error)
    }
  }

  // // manejar eventos base:
  // const handleSeleccion = (value) => {
  //   setSelectedValues((prevSelectedValues) => {
  //     if (prevSelectedValues.includes(value)) {
  //       //Retirar valores seleccionados
  //       return prevSelectedValues.filter((item) => item !== value)
  //     } else {
  //       return [...prevSelectedValues, value]
  //     }
  //   })
  // }

  useEffect(() => {
    if (user) {
      fetchLifeAreas()
      fetchAllEvents()
      fetchEvents()
    }
  }, [user])

  const addLifeArea = async (event) => {
    event.preventDefault()

    for (const lifeArea of lifeAreas) {
      if (lifeArea.name === newLifeArea) {
        alert("Ya existe una faceta con este nombre")
        return
      }
    }

    try {
      await axios.post(
        `http://localhost:3001/api/post/lifeAreas`,
        {
          name: newLifeArea,
          userId: user.user_id,
          score: newScore,
          longTermGoal: longTermGoal,
          date: dayjs(),
          color: getRandomColor(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      fetchLifeAreas()
      setNewLifeArea("")
      setNewScore("")
    } catch (error) {
      console.error("Error adding life area:", error)
    }
  }

  const saveUpdatedLifeArea = async () => {
    try {
      await axios.patch(
        `http://localhost:3001/api/life-areas/${editingLifeArea}`,
        { name: updatedName, userId: user.id, score: updatedScore },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      fetchLifeAreas()
      setEditingLifeArea(null)
    } catch (error) {
      console.error("Error updating life area:", error)
    }
  }

  const deleteLifeArea = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/lifeAreas/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { userId: user.id },
      })
      fetchLifeAreas()
    } catch (error) {
      console.error("Error deleting life area:", error)
    }
  }

  const handleClick = () => {
    setRandomColor(getRandomColor())
  }

  //Handle Score:
  const handleScoreInput = (event) => {
    const inputValue = event.target.value
    const intValue = Number(inputValue)

    if (/^\d*$/.test(inputValue) && intValue <= 10) {
      setNewScore(intValue)
    }
  }
  const upScore = (event) => {
    if (newScore < 10) {
      setNewScore((prevScore) => Number(prevScore) + 1)
    }
  }
  const downScore = (event) => {
    if (newScore > 1) {
      setNewScore((prevScore) => Number(prevScore) - 1)
    }
  }

  const getLatestScores = (lifeAreas) => {
    return lifeAreas.map((area) => {
      if (!area.scores || area.scores.length === 0) {
        return { name: area.name, score: null, date: null }
      }

      const latestScore = area.scores.reduce(
        (acc, current) => {
          if (
            !acc.score_date ||
            dayjs(current.score_date).isAfter(dayjs(acc.score_date))
          ) {
            return current
          }
          return acc
        },
        { score_value: null, score_date: null }
      )

      return {
        name: area.name,
        score: latestScore.score_value,
        date: latestScore.score_date,
      }
    })
  }
  // console.log(latestScores)

  const ChartTooltipContent = ({ payload }) => {
    if (!payload || !payload.length) return null
    return (
      <div className="custom-tooltip">
        <p>{`${payload[0].payload.area} : ${payload[0].value}`}</p>
      </div>
    )
  }

  useEffect(() => {
    setLatestScores(getLatestScores(lifeAreas))
  }, [lifeAreas])

  const chartData = latestScores.map((score) => ({
    area: score.name,
    score: score.score !== null ? score.score : 1,
  }))

  return (
    <div className="w-full max-w-full min-h-screen text-primary-foreground flex flex-col p-4 select-none gap-4">
      <div className="flex gap-4 flex-wrap w-full justify-center">
        <Card className="lg:w-5/12 min-w-[300px] max-h-[400px] flex-grow bg-primary/10 dark:bg-slate-900 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary dark:text-white">
              Facetas de Vida
            </CardTitle>
            <CardDescription className="text-primary dark:text-white">
              Satisfacción percibida en cada una de sus facetas
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer className="mx-auto aspect-square max-h-[300px] w-full">
              <RadarChart data={chartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis
                  dataKey="area"
                  tick={{ fill: "currentColor" }}
                />
                <PolarGrid stroke="currentColor" opacity={0.2} />
                <Radar
                  dataKey="score"
                  fill="rgb(var(--primary))"
                  fillOpacity={0.6}
                  stroke="rgb(var(--primary))"
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                    fill: "rgb(var(--tertiary))",
                    stroke: "rgb(var(--primary))",
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 dark:bg-slate-900 lg:w-6/12 min-w-[300px] max-h-[400px] border-primary/20 overflow-y-scroll !scrollbar-thumb-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary dark:text-white">
              Nueva Área de Vida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addLifeArea} className="flex flex-col gap-4">
              <div className="flex items-center flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Nombre del área"
                  value={newLifeArea}
                  onChange={(e) => setNewLifeArea(e.target.value.toUpperCase())}
                  className="w-full sm:w-1/2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex items-center w-full sm:w-1/2 gap-2">
                  <label htmlFor="score" className="whitespace-nowrap">
                    Satisfacción:
                  </label>
                  <select
                    id="score"
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-[100px] px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Objetivos de largo plazo"
                value={longTermGoal}
                onChange={(e) => setLongTermGoal(e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
                <PlusCircle className="inline-block mr-2 h-4 w-4" /> Añadir Área
              </button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
            {optionalAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => setNewLifeArea(area.value.toUpperCase())}
                className="px-2 py-1 text-xs bg-transparent border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                {area.value}
              </button>
            ))}
          </CardFooter>
        </Card>
      </div>
      <div className="w-full flex flex-wrap gap-3 justify-center">
        {lifeAreas.map((area) => (
          <LifeAreaCard
            area={area}
            key={area.life_area_id}
            allEvents={allEvents}
            events={events}
          />
        ))}
      </div>
    </div>
  )
}
