"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "@/components/CodeBlock";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
};

export default function BasicFetchIssue() {
  const [userId, setUserId] = useState("");
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");

  const wrongCode = `useEffect(() => {
  fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)
    .then(res => res.json())
    .then(data => setUser(data));
}, []);`;

  const correctCode = `useEffect(() => {
  if (!userId) return;

  setLoading(true);
  fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)
    .then(res => res.json())
    .then(data => setUser(data))
    .finally(() => setLoading(false));
}, [userId]);`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        2.2 - 在 useEffect 中做簡單的資料請求也能出問題？
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
          <p className="font-semibold">輸入 User ID 後查看使用者資訊：</p>
          <Input
            placeholder="請輸入 1～10 的數字"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-64"
          />

          {mode === "wrong" ? (
            <WrongFetch userId={userId} />
          ) : (
            <CorrectFetch userId={userId} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">錯誤寫法：依賴設錯、請求時機錯誤</p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">正確寫法：加條件、處理 loading 狀態</p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        若 <code>userId</code> 尚未準備好就執行請求，會導致 URL 錯誤或顯示
        undefined。 建議先檢查 <code>userId</code> 是否存在，再發送請求並處理
        loading 狀態。
      </p>
    </div>
  );
}

// ❌ 錯誤寫法：useEffect 執行時機錯誤
function WrongFetch({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  // 這裡的依賴陣列沒有加 userId，導致 useEffect 只在第一次渲染時執行
  // eslint warning: react-hooks/exhaustive-deps
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []); // ❌ userId 沒加進依賴陣列

  return (
    <div className="text-sm pt-2">
      <p className="font-semibold">使用者名稱：</p>
      <p>{user?.name ?? "undefined"}</p>
    </div>
  );
}

// ✅ 正確寫法：依賴設對、有條件與 loading 處理
function CorrectFetch({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="text-sm pt-2">
      {loading ? (
        <p>讀取中...</p>
      ) : user ? (
        <>
          <p className="font-semibold">使用者名稱：</p>
          <p>{user.name}</p>
        </>
      ) : (
        <p>尚未載入使用者</p>
      )}
    </div>
  );
}
