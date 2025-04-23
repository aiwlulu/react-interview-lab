"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

type Address = {
  city: string;
  street: string;
};

type User = {
  id: number;
  name: string;
  address: Address;
};

const fetchUser = async (): Promise<User> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await res.json();
  return data;
};

export default function DerivedStateOverusePage() {
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");

  const wrongCode = `
const [user, setUser] = useState(null);
const [address, setAddress] = useState("");

useEffect(() => {
  fetchUser().then(setUser);
}, []);

useEffect(() => {
  if (user) {
    setAddress(\`\${user.address.city}, \${user.address.street}\`);
  }
}, [user]);
  `;

  const correctCode = `
const [user, setUser] = useState(null);

useEffect(() => {
  fetchUser().then(setUser);
}, []);

const address = user
  ? \`\${user.address.city}, \${user.address.street}\`
  : "";
  `;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        2.5 - 這種情況用 useEffect 就對了⋯⋯吧？
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

      {/* 加上 key={mode}，讓子元件在 mode 切換時強制重新掛載 */}
      <Card>
        <CardContent key={mode} className="p-4 space-y-4">
          {mode === "wrong" ? <WrongUsage /> : <CorrectUsage />}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">程式碼片段：</p>
          <CodeBlock code={mode === "wrong" ? wrongCode : correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        如果某個 state（如 <code>address</code>）是從另一個 state
        推導而來，就不需要額外用 <code>useEffect</code> 管理它。
        這樣能避免多次不必要的渲染，提高效能與可維護性。
      </p>
    </div>
  );
}

// ❌ 錯誤範例：不必要的 useEffect + 多次 setState
function WrongUsage() {
  const [user, setUser] = useState<User | null>(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchUser().then((data) => {
      console.log("🧠 設定 user");
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      console.log("📦 設定 address（第三次渲染）");
      setAddress(`${user.address.city}, ${user.address.street}`);
    }
  }, [user]);

  return (
    <div className="text-sm space-y-2">
      <p>使用者名稱：{user?.name ?? "讀取中..."}</p>
      <p>地址：{address || "尚未載入"}</p>
    </div>
  );
}

// ✅ 正確範例：address 為 derived state
function CorrectUsage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser().then((data) => {
      console.log("🧠 設定 user + 推導 address");
      setUser(data);
    });
  }, []);

  const address = user ? `${user.address.city}, ${user.address.street}` : "";

  return (
    <div className="text-sm space-y-2">
      <p>使用者名稱：{user?.name ?? "讀取中..."}</p>
      <p>地址：{address || "尚未載入"}</p>
    </div>
  );
}
