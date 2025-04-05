"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MassiveStateOrganization() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const badCode = `const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [age, setAge] = useState("")`;

  const goodCode = `const [userInfo, setUserInfo] = useState({
  name: "", email: "", age: ""
})

const handleChange = (e) => {
  const { name, value } = e.target
  setUserInfo({
    ...userInfo,
    [name]: value
  })
}`;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        1.4 - 元件內 state 有夠多，如何優雅地管理龐大的元件狀態？
      </h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">表單輸入（優化後）：</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">年齡</Label>
              <Input
                id="age"
                name="age"
                value={userInfo.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground pt-2">
            表單狀態：{JSON.stringify(userInfo)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">未優化的寫法：</p>
          <CodeBlock code={badCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">優化寫法：集中管理 + 動態更新欄位</p>
          <CodeBlock code={goodCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        當表單欄位一多，每個欄位都用 <code>useState</code>{" "}
        不僅冗長，也很難維護。 用物件統一管理，搭配 computed property name
        可以大幅簡化邏輯。
      </p>
    </div>
  );
}
