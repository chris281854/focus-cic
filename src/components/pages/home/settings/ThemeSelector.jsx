import axios from "axios"
import { useUser } from "../../../../context/UserContext"
import { useState } from "react"

export default function ThemeSelector() {
  const { user, themeColor, setThemeColor } = useUser()

  const handleThemeChange = (selectedColor) => {
    setThemeColor(selectedColor)
    console.log(themeColor)
  }

  return (
    <section className="mb-8 shadow rounded-lg p-6">
      <h1 className="text-5xl font-semibold mb-4">Personalización</h1>
      <h2 className="text-2xl font-semibold mb-2">Tema de color</h2>
      <div className="flex gap-2 rounded dark:bg-slate-800 p-4 w-fit">
        <div
          onClick={() => handleThemeChange("#0ea5e9")}
          className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("#22c55e")}
          className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("#ef4444")}
          className="w-8 h-8 bg-red-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("#ec4899")}
          className="w-8 h-8 bg-pink-500 rounded-full cursor-pointer"></div>
      </div>
    </section>
  )
}
