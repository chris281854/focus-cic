import React, { useState, useEffect } from "react"
import Header from "../Header"
import Footer from "../Footer"
import { Link } from "react-router-dom"

export default function Welcome() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <Header />
      <main className="flex flex-col items-center pb-16">
        <section
          className="w-full h-[90vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('Wallpaper.jpg')",
          }}>
          <div className="bg-black bg-opacity-80 p-12 rounded-3xl">
            <h1 className="text-5xl font-bold text-white">
              Esto, es <span className="text-accent">Focus</span>
            </h1>
          </div>
        </section>

        <section className="container mx-auto mt-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold text-accent">
              The Focus Project
            </h2>
            <hr className="border-slate-400 dark:border-slate-600" />
            <p className="text-xl">
              Focus es tu aliado definitivo para dirigir todos los aspectos de
              tu vida hacia la estabilidad y el éxito. Nuestra plataforma te
              proporciona las herramientas esenciales para organizar tu estilo
              de vida, desarrollar hábitos sólidos y embarcarte en un viaje de
              superación personal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <article className="bg-slate-800 dark:bg-slate-800 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold text-accent mb-4">Enfoque:</h3>
              <p>
                En la vertiginosa era moderna, las distracciones interminables
                nos impiden concentrarnos en lo que realmente importa. The Focus
                Project te ayuda a dirigir tu atención hacia lo correcto: tu
                futuro, tus relaciones, tu salud física, mental y espiritual, tu
                bienestar general.
              </p>
            </article>
            <article className="bg-slate-800 dark:bg-slate-800 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold text-accent mb-4">Control:</h3>
              <p>
                Recupera el control de tu vida al rechazar la distracción del
                entretenimiento instantáneo. Construye tu fuerza de voluntad,
                elige tu propio camino y conviértete en la mejor versión de ti
                mismo.
              </p>
            </article>
          </div>

          <div className="bg-slate-200 dark:bg-slate-800 p-8 rounded-2xl mt-16 text-slate-900 dark:text-white">
            <h3 className="text-2xl font-bold text-accent mb-4">
              Características principales:
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-semibold">Agenda:</span> Herramientas de
                organización, planificación, seguimiento y desarrollo de
                hábitos.
              </li>
              <li>
                <span className="font-semibold">
                  Organiza tus tareas diarias:
                </span>{" "}
                Listas de tareas y recordatorios para mantener el control de tus
                responsabilidades.
              </li>
              <li>
                <span className="font-semibold">Planifica tu agenda:</span> Crea
                y organiza tu futuro con una planificación efectiva.
              </li>
              <li>
                <span className="font-semibold">
                  Enfócate en lo que importa:
                </span>{" "}
                Trabaja en las áreas realmente importantes de tu vida.
              </li>
              <li>
                <span className="font-semibold">
                  Recordatorios inteligentes:
                </span>{" "}
                Nuestra plataforma se encargará de planificar, organizar y
                recordarte todo de la manera más eficiente posible.
              </li>
            </ul>
          </div>
        </section>

        <section className="w-full mt-16 bg-slate-100 dark:bg-slate-800 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Descubre más sobre Focus
            </h2>
            <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                <div className="w-full flex-shrink-0 bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Organización eficiente"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Organización eficiente
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
                <div className="w-full flex-shrink-0 bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Desarrollo de hábitos"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Desarrollo de hábitos
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
                <div className="w-full flex-shrink-0 bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Mejora continua"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Mejora continua
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </div>
              </div>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r-md"
                aria-label="Slide anterior">
                &#10094;
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l-md"
                aria-label="Siguiente slide">
                &#10095;
              </button>
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-16 px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Empieza a tomar el <span className="text-accent">Control</span>
          </h2>
          <Link to="/register">
            <button className="bg-secondary hover:bg-primary text-white hover:text-accent text-2xl py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
              Registrarse
            </button>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
