"use client";
import React, { useState, KeyboardEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoBasicImplementationPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  // 新增 Todo
  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
    setNewTodo("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  // 刪除 Todo
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 切換完成狀態
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 清除已完成項目
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <CardContent className="space-y-4">
        <h1 className="text-2xl font-bold">簡易 Todo List</h1>

        <div className="flex space-x-2">
          <input
            className="flex-1 p-2 border rounded"
            placeholder="輸入新待辦，按 Enter 或點擊 Add"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={addTodo}
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <Item
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
            />
          ))}
        </ul>

        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          onClick={clearCompleted}
        >
          清除已完成
        </button>
      </CardContent>
    </Card>
  );
}

interface ItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

function Item({ todo, onDelete, onToggle }: ItemProps) {
  return (
    <li className="flex items-center justify-between p-2 border rounded">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className={todo.completed ? "line-through text-gray-500" : ""}>
          {todo.text}
        </span>
      </label>
      <button
        className="px-2 py-1 text-red-500"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </button>
    </li>
  );
}
