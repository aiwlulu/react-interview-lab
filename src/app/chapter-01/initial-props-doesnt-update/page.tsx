"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "@/components/CodeBlock";

export default function InitialPropsDoesntUpdate() {
  const [mode, setMode] = useState<"guest" | "admin">("guest");

  const toggleMode = () => {
    setMode((prev) => (prev === "guest" ? "admin" : "guest"));
  };

  const defaultName = mode === "guest" ? "訪客" : "管理員";

  const wrongCode = `const [name, setName] = useState(props.defaultName)
// ❌ props 改變時 name 不會自動更新`;

  const correctCodeEffect = `const [name, setName] = useState(props.defaultName)

useEffect(() => {
  setName(props.defaultName)
}, [props.defaultName])`;

  const correctCodeKey = `<Input key={defaultName} defaultValue={defaultName} />`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        1.7 - 這個 useState 初始值重新渲染後，怎麼不會更新啊？
      </h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={toggleMode}>切換模式</Button>
            <span className="text-sm text-muted-foreground">
              當前模式：{mode === "guest" ? "訪客模式" : "管理員模式"}
            </span>
          </div>

          <NameInputWrong defaultName={defaultName} />
          <NameInputWithEffect defaultName={defaultName} />
          <NameInputWithKey defaultName={defaultName} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold text-destructive">錯誤寫法：</p>
          <CodeBlock code={wrongCode} />
          <p className="text-sm text-destructive">
            預設值只會在元件初次 render 被使用一次，後續 props 改變不會影響
            state。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold text-green-700">
            解法一：使用 useEffect 監聽 props
          </p>
          <CodeBlock code={correctCodeEffect} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold text-green-700">
            解法二：使用 key 強制重新掛載
          </p>
          <CodeBlock code={correctCodeKey} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        當你用 props 作為 <code>useState</code>{" "}
        初始值時，要注意這只會在元件「初次載入」時執行。 若之後 props
        改變但想同步更新 state，可以用 <code>useEffect</code>， 或是用{" "}
        <code>key</code> 讓整個元件重新掛載一次。
      </p>
    </div>
  );
}

// ❌ 錯誤寫法：useState 初始值綁 props，但後續不會更新
function NameInputWrong({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName);
  return (
    <div className="space-y-1">
      <p className="font-semibold text-destructive">
        錯誤：useState 初始值不會隨 props 更新
      </p>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}

// ✅ 解法一：用 useEffect 監聽 props
function NameInputWithEffect({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  return (
    <div className="space-y-1">
      <p className="font-semibold text-green-700">
        解法一：useEffect 同步 props
      </p>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}

// ✅ 解法二：用 key 讓元件重新掛載
function NameInputWithKey({ defaultName }: { defaultName: string }) {
  return (
    <div className="space-y-1">
      <p className="font-semibold text-green-700">解法二：key 方式強制重建</p>
      <Input key={defaultName} defaultValue={defaultName} />
    </div>
  );
}
