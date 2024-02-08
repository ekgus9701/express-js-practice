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
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [button, setButton] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleSignup = async () => {
    try {
      const response = await axios
        .post("/api/todo/signup", {
          email: id,
          password: pw,
        })
        .then((data) => {
          if (data.status === 201) {
            console.log(data);

            alert("회원가입 성공");
          }
        })
        .catch((err) => {
          console.log("err:", err);
        });
    } catch (error) {
      console.error("로그인 중 에러 발생:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios
        .post("/api/todo/logout")
        .then((data) => {
          console.log(data);
          setIsLoggedIn(false);

          alert("로그아웃 성공");
        })
        .catch((err) => {
          alert("로그아웃 실패");
          console.log("err:", err);
        });
    } catch (error) {
      console.error("로그아웃 중 에러 발생:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios
        .post("/api/todo/login", {
          email: id,
          password: pw,
        })
        .then((data) => {
          if (data.status === 201) {
            console.log(data);
            setIsLoggedIn(true);
            alert("로그인 성공");
          }
        })
        .catch((err) => {
          alert("로그인 실패");
          console.log("err:", err);
        });
    } catch (error) {
      console.error("로그인 중 에러 발생:", error);
    }
  };

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

  const changeButton = () => {
    id.includes("@") && pw.length >= 1 ? setButton(false) : setButton(true);
  };

  return (
    <div>
      {isLoggedIn ? ( // 로그인 상태에 따라 ToDoWrite 섹션을 조건부 렌더링
        <div className="ToDoWrite">
          <button
            style={{ margin: "5px" }}
            type="button"
            className="logoutButton"
            disabled={button}
            onClick={handleLogout}
          >
            로그아웃
          </button>
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
        </div>
      ) : (
        <div>
          <input
            style={{ margin: "5px" }}
            placeholder="이메일"
            id="id"
            className="login"
            onChange={(e) => {
              setId(e.target.value);
            }}
            onKeyUp={changeButton}
          />
          <input
            style={{ margin: "5px" }}
            type="password"
            placeholder="비밀번호"
            id="password"
            className="login"
            onChange={(e) => {
              setPw(e.target.value);
            }}
            onKeyUp={changeButton}
          />
          <div>
            <button
              style={{ margin: "5px" }}
              type="button"
              className="signupButton"
              disabled={button}
              onClick={handleSignup}
            >
              회원가입
            </button>
            <button
              style={{ margin: "5px" }}
              type="button"
              className="loginButton"
              disabled={button}
              onClick={handleLogin}
            >
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
