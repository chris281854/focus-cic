import axios from "axios"
import { useUser } from "../../../../context/UserContext"
import { useState } from "react"

export default function ThemeSelector() {
  const { user, themeColor, setThemeColor, secondaryColor, tertiaryColor } =
    useUser()

  const paletteColors = {
    blue: ["30, 58, 138", "139, 165, 235", "86, 125, 234"],
    emerald: ["16, 185, 129", "130, 233, 199", "0, 154, 103"],
    neutral: ["54, 55, 58", "193, 184, 179", "151, 136, 122"],
    rose: ["244, 63, 94", "228, 141, 155", "228, 95, 117"],
    slate: ["55, 65, 81", "179, 187, 199", "140, 154, 176"],
    violet: ["46, 16, 101", "176, 158, 211", "150, 122, 204"],
  }
  const handleThemeChange = (selectedColor) => {
    const [themeColor, secondaryColor, tertiaryColor] =
      paletteColors[selectedColor]

    setThemeColor(themeColor, secondaryColor, tertiaryColor)
  }

  return (
    <div>
      <h4 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
        Tema de color
      </h4>
      <div className="flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-slate-900 rounded-lg justify-center">
        {Object.keys(paletteColors).map((color) => (
          <button
            key={color}
            onClick={() => handleThemeChange(color)}
            className={`w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
            style={{ backgroundColor: `rgb(${paletteColors[color][0]})` }}
            aria-label={`Seleccionar tema ${color}`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Los temas no están disponibles en el modo oscuro
      </p>
    </div>
  )
}
