import dayjs from "dayjs"
import React, { useState, useEffect } from "react"
import Select from "react-select"
import { useUser } from "../../../../context/UserContext"

const TimezoneSelector = () => {
  const { timezone, setTimezone } = useUser()

  const [selectedTimezone, setSelectedTimezone] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())

  const timeZones = Intl.supportedValuesOf("timeZone").map((tz) => ({
    value: tz,
    label: tz,
  }))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (selectedOption) => {
    setSelectedTimezone(selectedOption)
    setTimezone(selectedOption.value)
  }

  const filteredOptions = timeZones
    .filter((tz) => tz.label.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 200)

  const customFilter = (inputValue) => {
    setSearchTerm(inputValue)
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgb(30 41 59)",
      borderColor: "rgb(148 163 184)",
      borderRadius: "0.375rem",
      padding: "0.5rem",
      color: "white",
      "&:hover": {
        borderColor: "rgb(100 116 139)",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgb(100 116 139)" : "transparent",
      color: state.isFocused ? "white" : "rgb(241 245 249)",
      padding: "10px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#334155",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "white",
    }),
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 p-4 bg-secondary/70 dark:bg-gray-700 rounded-lg shadow-md max-w-full w-fit h-fit overflow-hidden">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Zona horaria actual:
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {timezone || "No seleccionada"}
          </p>
        </div>
        <div className="flex-1 p-4 bg-secondary/70 dark:bg-gray-700 rounded-lg shadow-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Fecha y hora identificadas:
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {dayjs(currentDate)
              .tz(timezone || "UTC")
              .format("MMMM DD, YYYY HH:mm:ss")}
          </p>
        </div>
      </div>
      <Select
        options={filteredOptions}
        value={selectedTimezone}
        onChange={handleChange}
        onInputChange={customFilter}
        isSearchable={true}
        placeholder="Buscar zona horaria..."
        styles={customStyles}
        className="w-full"
      />
    </div>
  )
}

export default TimezoneSelector
