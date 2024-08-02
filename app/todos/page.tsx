"use client";
import { useState } from "react";

const AddTodoPage = () => {
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [todos, setTodos] = useState([]);

  const getToDos = async () => {
    try {
      const response = await fetch("/api/todos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const todos = await response.json();
      setTodos(todos);
      setDone(false);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, done }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const newTodo = await response.json();
      setMessage(`Todo added: ${newTodo.description}`);
      setDescription("");
      setDone(false);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <div>
      <div>
        <h1>TODOS</h1>
        <button onClick={getToDos}>Get todos</button>
        <ul>
          {todos.map((todo: any) => (
            <>
              <li>{todo.description}</li>
            </>
          ))}
        </ul>
      </div>
      <h1>Add Todo</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="done">
            <input
              type="checkbox"
              id="done"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
            />
            Done
          </label>
        </div>
        <button type="submit">Add Todo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddTodoPage;
