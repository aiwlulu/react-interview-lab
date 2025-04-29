"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import React from "react";

// 建立 Context
const CounterContext = createContext<{
  count: number;
  increment: () => void;
} | null>(null);

function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);

  return (
    <CounterContext.Provider value={{ count, increment }}>
      {children}
    </CounterContext.Provider>
  );
}

// ❌ 錯誤示範：所有子元件都被 context 更新影響
function WrongParent() {
  return (
    <CounterProvider>
      <Display />
      <Unrelated />
    </CounterProvider>
  );
}

// ✅ 正確示範：只讓需要的元件在 Provider 中
function CorrectParent() {
  return (
    <div className="space-y-4">
      <CounterProvider>
        <Display />
      </CounterProvider>
      <MemoUnrelated />
    </div>
  );
}

// 使用 context 的元件
function Display() {
  const counter = useContext(CounterContext);
  if (!counter) return null;

  console.log("[Display] render");

  return (
    <div className="text-sm">
      <p className="font-semibold">目前計數：{counter.count}</p>
      <Button size="sm" onClick={counter.increment}>
        +1
      </Button>
    </div>
  );
}

// 不需要 context，但故意呼叫 useContext 模擬影響
function Unrelated() {
  useContext(CounterContext); // 加這行：讓它跟 context 綁定，產生 re-render
  console.log("[Unrelated] render");

  return <p className="text-sm">我跟計數器無關！</p>;
}

// 用 React.memo 包起來避免重渲染
const MemoUnrelated = React.memo(Unrelated);

export default function ContextRerenderPage() {
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");

  const wrongCode = `function WrongParent() {
  return (
    <CounterProvider>
      <Display />
      <Unrelated />
    </CounterProvider>
  );
}`;

  const correctCode = `function CorrectParent() {
  return (
    <div>
      <CounterProvider>
        <Display />
      </CounterProvider>
      <MemoUnrelated />
    </div>
  );
}`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        3.4 - 不過是個渲染行為，怎麼連 useContext 也在搞啊！
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
        <CardContent className="p-4">
          {mode === "wrong" ? <WrongParent /> : <CorrectParent />}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">
            錯誤寫法：Provider 包太多，導致不必要重渲染
          </p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">
            正確寫法：只包需要的元件，其他用 React.memo
          </p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        使用 <code>useContext</code> 雖然方便，但一旦 <code>Provider</code>{" "}
        中的值更新， 所有使用該 context 的子元件都會重新渲染。為了最佳效能，
        應精準劃分 Provider 包覆範圍，並用 <code>React.memo</code>{" "}
        保護不需要更新的元件。
      </p>
    </div>
  );
}
