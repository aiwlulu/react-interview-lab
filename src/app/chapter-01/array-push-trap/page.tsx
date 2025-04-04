"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

export default function ArrayPushTrap() {
  const [names, setNames] = useState(["Anna"]);

  const wrongPush = () => {
    names.push("Leo");
    setNames(names);
  };

  const correctPush = () => {
    setNames([...names, "Leo"]);
  };

  const wrongCode = `names.push('Leo')
setNames(names)`;
  const correctCode = `setNames([...names, 'Leo'])`;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        1.1 - Array.push 用在更新 state，居然不起作用了？
      </h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">目前名單：</p>
          <ul className="list-disc list-inside">
            {names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 max-w-fit">
            <div>
              <Button onClick={wrongPush} variant="outline">
                錯誤寫法：push 後 setState
              </Button>
              <CodeBlock code={wrongCode} />
            </div>

            <div>
              <Button onClick={correctPush}>正確寫法：使用擴展語法</Button>
              <CodeBlock code={correctCode} />
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        注意：直接使用 <code>push</code> 修改原始陣列不會觸發 re-render，因為
        reference 沒有改變。
      </p>
    </div>
  );
}
