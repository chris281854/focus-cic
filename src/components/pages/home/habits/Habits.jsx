import { React, useState, useEffect } from "react"
import { useUser } from "../../../../context/UserContext"
import axios, { formToJSON } from "axios"
import dayjs from "dayjs"
import LifeAreaCard from "../../../LifeAreaCard"
import { TrendingUp } from "lucide-react"
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
import getRandomColor from "../../../../../server/RandomColor"

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

  const { user, lifeAreas, updateLifeAreas } = useUser()
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

  // manejar eventos base:
  const handleSeleccion = (value) => {
    setSelectedValues((prevSelectedValues) => {
      if (prevSelectedValues.includes(value)) {
        //Retirar valores seleccionados
        return prevSelectedValues.filter((item) => item !== value)
      } else {
        return [...prevSelectedValues, value]
      }
    })
  }

  useEffect(() => {
    if (user) {
      fetchLifeAreas()
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
    <div className="w-full max-w-full min-h-screen text-white flex flex-col p-4 select-none gap-1">
      <div className="flex gap-3 p-1 flex-wrap w-full justify-center">
        <Card
          className={
            "lg:w-4/12 min-w-96 max-h-96 sm:max-w-full flex-grow 2xl:flex-none"
          }>
          <CardHeader className="items-center">
            <CardTitle>Facetas</CardTitle>
            <CardDescription>
              Satisfacción percibida en cada una de sus facetas
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer className="mx-auto aspect-square max-h-[250px] w-full">
              <RadarChart data={chartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis dataKey="area" />
                <PolarGrid />
                <Radar
                  dataKey="score"
                  fill="#4299e1"
                  fillOpacity={0.7}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 lg:w-6/12 min-w-min max-w-fit max-h-96 overflow-hidden 2xl:flex-none">
          <CardHeader className="text-2xl font-semibold">
            <CardTitle>Añadir nueva área de vida</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addLifeArea} className="flex flex-col gap-4">
              <div className="flex items-center flex-col sm:flex-row gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newLifeArea}
                  onChange={(e) => setNewLifeArea(e.target.value.toUpperCase())}
                  className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
                  Añadir
                </button>
                <div className="flex items-center w-full sm:w-1/2">
                  <label htmlFor="score" className="mr-2">
                    Satisfacción:
                  </label>
                  <div className="relative flex items-center max-w-[14rem] p-2">
                    <button
                      type="button"
                      id="decrement-button"
                      onClick={downScore}
                      className="fa fa-angle-down rounded-none bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 rounded-s-lg h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"></button>
                    <input
                      type="text"
                      placeholder="0-10"
                      id="score"
                      value={newScore}
                      inputMode="numeric"
                      onChange={handleScoreInput}
                      className="rounded-none m-0 w-10 bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <button
                      type="button"
                      id="increment-button"
                      onClick={upScore}
                      className="fa fa-angle-up rounded-none bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 rounded-e-lg h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"></button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <textarea
                  placeholder="Objetivos de largo plazo"
                  value={longTermGoal}
                  onChange={(e) => setLongTermGoal(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white max-h-40 min-h-20 w-3/4"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter
            className={
              "h-fit bg-slate-950 flex gap-1 overflow-hidden w-full flex-wrap pt-6 mt-auto"
            }>
            {optionalAreas.map((area) => (
              <div
                className="h-8 w-fit p-1 bg-emerald-700 hover:bg-emerald-800 transition-all rounded-xl text-center"
                onClick={() => setNewLifeArea(area.value)}>
                {area.value}
              </div>
            ))}
          </CardFooter>
        </Card>
      </div>

      <div className="w-full flex flex-wrap border gap-3">
        {lifeAreas.map((area) => (
          <LifeAreaCard area={area} key={area.life_area_id} />
        ))}
      </div>
    </div>
  )
}
