import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ todoList, onDelete, onUpdate, search }) {
  const filteredTodoList = todoList.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  );

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
