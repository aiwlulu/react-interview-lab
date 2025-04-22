"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";

export default function StrictModeDoubleCall() {
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    console.log("🚨 useEffect callback triggered");
    setLogCount((prev) => prev + 1);

    return () => {
      console.log("🧹 cleanup function called");
    };
  }, []);

  const effectCode = `useEffect(() => {
  console.log("Effect triggered");

  return () => {
    console.log("Cleanup called");
  };
}, []);`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        2.3 - 空的依賴陣列居然讓 Callback 觸發了兩次？
      </h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">目前已執行 useEffect 的次數：</p>
          <p className="text-2xl">{logCount}</p>

          <p className="text-sm text-muted-foreground">
            你現在處於{" "}
            <code>
              {process.env.NODE_ENV === "development" ? "開發環境" : "正式環境"}
            </code>
          </p>

          <p className="text-sm text-muted-foreground">
            在 <code>開發環境</code> 中，React 的 <code>StrictMode</code>{" "}
            會刻意執行：
            <strong>呼叫 → 清除 → 再呼叫</strong>
            ，來檢測副作用是否安全，因此可能看到 <code>logCount = 2</code>。
            <br />在 <code>正式環境</code> 中則只會執行一次，這是預期行為。
          </p>

          <p className="text-sm text-muted-foreground">
            這是 React 為了提升副作用安全性所設計的
            <strong>開發階段機制</strong>，並不是 bug。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="font-semibold mb-2">範例程式碼：</p>
          <CodeBlock code={effectCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="font-semibold">應對方式：</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>
              認清這是 <code>StrictMode</code> 的預期行為，不是 bug。
            </li>
            <li>強化副作用邏輯的可預期性，避免副作用造成資料異常。</li>
            <li>
              在 <code>cleanup</code> 中正確釋放資源（例如 clearInterval、abort
              fetch）。
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
