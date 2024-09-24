import axios from "axios"
import { useUser } from "../../../../context/UserContext"
import { useState } from "react"

export default function ThemeSelector() {
  const { user, themeColor, setThemeColor, secondaryColor, tertiaryColor } =
    useUser()

  const handleThemeChange = (selectedColor) => {
    const paletteColors = {
      blue: ["30, 58, 138", "139, 165, 235", "86, 125, 234"],
      emerald: ["16, 185, 129", "130, 233, 199", "0, 154, 103"],
      neutral: ["54, 55, 58", "193, 184, 179", "151, 136, 122"],
      rose: ["244, 63, 94", "228, 141, 155", "228, 95, 117"],
      slate: ["55, 65, 81", "179, 187, 199", "140, 154, 176"],
      violet: ["46, 16, 101", "176, 158, 211", "150, 122, 204"],
    }

    const [themeColor, secondaryColor, tertiaryColor] =
      paletteColors[selectedColor]

    setThemeColor(themeColor, secondaryColor, tertiaryColor)
  }

  return (
    <section className="mb-8 shadow rounded-lg p-6">
      <h1 className="text-5xl font-semibold mb-4">Personalización</h1>
      <h2 className="text-2xl font-semibold mb-2">Tema de color</h2>
      <div className="flex gap-2 rounded dark:bg-slate-800 p-4 w-fit">
        <div
          onClick={() => handleThemeChange("blue")}
          className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("emerald")}
          className="w-8 h-8 bg-emerald-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("neutral")}
          className="w-8 h-8 bg-neutral-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("rose")}
          className="w-8 h-8 bg-rose-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("slate")}
          className="w-8 h-8 bg-slate-500 rounded-full cursor-pointer"></div>
        <div
          onClick={() => handleThemeChange("violet")}
          className="w-8 h-8 bg-violet-500 rounded-full cursor-pointer"></div>
      </div>
    </section>
  )
}
