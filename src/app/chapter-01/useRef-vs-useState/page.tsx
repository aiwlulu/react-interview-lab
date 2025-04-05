"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "@/components/CodeBlock";

// 🔧 子元件：展示 useRef 的不 re-render 特性
function RefInput() {
  const refValue = useRef("");
  const refCount = useRef(0);
  const countTextRef = useRef<HTMLParagraphElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    refValue.current = e.target.value;
    refCount.current += 1;

    // 透過 DOM 更新畫面，完全不 re-render
    if (countTextRef.current) {
      countTextRef.current.textContent = `輸入次數（不觸發父層 re-render）：${refCount.current}`;
    }
  };

  return (
    <div className="space-y-2 pt-4">
      <p className="font-semibold">使用 useRef：</p>
      <Input onChange={handleChange} defaultValue={refValue.current} />
      <p ref={countTextRef} className="text-sm text-muted-foreground">
        輸入次數（不觸發父層 re-render）：0
      </p>
    </div>
  );
}

export default function UseRefVsUseState() {
  console.log("🔄 UseRefVsUseState re-rendered");

  const [stateValue, setStateValue] = useState("");
  const [stateCount, setStateCount] = useState(0);

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value);
    setStateCount((prev) => prev + 1);
  };

  const stateCode = `const [value, setValue] = useState("")
<input value={value} onChange={(e) => setValue(e.target.value)} />`;

  const refCode = `const valueRef = useRef("")
<input onChange={(e) => valueRef.current = e.target.value} />`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        1.8 - 有時候也許 useState 並不夠好？
      </h1>

      <Card>
        <CardContent className="p-4 space-y-6">
          <div className="space-y-2">
            <p className="font-semibold">使用 useState：</p>
            <Input value={stateValue} onChange={handleStateChange} />
            <p className="text-sm text-muted-foreground">
              輸入次數（觸發 re-render）：{stateCount}
            </p>
          </div>

          {/* 改成子元件，不會影響父層 re-render */}
          <RefInput />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-4">
          <p className="font-semibold">useState 範例：</p>
          <CodeBlock code={stateCode} />
          <p className="text-sm text-muted-foreground">
            每次輸入都會重新渲染整個元件，會看到 console 出現 &quot;🔄
            UseRefVsUseState re-rendered&quot;
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-4">
          <p className="font-semibold">useRef 範例：</p>
          <CodeBlock code={refCode} />
          <p className="text-sm text-muted-foreground">
            雖然 ref 值會改變，但畫面不會重新渲染，console 中也不會有 re-render
            訊息。
          </p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        使用 <code>useRef</code> 可以儲存資料卻不觸發元件重繪，
        適合處理如輸入暫存、定時器 ID、快取、focus 管理等「不影響 UI」的資料。
      </p>
    </div>
  );
}
