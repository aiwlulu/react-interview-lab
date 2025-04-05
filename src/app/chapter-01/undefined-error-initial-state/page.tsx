"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";

interface User {
  name: string;
  age: number;
}
export default function UndefinedErrorInitialState() {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    setTimeout(() => {
      setUser({ name: "Alice", age: 25 });
    }, 1500);
  }, []);

  const wrongCode = `const [user, setUser] = useState()
<div>{user.name}</div>`;

  const conditionalCode = `const [user, setUser] = useState()
{user && <div>{user.name}</div>}`;

  const optionalCode = `const [user, setUser] = useState()
<div>{user?.name}</div>`;

  const defaultValueCode = `const [user, setUser] = useState({ name: "", age: 0 })`;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        1.3 - 簡單的 useState 使用，卻出現了「Cannot set properties of
        undefined」的錯誤訊息？
      </h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">錯誤示範：</p>
          <p className="text-sm text-destructive">
            錯誤：畫面還沒抓到 user，就嘗試存取其屬性
          </p>

          <p className="font-semibold">正確寫法（目前資料）：</p>
          <div>
            {user ? (
              <p>
                使用者姓名：<span className="font-medium">{user.name}</span>
              </p>
            ) : (
              <p className="text-muted-foreground">載入中...</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">錯誤範例：</p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">正確寫法 1：條件渲染</p>
          <CodeBlock code={conditionalCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">正確寫法 2：Optional Chaining</p>
          <CodeBlock code={optionalCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">正確寫法 3：設定初始值</p>
          <CodeBlock code={defaultValueCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        當你使用 <code>useState(undefined)</code> 當作初始值時，請務必處理
        undefined 的狀況，否則會在畫面渲染時拋出錯誤。
      </p>
    </div>
  );
}
