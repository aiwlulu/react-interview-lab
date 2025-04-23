"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

type Comment = {
  id: number;
  name: string;
  body: string;
};

export default function ScrollFlickerFixPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mode, setMode] = useState<"wrong" | "correct">("wrong");

  useEffect(() => {
    const loadComments = () => {
      const fakeData: Comment[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `使用者 ${i + 1}`,
        body: `這是一段測試留言內容，用來測試滾動效果 ${i + 1}`,
      }));

      setComments([]); // 清空舊資料讓畫面 reset
      setTimeout(() => {
        setComments(fakeData);
      }, 1000);
    };

    loadComments();
  }, [mode]); // 每次切換 mode 都會重新載入

  const wrongCode = `useEffect(() => {
  containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
}, [comments]);`;

  const correctCode = `useLayoutEffect(() => {
  containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
}, [comments]);`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        2.6 - 用 useEffect 處理事件，卻讓畫面抖了一下？
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
        <CardContent className="p-4">
          {mode === "wrong" ? (
            <WrongScroll comments={comments} />
          ) : (
            <CorrectScroll comments={comments} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">錯誤寫法：畫面先顯示再滾動，造成閃爍</p>
          <CodeBlock code={wrongCode} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">
            正確寫法：先滾動再顯示，畫面平滑無閃爍
          </p>
          <CodeBlock code={correctCode} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        若要避免「畫面先顯示 → 再滾動」所造成的閃爍問題，應使用{" "}
        <code>useLayoutEffect</code> 來確保畫面尚未繪製時就完成 DOM 操作。
      </p>
    </div>
  );
}

// ❌ 錯誤寫法：滾動發生在畫面繪製後，產生明顯跳動
function WrongScroll({ comments }: { comments: Comment[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [comments]);

  return (
    <div
      ref={containerRef}
      className="h-96 overflow-y-auto border rounded p-4 bg-white"
    >
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4">
          <h4 className="font-semibold">{comment.name}</h4>
          <p>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}

// ✅ 正確寫法：畫面尚未繪製時先滾動，避免閃爍
function CorrectScroll({ comments }: { comments: Comment[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [comments]);

  return (
    <div
      ref={containerRef}
      className="h-96 overflow-y-auto border rounded p-4 bg-white"
    >
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4">
          <h4 className="font-semibold">{comment.name}</h4>
          <p>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}
