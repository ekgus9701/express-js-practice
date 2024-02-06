import React from "react";
import TodoItem from "./TodoItem";

const extractInitialConsonants = (text) => {
  // 각 글자의 초성을 추출하는 함수
  return text
    .split("") // 텍스트를 문자 배열로 분할
    .map((char) => {
      const unicode = char.charCodeAt(0); // 문자의 유니코드 코드 포인트 획득
      if (unicode >= 44032 && unicode <= 55203) {
        // 문자가 한글 음절인지 확인
        const initialConsonantIndex = (unicode - 44032) / 28 / 21; // 초성 인덱스 계산
        const initialConsonant = String.fromCharCode(
          0x1100 + initialConsonantIndex
        ); // 인덱스를 해당하는 초성으로 변환
        return initialConsonant;
      } else {
        return char; // 한글 음절이 아닌 경우 문자 그대로 반환
      }
    })
    .join(""); // 배열을 문자열로 결합
};

export default function TodoList({ todoList, onDelete, onUpdate, search }) {
  const filteredTodoList = todoList.filter((todo) => {
    const initialConsonants = extractInitialConsonants(
      todo.title
    ).toLowerCase();
    return initialConsonants.includes(search.toLowerCase());
  });

  return (
    <div>
      <div>
        {filteredTodoList.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            remove={() => {
              onDelete(todo._id);
            }}
            update={(text) => {
              onUpdate(todo._id, text);
            }}
          />
        ))}
      </div>
    </div>
  );
}
