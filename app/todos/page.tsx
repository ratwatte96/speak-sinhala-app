"use client";
import { useState } from "react";

const AddTodoPage = () => {
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");

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
