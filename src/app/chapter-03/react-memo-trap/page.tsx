"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import React from "react";

// 子元件：用 React.memo 包起來，並追蹤傳入函式的 reference id
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

// 🛠 宣告在元件外的函式（保持 reference 穩定）
const stableHandleClick = () => {
  console.log("clicked (stable)");
};

export default function ReactMemoTrap() {
  const [mode, setMode] = useState<"fail" | "external" | "memo">("fail");
  const [count, setCount] = useState(0);

  const failCode = `const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('clicked');
  };

  return <Child onClick={handleClick} />;
};`;

  const externalCode = `const stableHandleClick = () => {
  console.log('clicked');
};

const Parent = () => {
  return <Child onClick={stableHandleClick} />;
};`;

  const memoCode = `const Parent = () => {
  const handleClick = useMemo(() => {
    return () => {
      console.log('clicked');
    };
  }, []);

  return <Child onClick={handleClick} />;
};`;

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
          variant={mode === "external" ? "default" : "outline"}
          onClick={() => setMode("external")}
        >
          用外部宣告成功
        </Button>
        <Button
          variant={mode === "memo" ? "default" : "outline"}
          onClick={() => setMode("memo")}
        >
          用 useMemo 成功
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-x-2">
            <Button onClick={() => setCount((prev) => prev + 1)}>+1</Button>
            <span>目前計數：{count}</span>
          </div>

          {mode === "fail" && <FailParent />}
          {mode === "external" && <ExternalParent />}
          {mode === "memo" && <MemoParent />}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">失敗範例：每次 render 都產生新函式</p>
          <CodeBlock code={failCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">成功範例一：宣告函式在元件外部</p>
          <CodeBlock code={externalCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">成功範例二：使用 useMemo</p>
          <CodeBlock code={memoCode} />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          <code>React.memo</code> 只能避免因 props reference
          沒變而造成的重新渲染， 若 props（如函式）每次 render 都是新的
          reference，即使用 <code>React.memo</code> 也無法阻止重渲染。
        </p>
        <p>
          解法是將函式宣告在元件外部，或使用 <code>useMemo</code>{" "}
          產生穩定的函式物件，避免每次 render 都建立新函式。
        </p>
        <p className="font-semibold">小總結：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code>React.memo</code>：優化子元件的渲染次數，前提是 props
            reference 必須穩定。
          </li>
          <li>
            <code>useMemo</code>：用來建立記憶的物件或函式，避免每次 render
            都新建。
          </li>
          <li>
            使用時機差異：<code>React.memo</code> 是控制元件層級是否重渲染，
            <code>useMemo</code> 是控制資料或函式 reference 是否重建。
          </li>
        </ul>
      </div>
    </div>
  );
}

// ❌ memo 失效：每次 render 都重新定義 handleClick
function FailParent() {
  const handleClick = () => {
    console.log("clicked (fail)");
  };

  return <Child onClick={handleClick} />;
}

// ✅ 成功範例一：使用元件外部函式
function ExternalParent() {
  return <Child onClick={stableHandleClick} />;
}

// ✅ 成功範例二：使用 useMemo 產生穩定函式
function MemoParent() {
  const handleClick = useMemo(() => {
    return () => {
      console.log("clicked (memo)");
    };
  }, []);

  return <Child onClick={handleClick} />;
}
