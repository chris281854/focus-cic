export default function ToDoItem({ event }) {
  function handleChange() {
    toggleCompleted(task.id)
  }

  return (
    <>
      <div class="max-w-sm w-full bg-black rounded-lg shadow-lg p-6 m-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">{event.name}</h2>
          <button class="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p class="text-gray-400 mt-2">{event.description}</p>
        <div class="flex items-center justify-between mt-4">
          <span class="text-sm text-gray-500">Para: {event.date}</span>
          <button class="text-black bg-accent hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-full px-4 py-1 text-sm font-medium">
            Completar
          </button>
        </div>
      </div>
    </>
  )
}
