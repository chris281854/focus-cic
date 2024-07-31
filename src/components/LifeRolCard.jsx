// LifeRolCard.jsx
import React from "react"

const LifeRolCard = ({ key, title, relatedGoals, longTermGoal, satisfaction }) => {

  console.log(relatedGoals)
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mx-auto max-h-fit h-fit w-fit min-w-80">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${satisfaction}%` }}></div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-1">Metas</h3>
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
  )
}

export default LifeRolCard
