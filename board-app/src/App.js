import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [apiData, setApiData] = useState([]);

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

  return (
    <div>
      <h1>게시판</h1>
      <ul>
        {apiData.map((item) => (
          <li key={item._id}>
            <strong>Title:</strong> {item.title},<strong>Content:</strong>{" "}
            {item.content},<strong>Created At:</strong> {item.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
