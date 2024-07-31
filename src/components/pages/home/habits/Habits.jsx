import { React, useState, useEffect } from "react"
import { useUser } from "../../../../context/UserContext"
import axios, { formToJSON } from "axios"
import dayjs from "dayjs"
import LifeAreaCard from "../../../LifeAreaCard"

export default function Habits() {
  // Manejar eventos base
  const baseAreas = ["Social", "Intelectual", "Físico", "Espiritual"]
  const optionalAreas = [
    { id: 1, value: "Finanzas" },
    { id: 2, value: "Familia" },
    { id: 3, value: "Carrera" },
  ]

  const [selectedValues, setSelectedValues] = useState([])

  const { user, lifeAreas, updateLifeAreas } = useUser()
  const [newLifeArea, setNewLifeArea] = useState("")
  const [newScore, setNewScore] = useState("")
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

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ]

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
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
    if (newScore > 0) {
      setNewScore((prevScore) => Number(prevScore) - 1)
    }
  }

  return (
    <div className="w-full min-h-screen text-white flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Facetas</h1>
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Añadir nueva área de vida
          </h2>
          <div>
            <form onSubmit={addLifeArea} className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newLifeArea}
                  onChange={(e) => setNewLifeArea(e.target.value.toUpperCase())}
                  className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white uppercase"
                />
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
                <input
                  type="text"
                  placeholder="Objetivos de largo plazo"
                  value={longTermGoal}
                  onChange={(e) => setLongTermGoal(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
                  Añadir
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="grid gap-4 mb-8">
          {lifeAreas.map((area) => (
            <LifeAreaCard area={area} key={area.life_area_id} />
          ))}
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Escoge tus facetas</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {baseAreas.map((baseArea, index) => (
                <button
                  key={index}
                  className={`block w-auto text-left p-4 rounded-lg transition duration-300 bg-blue-800 hover:bg-blue-700`}>
                  {baseArea}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {optionalAreas.map((optionalArea) => (
                <button
                  key={optionalArea.id}
                  onClick={() => handleSeleccion(optionalArea.value)}
                  className={`block w-auto text-left p-4 rounded-lg hover:border-blue-700 border-none outline-none transition duration-300 ${
                    selectedValues.includes(optionalArea.value)
                      ? "bg-blue-600"
                      : "bg-gray-700"
                  }`}>
                  {optionalArea.value}
                </button>
              ))}
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
