"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

export default function SetStateMultipleCall() {
  const [count, setCount] = useState(0);

  const handleWrongIncrement = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const handleCorrectIncrement = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  const wrongCode = `setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)`;

  const correctCode = `setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)`;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        1.2 - setState 連續呼叫這麼多次，怎麼只作用一次？
      </h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">目前計數：{count}</p>

          <div className="flex flex-col gap-4 max-w-fit">
            <div>
              <Button onClick={handleWrongIncrement} variant="outline">
                錯誤寫法：使用 count + 1
              </Button>
              <CodeBlock code={wrongCode} />
            </div>

            <div>
              <Button onClick={handleCorrectIncrement}>
                正確寫法：使用函數型更新
              </Button>
              <CodeBlock code={correctCode} />
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        React 的 state 是非同步且會被批次處理。在同一次 render 中，count
        是固定的值（closure 的特性）。 若多次使用{" "}
        <code>setCount(count + 1)</code>，其實每次都是以同一個舊值為基礎。
        建議使用 callback form：<code>setCount(prev =&gt; prev + 1)</code>
        ，才會正確依序累加。
      </p>
    </div>
  );
}
