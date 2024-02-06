import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TodoItem({ todo, remove, update }) {
  const [mode, setMode] = useState("normal");
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setInputText(todo.title);
  }, [todo]);

  return (
    <div
      style={{
        backgroundColor: todo.color,
        margin: "3px",

        borderRadius: "20px",
      }}
    >
      <div>
        {mode === "updates" ? (
          <input
            value={inputText}
            type="text"
            onChange={(e) => setInputText(e.target.value)}
          />
        ) : mode === "normal" ? (
          todo.title
        ) : null}
      </div>

      <button
        onClick={() => {
          remove();
        }}
        style={{ cursor: "pointer", margin: "5px", backgroundColor: "white" }}
      >
        Delete
      </button>

      <button
        style={{ cursor: "pointer", margin: "5px", backgroundColor: "white" }}
        onClick={() => {
          if (mode === "normal") {
            setMode("updates");
          } else {
            // Call the parent component's update function
            // with the new title
            update(inputText);
            setMode("normal");
          }
        }}
      >
        Modify
      </button>
    </div>
  );
}
