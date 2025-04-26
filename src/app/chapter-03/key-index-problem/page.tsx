"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

type Fruit = {
  id: number;
  name: string;
  color: string;
};

const initialFruits: Fruit[] = [
  { id: 1, name: "Apple", color: "Red" },
  { id: 2, name: "Banana", color: "Yellow" },
  { id: 3, name: "Cherry", color: "Red" },
];

export default function KeyIndexProblem() {
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");

  const wrongCode = `// ❌ 錯誤示範：使用索引作為 key
{fruits.map((fruit, index) => (
  <div key={index}>
    <button onClick={() => toggleExpand(index)}>
      {index}: {fruit.name}
    </button>
    {expandedIndex === index && <p>{fruit.color}</p>}
  </div>
))}`;

  const correctCode = `// ✅ 正確做法：使用穩定且唯一的 id 作為 key
{fruits.map((fruit) => (
  <div key={fruit.id}>
    <button onClick={() => toggleExpand(fruit.id)}>
      {fruit.name}
    </button>
    {expandedId === fruit.id && <p>{fruit.color}</p>}
  </div>
))}`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        3.1 - 使用索引作為 key 值簡單又方便，但這樣對嗎？
      </h1>

      <div className="flex gap-2">
        <Button
          variant={mode === "wrong" ? "default" : "outline"}
          onClick={() => setMode("wrong")}
        >
          查看錯誤示範
        </Button>
        <Button
          variant={mode === "correct" ? "default" : "outline"}
          onClick={() => setMode("correct")}
        >
          查看正確做法
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">
            水果清單（點擊展開顏色，索引一併顯示）：
          </p>
          {mode === "wrong" ? <WrongKeyUsage /> : <CorrectKeyUsage />}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">
            錯誤示範：使用索引作為 key，可能導致 UI 錯誤
          </p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">正確做法：使用穩定唯一的資料作為 key</p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        <strong>核心觀念：</strong>key 是元素的識別碼，影響 React 的
        Reconciliation 機制。 使用穩定且唯一的 key，可避免不必要的 DOM 操作與 UI
        錯置問題，提升效能與正確性。
      </p>
    </div>
  );
}

// ❌ 錯誤寫法：使用索引作為 key
function WrongKeyUsage() {
  const [fruits, setFruits] = useState(initialFruits);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const initialOrder = initialFruits.map((fruit) => fruit.name);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const removeBanana = () => {
    setFruits((prev) => prev.filter((fruit) => fruit.name !== "Banana"));
  };

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={removeBanana}>
        刪除 Banana
      </Button>
      <div className="space-y-2">
        {fruits.map((fruit, index) => {
          const expectedName = initialOrder[index];
          const isKeyChanged = fruit.name !== expectedName;

          return (
            <div key={index}>
              <button
                onClick={() => toggleExpand(index)}
                className={`underline ${isKeyChanged ? "text-red-500" : ""}`}
              >
                {index}: {fruit.name}（key: {index}
                {isKeyChanged && (
                  <span className="text-red-500"> ⚠ 與初始不同</span>
                )}
                ）
              </button>
              {expandedIndex === index && <p>{fruit.color}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ✅ 正確寫法：使用 id 作為 key
function CorrectKeyUsage() {
  const [fruits, setFruits] = useState(initialFruits);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const removeBanana = () => {
    setFruits((prev) => prev.filter((fruit) => fruit.name !== "Banana"));
  };

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={removeBanana}>
        刪除 Banana
      </Button>
      <div className="space-y-2">
        {fruits.map((fruit, index) => (
          <div key={fruit.id}>
            <button
              onClick={() => toggleExpand(fruit.id)}
              className="underline"
            >
              {index}: {fruit.name}（key: {fruit.id}）
            </button>
            {expandedId === fruit.id && <p>{fruit.color}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
