import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

function App() {
  const [apiData, setApiData] = useState([]);
  const [commentData, setCommentData] = useState([]);

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const callApi = async () => {
    try {
      const response = await axios.get("/api/board/");
      setApiData(response.data);
    } catch (error) {
      console.error("API 호출 중 에러:", error);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  const callApi_comment = async () => {
    try {
      const response = await axios.get("/api/board/comments");
      setCommentData(response.data);
    } catch (error) {
      console.error("API 호출 중 에러:", error);
    }
  };

  useEffect(() => {
    callApi_comment();
  }, []);

  const handleSignup = async () => {
    try {
      const response = await axios
        .post("/api/board/signup", {
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
        .post("/api/board/logout")
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
        .post("/api/board/login", {
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

  return (
    <div>
      {isLoggedIn ? (
        <div className="ToDoWrite">
          <Button
            variant="primary"
            style={{ margin: "5px" }}
            className="logoutButton"
            onClick={handleLogout}
          >
            로그아웃
          </Button>

          {/* 로그인 상태일 때의 ToDoWrite 섹션 */}
        </div>
      ) : (
        <div>
          <Form style={{ display: "flex", flexDirection: "row" }}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
              style={{ margin: "5px" }}
            >
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                style={{ margin: "5px" }}
                id="id"
                className="login"
                onChange={(e) => {
                  setId(e.target.value);
                }}
                placeholder="name@example.com"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
              style={{ margin: "5px" }}
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                style={{ margin: "5px" }}
                id="password"
                className="login"
                onChange={(e) => {
                  setPw(e.target.value);
                }}
              />
            </Form.Group>
          </Form>

          <div>
            <Button
              variant="primary"
              style={{ margin: "0px 5px 5px 5px" }}
              className="signupButton"
              onClick={handleSignup}
            >
              회원가입
            </Button>
            <Button
              variant="primary"
              style={{ margin: "0px 5px 5px 5px" }}
              type="button"
              className="loginButton"
              onClick={handleLogin}
            >
              로그인
            </Button>
          </div>
        </div>
      )}

      <h1>게시판</h1>
      <ul>
        {apiData.map((item) => (
          <li key={item._id}>
            <strong>Title:</strong> {item.title},<strong>Content:</strong>{" "}
            {item.content},<strong>Created At:</strong> {item.createdAt},{" "}
            <strong>Author:</strong> {item.author}
            {/* {console.log(item)} */}
          </li>
        ))}
        --------------------------------------
        {commentData.map((item) => (
          <li key={item._id}>
            <strong>Board:</strong> {item.board},<strong>Content:</strong>{" "}
            {item.content},<strong>Created At:</strong> {item.createdAt},{" "}
            <strong>Author:</strong> {item.writer}
            {/* {console.log(item)} */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
