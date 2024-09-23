export default function ThemeSelector() {
  return (
    <section className="mb-8 shadow rounded-lg p-6">
      <h1 className="text-5xl font-semibold mb-4">Personalización</h1>
      <h2 className="text-2xl font-semibold mb-2">Tema</h2>
      <div className="flex space-x-4">
        <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer"></div>
        <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"></div>
        <div className="w-8 h-8 bg-red-500 rounded-full cursor-pointer"></div>
        <div className="w-8 h-8 bg-yellow-500 rounded-full cursor-pointer"></div>
      </div>
    </section>
  )
}
