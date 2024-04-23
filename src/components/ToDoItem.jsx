export default function ToDoItem({ task, deleteTask, toggleCompleted }) {
  function handleChange() {
    toggleCompleted(task.id)
  }

  return (
    <>
      <div className="flex justify-between items-center bg-white rounded-md p-2 m-2 text-black transition-all hover:bg-blue-400">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleChange}
        />
        <div className="text">{task.text}</div>
        <div className="hour">10:10</div>
        <button
          className=""
          onClick={() => deleteTask(task.id)}>
          X
        </button>
      </div>
    </>
  )
}
