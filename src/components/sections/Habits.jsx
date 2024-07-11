import { React, useState, useEffect } from "react"
import { useUser } from "../../context/UserContext"
import axios from "axios"
import dayjs from "dayjs"
import LifeRolCard from "../LifeRolCard"

export default function Habits() {
  const { user, lifeAreas, updateLifeAreas } = useUser()
  const [newLifeArea, setNewLifeArea] = useState("")
  const [newScore, setNewScore] = useState("")
  const [editingLifeArea, setEditingLifeArea] = useState(null)
  const [updatedName, setUpdatedName] = useState("")
  const [updatedScore, setUpdatedScore] = useState("")

  const [longTermGoal, setLongTermGoal] = useState("")
  const [shortTermGoal, setShortTermGoal] = useState("")

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

  return (
    <div className="">
      <div>
        <h1>Facetas</h1>
        <div>
          <input
            type="text"
            placeholder="New Life Area"
            value={newLifeArea}
            onChange={(e) => setNewLifeArea(e.target.value)}
          />
          <input
            type="number"
            placeholder="Score"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
          />
          <button onClick={addLifeArea}>Add Life Area</button>
        </div>
      </div>
      <div>
        {lifeAreas.map((area) => (
          <LifeRolCard
            key={area.id}
            title={area.name}
            longTermGoal={longTermGoal}
            shortTermGoal={shortTermGoal}
            satisfaction={75}
          />
        ))}
      </div>
    </div>
  )
}
