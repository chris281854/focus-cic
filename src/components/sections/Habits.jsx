import { React, useState, useEffect } from "react"
import { useUser } from "../../context/UserContext"
import axios from "axios"
import dayjs from "dayjs"
import LifeRolCard from "../LifeRolCard"

export default function Habits() {
  const baseAreas = ["Social", "Intelectual", "Físico", "Espiritual"]
  const optionalAreas = ["Finanzas", "Familia", "Carrera"]

  const [selectedTopic, setSelectedTopic] = useState([])
  
  const { user, lifeAreas, updateLifeAreas } = useUser()
  // console.log(lifeAreas)
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

  // useEffect(() => {
  //   if (user) {
  //     fetchLifeAreas();
  //   }
  // }, [user]);

  const addLifeArea = async () => {
    try {
      await axios.post(
        `http://localhost:3001/api/post/lifeAreas`,
        {
          name: newLifeArea,
          userId: user.user_id,
          score: newScore,
          longTermGoal: longTermGoal,
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

  return (
    <div className="w-full min-h-screen text-white flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Facetas</h1>
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Añadir nueva área de vida
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Nueva área de vida"
              value={newLifeArea}
              onChange={(e) => setNewLifeArea(e.target.value)}
              className="w-full sm:w-auto flex-grow px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
            <input
              type="number"
              placeholder="satisfacción"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              className="w-full sm:w-auto flex-grow px-4 py-2 rounded-lg bg-gray-800 text-white"
            />

            <button
              onClick={addLifeArea}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
              Add Life Area
            </button>
          </div>
        </div>
        <div className="grid gap-4 mb-8 p-4">
          {lifeAreas.map((area) => (
            <LifeRolCard
              key={area.life_area_id}
              title={area.name}
              relatedGoals={area.goals}
              satisfaction={area.score}
            />
          ))}
        </div>
        <div className="bg-gray-900 p-2 rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Escoge tus facetas</h2>
          <div className="flex flex-col">
            <div className="flex justify-self-center self-center w-fit gap-4 justify-around mb-4">
              {baseAreas.map((baseArea, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTopic(baseArea)}
                  className={`block w-fit text-left p-4 rounded-lg transition duration-300 ${
                    selectedTopic === baseArea ? "bg-blue-800" : "bg-blue-800"
                  } hover:bg-blue-700`}>
                  {baseArea}
                </button>
              ))}
            </div>
            <div className="flex justify-self-center self-center w-fit gap-4 justify-around">
              {optionalAreas.map((optionalArea, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTopic(optionalArea)}
                  className={`block w-full text-left p-4 rounded-lg transition duration-300 ${
                    selectedTopic === optionalArea
                      ? "bg-blue-600"
                      : "bg-gray-800"
                  } hover:bg-blue-700`}>
                  {optionalArea}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
