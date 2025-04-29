"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import React from "react";

// 子元件：用 React.memo 包裝
const ExpensiveComponent = React.memo(function ExpensiveComponent({
  onClick,
}: {
  onClick: () => void;
}) {
  console.log("[ExpensiveComponent] render");

  return (
    <Button size="sm" onClick={onClick}>
      +1
    </Button>
  );
});

export default function MemoFunctionPropsPage() {
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");
  const [count, setCount] = useState(0);

  const wrongCode = `const increment = () => setCount(count + 1);

<ExpensiveComponent onClick={increment} />;`;

  const correctCode = `const increment = useCallback(() => {
  setCount(prev => prev + 1);
}, []);

<ExpensiveComponent onClick={increment} />;`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        3.5 - React.memo 怎麼碰到函數當作 props 就不行啦！
      </h1>

      <div className="flex gap-2">
        <Button
          variant={mode === "wrong" ? "default" : "outline"}
          onClick={() => setMode("wrong")}
        >
          查看錯誤寫法
        </Button>
        <Button
          variant={mode === "correct" ? "default" : "outline"}
          onClick={() => setMode("correct")}
        >
          查看正確寫法
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">目前計數：{count}</p>

          {mode === "wrong" ? (
            <WrongUsage setCount={setCount} />
          ) : (
            <CorrectUsage setCount={setCount} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">錯誤寫法：每次 render 都產生新函數</p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">
            正確寫法：使用 useCallback 固定函數 reference
          </p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          函數是物件，每次 render 產生新 reference，會讓 <code>React.memo</code>{" "}
          失效。
        </p>
        <p>
          若 props 中有函數，務必使用 <code>useCallback</code> 包裝，確保
          reference 穩定。
        </p>
        <p className="font-semibold">
          結論：<code>React.memo</code> + <code>useCallback</code>{" "}
          才能有效避免子元件因函數 props 被重新渲染。
        </p>
        <p>優化 = 控制 reference 穩定性！</p>
      </div>
    </div>
  );
}

// ❌ 錯誤寫法：每次 render 都產生新函式
function WrongUsage({
  setCount,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const increment = () => setCount((prev) => prev + 1);

  return <ExpensiveComponent onClick={increment} />;
}

// ✅ 正確寫法：用 useCallback 固定函式
function CorrectUsage({
  setCount,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, [setCount]);

  return <ExpensiveComponent onClick={increment} />;
}
