import { useState, useEffect } from "react"
import { Bar, BarChart } from "recharts"

export default function LifeArea({ area, overView, setOverView }) {
  const satisfaction = area.scores[0]?.score_value
  const [longTermGoal, setLongTermGoal] = useState(area.long_goal)
  const relatedGoals = []
  const [areaName, setAreaName] = useState(area.name)
  const [scoreBar, setScoreBar] = useState(satisfaction * 10)
  const scoreChartData = area.scores

  function scoreBarHandler() {
    if (satisfaction === null || satisfaction === NaN) {
      setScoreBar(0)
    }
  }

  useEffect(() => {
    scoreBarHandler()
  }, [])

  function handleOverview() {
    setOverView(!overView)
  }
  function handleChildClick(e) {
    e.stopPropagation()
  }

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className="flex fixed z-50 inset-0 bg-opacity-30 bg-black backdrop-blur"
      onClick={handleOverview}>
      <div
        className="flex bg-slate-800 flex-col justify-start p-4 w-full sm:w-full md:w-11/12 lg:w-11/12 h-full sm:h-5/6 rounded-3xl mx-auto my-auto overflow-scroll no-scrollbar"
        onClick={handleChildClick}>
        <div className="flex p-4 mb-4 shadow-md rounded-md bg-primary/75 dark:bg-slate-900/70 hover:bg-slate-900 transition-all items-center">
          <input
            type="text"
            className="text-2xl font-bold text-white bg-transparent"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value.toUpperCase())}
          />
          <div className="w-full bg-gray-700 rounded-full h-4 m-10">
            <div
              className="bg-accent h-4 rounded-full shadow-[5px_5px_40px_rgba(7,237,24,0.25)] shadow-accent ring-2 ring-accent transition-all"
              style={{ width: `${scoreBar}%` }}></div>
          </div>
        </div>
        <div className="flex p-2 mb-4 shadow-md rounded-md bg-primary/75 dark:bg-slate-900/70 hover:bg-slate-900 transition-all items-center flex-col w-80 h-fit max-h-72">
          <label htmlFor="long_goal" className="text-xl font-semibold mb-1">Metas</label>
          <textarea
            name="long_goal"
            id="long_goal"
            className="text-xl h-full w-full min-h-20 font-thin mb-1 text-white bg-transparent scrollbar-none"
            onChange={(e) => setLongTermGoal(e.target.value)}>
              {longTermGoal}
          </textarea>
        </div>
        {relatedGoals &&
          relatedGoals.map((goal) => (
            <div>
              <p className="text-gray-300">{goal}</p>
            </div>
          ))}
        <div className="flex p-2 mb-4 shadow-md rounded-md bg-primary/75 dark:bg-slate-900/70 hover:bg-slate-900 transition-all items-center flex-col w-80 h-fit max-h-72">
        <LineChart data={data} options={options} />
        </div>

      </div>
    </div>
  )
}
