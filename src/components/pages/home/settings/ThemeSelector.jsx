import axios from "axios"
import { useUser } from "../../../../context/UserContext"
import { useState } from "react"

export default function ThemeSelector() {
  const { user, themeColor, setThemeColor, secondaryColor } = useUser()

  const handleThemeChange = (primary, secondary) => {
    setThemeColor(primary, secondary)

    console.log(themeColor, secondaryColor)
  }

  return (
    <section className="mb-8 shadow rounded-lg p-6">
      <h1 className="text-5xl font-semibold mb-4">Personalización</h1>
      <h2 className="text-2xl font-semibold mb-2">Tema de color</h2>
      <div className="flex gap-2 rounded dark:bg-slate-800 p-4 w-fit">
        <div
          onClick={() => handleThemeChange("#1E3A8A", "#60A5FA")}
          className="w-8 h-8 bg-blue-900 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("#10B981", "#34D399")}
          className="w-8 h-8 bg-emerald-600 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("#262626", "#525252")}
          className="w-8 h-8 bg-neutral-700 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("#F43F5E", "#FB7185")}
          className="w-8 h-8 bg-rose-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("#64748B", "#94A3B8")}
          className="w-8 h-8 bg-slate-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("#5B21B6", "#8B5CF6")}
          className="w-8 h-8 bg-violet-500 rounded-full cursor-pointer"></div>
      </div>
    </section>
  )
}
