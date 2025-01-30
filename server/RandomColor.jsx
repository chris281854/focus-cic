export default function getRandomColor() {
  const colors = [
    "#708090", // slate-500
    "#d3d3d3", // gray-300
    "#e57373", // red-600
    "#ffa726", // orange-400
    "#fff59d", // yellow-200
    "#66bb6a", // green-500
    "#1976d2", // blue-700
    "#7986cb", // indigo-300
    "#ba68c8", // purple-600
    "#ec407a", // pink-500
    "#26a69a", // teal-400
    "#4dd0e1", // cyan-300
    "#dce775", // lime-200
    "#ffb74d", // amber-500
    "#66bb6a", // emerald-400
    "#81d4fa", // sky-300
    "#a5d6a7", // mint-200
    "#ff7043", // coral-500
    "#ff8a65", // salmon-400
    "#ce93d8", // lavender-300
  ]

  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}
