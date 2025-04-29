"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import React from "react";

export default function ReactMemoTrap() {
  const [mode, setMode] = useState<"fail" | "success">("fail");
  const [count, setCount] = useState(0);

  const failCode = `const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('clicked');
  };

  return <Child onClick={handleClick} />;
};

const Child = React.memo(({ onClick }) => {
  console.log('Child render');
  return <button onClick={onClick}>Click me</button>;
});`;

  const successCode = `const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <Child onClick={handleClick} />;
};

const Child = React.memo(({ onClick }) => {
  console.log('Child render');
  return <button onClick={onClick}>Click me</button>;
});`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        3.3 - React.memo 這麼好用，我還不用爆！
      </h1>

      <div className="flex gap-2">
        <Button
          variant={mode === "fail" ? "default" : "outline"}
          onClick={() => setMode("fail")}
        >
          查看 memo 失效
        </Button>
        <Button
          variant={mode === "success" ? "default" : "outline"}
          onClick={() => setMode("success")}
        >
          查看 memo 成功
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-x-2">
            <Button onClick={() => setCount((prev) => prev + 1)}>+1</Button>
            <span>目前計數：{count}</span>
          </div>

          {mode === "fail" ? <FailParent /> : <SuccessParent />}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">memo 失效：傳入新的函式 reference</p>
          <CodeBlock code={failCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">
            memo 成功：使用 useCallback 維持 reference 穩定
          </p>
          <CodeBlock code={successCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        雖然有使用 <code>React.memo</code>，但如果傳進去的 <code>props</code>
        每次 render 都是新的 reference（例如 inline 函式、物件、陣列），
        還是會讓子元件重新渲染，導致 <code>memo</code> 失效。 解決方法是使用{" "}
        <code>useCallback</code> 或 <code>useMemo</code>
        維持 <code>props</code> 的穩定性，讓 <code>React.memo</code>{" "}
        真正發揮作用。
      </p>
    </div>
  );
}

// ❌ memo 失效：每次 render 都重新定義 handleClick
function FailParent() {
  const handleClick = () => {
    console.log("clicked");
  };

  return <Child onClick={handleClick} />;
}

// ✅ memo 成功：使用 useCallback 固定 handleClick
function SuccessParent() {
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return <Child onClick={handleClick} />;
}

// 子元件：用 React.memo 包起來
const getObjectId = (() => {
  let idCounter = 1;
  const map = new WeakMap<object, number>();

  return (obj: object) => {
    if (!map.has(obj)) {
      map.set(obj, idCounter++);
    }
    return map.get(obj);
  };
})();

const Child = React.memo(function Child({ onClick }: { onClick: () => void }) {
  const objectId = getObjectId(onClick);

  console.log("===== Child render =====");
  console.log("onClick object id:", objectId);
  console.log("=========================");

  return (
    <button onClick={onClick} className="mt-4 p-2 border rounded">
      按我！
    </button>
  );
});
