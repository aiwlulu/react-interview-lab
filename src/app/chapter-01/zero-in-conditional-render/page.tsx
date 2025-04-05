"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

export default function ZeroInConditionalRender() {
  const [friends, setFriends] = useState<string[]>([]);
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");

  const addFriend = () => {
    setFriends([...friends, `Friend ${friends.length + 1}`]);
  };

  const clearFriends = () => {
    setFriends([]);
  };

  const wrongCode = `{friends.length && (
  <ul>
    {friends.map(friend => <li>{friend}</li>)}
  </ul>
)}`;

  const correctCode = `{friends.length > 0 && (
  <ul>
    {friends.map(friend => <li>{friend}</li>)}
  </ul>
)}`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">1.5 - 條件渲染怎麼多了個 0 啊？</h1>

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
          <p className="font-semibold">朋友清單：</p>

          <div className="flex gap-2">
            <Button onClick={addFriend}>新增朋友</Button>
            <Button variant="outline" onClick={clearFriends}>
              清空
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            friends.length: {friends.length}
          </p>

          <div className="pt-2">
            {mode === "wrong" ? (
              <>
                <p className="font-semibold text-destructive">錯誤範例：</p>
                {friends.length && (
                  <ul className="list-disc list-inside pl-4">
                    {friends.map((friend, index) => (
                      <li key={index}>{friend}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <p className="font-semibold text-emerald-600">正確範例：</p>
                {friends.length > 0 && (
                  <ul className="list-disc list-inside pl-4">
                    {friends.map((friend, index) => (
                      <li key={index}>{friend}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">錯誤寫法：條件為數字</p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">正確寫法：顯式比較數值</p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        在 JSX 中，<code>0</code> 雖然是 falsy，但它仍會被渲染為文字。
        所以別直接用 <code>{`{someNumber && (...)}`}</code> 當條件，建議使用{" "}
        <code>{`someNumber > 0`}</code> 或 <code>!!someNumber</code>。
      </p>
    </div>
  );
}
