import dayjs from "dayjs"
import React, { useState, useEffect } from "react"
import Select from "react-select"
import { useUser } from "../../../../context/UserContext"

const TimezoneSelector = () => {
  const { user, timezone, setTimezone } = useUser()

  const [selectedTimezone, setSelectedTimezone] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [detectedTimezone, setDetectedTimezone] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  // Obtener las zonas horarias del navegador
  const timeZones = Intl.supportedValuesOf("timeZone").map((tz) => ({
    value: tz,
    label: tz,
  }))

  // Actualizar la fecha cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => clearInterval(interval) // Limpiar el intervalo al desmontar el componente
  }, [])

  const handleChange = (selectedOption) => {
    setSelectedTimezone(selectedOption) // Actualizar la zona horaria seleccionada
    setTimezone(selectedOption.value)
  }

  const filteredOptions = timeZones
    .filter((tz) => tz.label.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 200) // Limitar las opciones que se muestran

  const customFilter = (inputValue) => {
    setSearchTerm(inputValue) // Actualizar el término de búsqueda
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgb(30 41 59)", // Fondo oscuro
      borderColor: "rgb(148 163 184)", // Slate-500
      borderRadius: "0.375rem", // Rounded-lg
      padding: "0.5rem",
      color: "white", // Texto blanco
      "&:hover": {
        borderColor: "rgb(100 116 139)", // Slate-600
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgb(100 116 139)" : "transparent", // Slate-600
      color: state.isFocused ? "white" : "rgb(241 245 249)", // Texto blanco en foco
      padding: "10px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white", // Texto del valor seleccionado en blanco
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#334155", // Fondo del menú desplegable
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white", // Placeholder en blanco
    }),
    input: (provided) => ({
      ...provided,
      color: "white", // Texto del input en blanco
    }),
    // Estilos para el scrollbar
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "white", // Color del icono de dropdown en blanco
    }),
  }

  return (
    <div className="w-full">
      <label className="block text-slate-300 mb-2">
        Selecciona una zona horaria:
      </label>
      <Select
        options={filteredOptions}
        value={selectedTimezone}
        onChange={handleChange}
        onInputChange={customFilter}
        isSearchable={true}
        placeholder="Buscar zona horaria..."
        styles={customStyles}
      />
      {/* Tarjeta con la fecha en tiempo real */}
      <div className="mt-4 p-4 bg-slate-700 text-white rounded-lg shadow-md w-fit">
        <h3 className="text-lg font-semibold">Fecha y Hora Actual:</h3>
        <p className="text-xl">
          {dayjs(currentDate)
            .tz(timezone || "UTC")
            .format("MMMM DD - HH:mm")}
        </p>
      </div>
    </div>
  )
}

export default TimezoneSelector
