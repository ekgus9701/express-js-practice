// TodoApp.js

import React, { useCallback, useState, useEffect } from "react";
import TodoList from "./TodoList";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const COLOR_MAP = [
  { color: "#ccd5ae" },
  { color: "#e9edc9" },
  { color: "#fefae0" },
  { color: "#faedcd" },
];

export default function TodoApp() {
  const [inputText, setInputText] = useState("");
  const [activeColor, setActiveColor] = useState(COLOR_MAP[0].color);
  const [todoList, setTodoList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("/api/todo")
      .then((response) => {
        setTodoList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const submitTodo = (item) => {
    axios.post("/api/todo", item).then(() => {
      axios
        .get("/api/todo")
        .then((response) => {
          setTodoList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data after deletion:", error);
        });
    });
  };

  const deleteTodo = useCallback(
    (todoId) => {
      axios
        .delete(`/api/todo/${todoId}`)
        .then(() => {
          return axios.get("/api/todo");
        })
        .then((response) => {
          setTodoList(response.data);
        })
        .catch((error) => {
          console.error("Error deleting todo item:", error);
        });
    },
    [setTodoList]
  );

  const updateTodo = useCallback(
    (todoId, newTitle) => {
      axios
        .put(`/api/todo/${todoId}`, { title: newTitle })
        .then(() => {
          return axios.get("/api/todo");
        })
        .then((response) => {
          setTodoList(response.data);
        })
        .catch((error) => {
          console.error("Error updating or fetching data:", error);
        });
    },
    [setTodoList]
  );

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="todo-app">
      <Container>
        <div>
          <h1>TO DO LIST</h1>
        </div>
        <div className="search" style={{ margin: "5px" }}>
          <input
            type="text"
            placeholder="Filter"
            value={search}
            onChange={onChange}
          />
        </div>
        <div>
          <input
            type="text"
            value={inputText}
            style={{ backgroundColor: activeColor }}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <button
            style={{ margin: "5px" }}
            onClick={() => {
              const item = {
                title: inputText,
                color: activeColor,
              };
              setTodoList((prev) => prev.concat(item));
              submitTodo(item);
              setInputText("");
            }}
          >
            Submit
          </button>
        </div>
        <div className="colors">
          {COLOR_MAP.map((elem) => (
            <div
              key={elem.color}
              onClick={() => {
                setActiveColor(elem.color);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: elem.color,
                border: "1px solid",
                borderRadius: 5,
                borderColor: "e9e9e9",
                margin: "1px",
              }}
            ></div>
          ))}
        </div>
        <div>
          <TodoList
            todoList={todoList}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            inputText={""}
            search={search}
          />
        </div>
      </Container>
    </div>
  );
}
