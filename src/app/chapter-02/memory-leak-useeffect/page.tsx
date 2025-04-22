"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

// ❌ 錯誤範例：未清除 setInterval，會導致多個 timer 疊加
function WrongTimer() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log("❌ Wrong timer:", new Date());
    }, 1000);

    // 💡 故意不清除 timer，但為了避免 ESLint 警告，"使用" 它一次
    console.log("❌ Timer created but not cleared:", timer);
  }, []);

  return null;
}

// ✅ 正確範例：使用 cleanup 清除定時器
function CorrectTimer() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log("✅ Correct timer:", new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      console.log("🧹 Timer cleared");
    };
  }, []);

  return null;
}

export default function MemoryLeakUseEffect() {
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");

  const wrongCode = `useEffect(() => {
  const timer = setInterval(() => {
    console.log("Wrong timer:", new Date());
  }, 1000);

  // ❌ 沒有清除 timer
}, []);`;

  const correctCode = `useEffect(() => {
  const timer = setInterval(() => {
    console.log("Correct timer:", new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        2.1 - 怪了，我的頁面怎麼越跑越慢啊？記憶體洩漏是什麼鬼？
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

      {/* 🧪 根據模式切換 timer 元件 */}
      {mode === "wrong" ? <WrongTimer /> : <CorrectTimer />}

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">計時器會每秒輸出 console.log</p>
          <p className="text-sm text-muted-foreground">
            切換模式時觀察 console.log 是否有「異常累加」現象。
          </p>
          <p className="text-sm text-muted-foreground">
            錯誤寫法中未清除 timer，會造成多重 timer
            疊加，導致記憶體洩漏與效能問題。
            <br />
            正確寫法中有清除函式，可避免這些問題。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">錯誤寫法：未清除定時器</p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">正確寫法：使用 cleanup 清除</p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        在使用 <code>setInterval</code> 或 <code>setTimeout</code>{" "}
        等非同步操作時，請務必在 <code>useEffect</code> 中 return
        對應的清除函式，以避免記憶體洩漏與非預期的執行行為。
      </p>
    </div>
  );
}
