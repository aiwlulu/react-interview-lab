"use client";

import { useState, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

// ❌ 錯誤示範：每次重新渲染都會觸發，不管 props 是否改變
function ExpensiveComponentWrong({ count }: { count: number }) {
  console.log("🔴 ExpensiveComponentWrong 被重新渲染！");
  return (
    <div className="p-4 border rounded">
      <p>我是高成本元件（未優化）</p>
      <p>Child Count：{count}</p>
    </div>
  );
}

// ✅ 正確示範：使用 React.memo 避免不必要的重新渲染
const ExpensiveComponentCorrect = memo(function ExpensiveComponentCorrect({
  count,
}: {
  count: number;
}) {
  console.log("🟢 ExpensiveComponentCorrect 被重新渲染！");
  return (
    <div className="p-4 border rounded">
      <p>我是高成本元件（已使用 React.memo）</p>
      <p>Child Count：{count}</p>
    </div>
  );
});

export default function RerenderCostPage() {
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");
  const [parentCount, setParentCount] = useState(0);
  const [wrongChildCount, setWrongChildCount] = useState(0);
  const [correctChildCount, setCorrectChildCount] = useState(0);

  const wrongCode = `// ❌ 錯誤示範：未使用 React.memo
function ExpensiveComponentWrong({ count }: { count: number }) {
  return <div>{count}</div>;
}`;

  const correctCode = `// ✅ 正確做法：使用 React.memo
const ExpensiveComponentCorrect = memo(function ExpensiveComponentCorrect({ count }: { count: number }) {
  return <div>{count}</div>;
});`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        3.2 - 重新渲染的昂貴代價該怎麼處理？
      </h1>

      <div className="flex gap-2">
        <Button
          variant={mode === "wrong" ? "default" : "outline"}
          onClick={() => setMode("wrong")}
        >
          查看錯誤示範
        </Button>
        <Button
          variant={mode === "correct" ? "default" : "outline"}
          onClick={() => setMode("correct")}
        >
          查看正確做法
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-semibold">渲染測試（點擊按鈕觀察 console.log）</p>

          <div className="flex gap-4">
            <Button onClick={() => setParentCount((c) => c + 1)}>
              增加 Parent Count（{parentCount}）
            </Button>

            {mode === "wrong" ? (
              <Button onClick={() => setWrongChildCount((c) => c + 1)}>
                增加 Child Count（{wrongChildCount}）
              </Button>
            ) : (
              <Button onClick={() => setCorrectChildCount((c) => c + 1)}>
                增加 Child Count（{correctChildCount}）
              </Button>
            )}
          </div>

          <div className="mt-4">
            {mode === "wrong" ? (
              <ExpensiveComponentWrong count={wrongChildCount} />
            ) : (
              <ExpensiveComponentCorrect count={correctChildCount} />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">
            錯誤示範：未使用 React.memo，導致每次重新渲染
          </p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">
            正確做法：使用 React.memo，避免 props 未變時重渲染
          </p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        <strong>核心觀念：</strong>
        不必要的重新渲染會導致效能下降，特別是大型或複雜元件時。使用 React.memo
        包裝高成本元件，根據 props
        是否變動進行淺層比較，有助於避免不必要的執行並提升效能。
      </p>
    </div>
  );
}
