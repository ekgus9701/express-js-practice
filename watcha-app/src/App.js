import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [apiData, setApiData] = useState([]);

  const callApi = async () => {
    try {
      const response = await axios.get("/api/watcha/");
      setApiData(response.data);
    } catch (error) {
      console.error("API 호출 중 에러:", error);
    }
  };

  const handleDelete = async (watchaId) => {
    try {
      const response = await axios.delete(`/api/watcha/${watchaId}`);
      console.log(response.data.message); // 삭제 완료 메시지 확인
      callApi(); // 삭제 후 다시 데이터 불러오기
    } catch (error) {
      console.error("삭제 중 에러:", error);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  return (
    <div
      className="watchaCards"
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {apiData.map((item) => (
        <Card key={item._id} style={{ width: "18rem", margin: "5.5px" }}>
          <Card.Img variant="top" src={item.poster.large} />
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
            <Card.Text>
              <strong>Year: </strong>
              {item.year || "-"}
              <br></br>
              <strong>Director: </strong>
              {item.director_names[0] || "-"}
              <br></br>
              <strong>Nation: </strong>
              {item.nations[0]?.name || "-"}
              <br></br>
              <strong>Genre: </strong>
              {item.genres.map((genre, index) => (
                <span key={index}>
                  {genre}
                  {index < item.genres.length - 1 ? ", " : ""}
                </span>
              )) || "-"}
              <br></br>
            </Card.Text>
            <Button variant="primary" onClick={() => handleDelete(item._id)}>
              삭제
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default App;
