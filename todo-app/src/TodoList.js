import React from "react";
import TodoItem from "./TodoItem";

const extractInitialConsonants = (text) => {
  return text
    .split("")
    .map((char) => {
      const unicode = char.charCodeAt(0);
      if (unicode >= 44032 && unicode <= 55203) {
        const initialConsonantIndex = (unicode - 44032) / 28 / 21;
        const initialConsonant = String.fromCharCode(
          0x1100 + initialConsonantIndex
        );
        return initialConsonant;
      } else {
        return char;
      }
    })
    .join("");
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
