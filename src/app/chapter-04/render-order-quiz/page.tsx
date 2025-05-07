"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";

export default function RenderOrderQuizPage() {
  const [count, setCount] = useState(0);

  // A：每次元件 function 執行時最先執行
  console.log("A");

  // B：只在初次渲染完成後執行一次
  useEffect(() => {
    console.log("B");
    return () => {
      // C：若有重複執行，或元件卸載前執行
      console.log("C");
    };
  }, []);

  // D：所有 hook 定義完畢、回傳 JSX 之前
  console.log("D");

  // E：每次渲染後都執行
  useEffect(() => {
    console.log("E");
  });

  // F：每次 count 變更後執行
  useEffect(() => {
    console.log("F");
  }, [count]);

  const increment = () => {
    setCount((c) => c + 1);
  };

  const quizCode = `const [count, setCount] = useState(0);

console.log("A");

useEffect(() => {
  console.log("B");
  return () => {
    console.log("C");
  };
}, []);

console.log("D");

useEffect(() => {
  console.log("E");
});

useEffect(() => {
  console.log("F");
}, [count]);`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        4.1 - 你說你懂 React 渲染邏輯，那試著回答這元件內部的程式碼執行順序
      </h1>

      <Card>
        <CardContent className="space-y-4">
          <p>打開瀏覽器 DevTools 的 Console，觀察以下互動：</p>
          <div className="p-4 border rounded space-y-2">
            <p>
              <strong>Count：</strong>
              {count}
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={increment}
            >
              Increment
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2">
          <CodeBlock code={quizCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500">
        初次渲染會輸出 <code>A → D → B → E → F</code>；按鈕點擊後會輸出{" "}
        <code>A → D → E → F</code>。
      </p>
    </div>
  );
}
