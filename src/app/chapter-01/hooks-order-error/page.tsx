"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

export default function HooksOrderError() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => setIsLoggedIn((prev) => !prev);

  const wrongCode = `// ❌ 錯誤示範：這樣會造成 hooks 順序不一致
if (isLoggedIn) {
  useEffect(() => {
    console.log("Fetch user data...");
  }, []);
}`;

  const correctCode = `// ✅ 正確寫法：hooks 一律寫在頂層
useEffect(() => {
  if (isLoggedIn) {
    console.log("Fetch user data...");
  }
}, [isLoggedIn]);`;

  useEffect(() => {
    if (isLoggedIn) {
      console.log("✅ 正確示範：抓取使用者資料");
    }
  }, [isLoggedIn]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        1.6 - Rendered more hooks than during the previous
        render，這又是什麼鬼東西啊？
      </h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={toggleLogin}>
              {isLoggedIn ? "登出" : "登入"}
            </Button>
            <span className="text-sm text-muted-foreground">
              當前狀態：{isLoggedIn ? "已登入 ✅" : "未登入 ❌"}
            </span>
          </div>

          <div className="pt-4 space-y-2">
            <p className="font-semibold text-emerald-600">
              目前範例為正確寫法：
            </p>
            <p className="text-sm text-muted-foreground">
              useEffect 一律寫在頂層，條件放在內部判斷。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold text-destructive">
            錯誤寫法：條件式內呼叫 Hook
          </p>
          <CodeBlock code={wrongCode} />
          <p className="text-sm text-destructive">
            錯誤重點：若 isLoggedIn 為 false，這段 useEffect 根本不會被呼叫，
            React 會報「Hook 數量不一致」錯誤。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold text-green-700">
            正確寫法：條件放在 Hook 裡
          </p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        React 規定 Hooks 的執行順序必須在每次 render 中完全一致。 絕對不能把{" "}
        <code>useEffect</code>、<code>useState</code> 放進條件式中。
        想根據狀態判斷是否執行邏輯，就把條件放進 Hook 裡就對了 ✅
      </p>
    </div>
  );
}
