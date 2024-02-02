import { useTodos, TodoItem } from "./hooks/useTodos";
import { Spinner } from "./components/Spinner";

function App() {
  const { todos, refresh, toggle, loading: todoUpdateLoading } = useTodos();

  console.log(todos);

  const handleCheckboxClick = async (todo: TodoItem) => {
    await toggle(todo.id);
    await refresh();
  };

  return (
    <div className="todo-list-container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <img
          src="/ampt.svg"
          alt="Ampt"
          style={{ alignSelf: "center", width: "100px" }}
        />
        <h1
          style={{
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          Ampt Todos
        </h1>
      </div>
      {todos.length === 0 ? (
        <div style={{ alignSelf: "center", textAlign: "center" }}>
          <h2>No Todo's yet</h2>
        </div>
      ) : (
        todos.map((todo, index) => {
          const complete = todo.status === "complete";
          const isUpdating =
            todoUpdateLoading && todoUpdateLoading[todo.id] === true;
          return (
            <div key={index} className="todo-item">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignSelf: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    // display: "flex",
                    alignSelf: "center",
                    marginRight: "20px",
                    width: "20px", // Set a width equal to the width of the checkbox
                    height: "20px", // Set a height equal to the height of the checkbox
                  }}
                >
                  {isUpdating ? (
                    <Spinner />
                  ) : (
                    <input
                      type="checkbox"
                      checked={complete}
                      onChange={() => handleCheckboxClick(todo)}
                      disabled={isUpdating}
                      className="todo-item-checkbox"
                    />
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3
                    className={`todo-item-name ${complete ? "complete" : ""}`}
                  >
                    {todo.name}
                  </h3>
                  <p className="todo-item-description">{todo.description}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
