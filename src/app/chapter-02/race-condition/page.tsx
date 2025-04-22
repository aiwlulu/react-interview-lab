"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";

type User = {
  id: number;
  name: string;
  email: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  // 依照 userId 模擬不同延遲
  const id = url.split("/").pop();
  const ms = id === "1" ? 1000 : 300;
  await delay(ms);

  return data;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function RaceConditionDemo() {
  const [userId, setUserId] = useState("1");
  const [mode, setMode] = useState<"wrong" | "flag" | "abort" | "swr">("wrong");

  const codeSamples: Record<typeof mode, string> = {
    wrong: `useEffect(() => {
  fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)
    .then(res => res.json())
    .then(data => delay(userId === '1' ? 1000 : 300))
    .then(() => setUser(data));
}, [userId]);`,
    flag: `useEffect(() => {
  let isCancelled = false;
  fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)
    .then(res => res.json())
    .then(data => delay(userId === '1' ? 1000 : 300))
    .then(data => {
      if (!isCancelled) setUser(data);
    });
  return () => {
    isCancelled = true;
  };
}, [userId]);`,
    abort: `useEffect(() => {
  const controller = new AbortController();
  fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`, {
    signal: controller.signal,
  })
    .then(res => res.json())
    .then(data => delay(userId === '1' ? 1000 : 300))
    .then(data => setUser(data))
    .catch(err => {
      if (err.name === 'AbortError') {
        console.log('✅ 請求已中止');
      }
    });
  return () => {
    controller.abort();
  };
}, [userId]);`,
    swr: `const fetcher = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    const id = url.split("/").pop();
    const ms = id === "1" ? 1000 : 300;
    await delay(ms);
    return data;
  };
  
  const { data, isLoading } = useSWR(
    userId ? \`https://jsonplaceholder.typicode.com/users/\${userId}\` : null,
    fetcher
  );`,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">2.4 - useEffect 中的競態條件 Demo</h1>

      <div className="space-y-4">
        <Button onClick={() => setUserId((prev) => (prev === "1" ? "2" : "1"))}>
          目前是 User {userId}，點擊切換
        </Button>

        <div className="flex gap-2">
          <Button
            variant={mode === "wrong" ? "default" : "outline"}
            onClick={() => setMode("wrong")}
          >
            錯誤寫法
          </Button>
          <Button
            variant={mode === "flag" ? "default" : "outline"}
            onClick={() => setMode("flag")}
          >
            正確：isCancelled
          </Button>
          <Button
            variant={mode === "abort" ? "default" : "outline"}
            onClick={() => setMode("abort")}
          >
            正確：AbortController
          </Button>
          <Button
            variant={mode === "swr" ? "default" : "outline"}
            onClick={() => setMode("swr")}
          >
            正確：SWR
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            {mode === "wrong" && <WrongFetch userId={userId} />}
            {mode === "flag" && <FlagFetch userId={userId} />}
            {mode === "abort" && <AbortFetch userId={userId} />}
            {mode === "swr" && <SWRFetch userId={userId} />}

            <GroundTruth userId={userId} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="font-semibold">程式碼片段：</p>
            <CodeBlock code={codeSamples[mode]} />
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          在錯誤寫法中，id = 1 的請求會延遲 1s，而 id = 2 的請求僅延遲
          0.3s，若先選擇 User 1 再快速切到 User 2，1
          的請求反而會在後完成並覆寫畫面，清楚展現競態條件問題。
        </p>
      </div>
    </div>
  );
}

// ❌ 錯誤：無任何保護機制，延遲依 userId 決定
function WrongFetch({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      const data: User = await res.json();
      // id=1 延遲 1s，id=2 延遲 0.3s
      await delay(userId === "1" ? 1000 : 300);
      setUser(data);
    };
    fetchData();
  }, [userId]);

  return <UserDisplay label="目前畫面顯示資料：" user={user} />;
}

// ✅ 使用旗標變數避免舊請求更新狀態
function FlagFetch({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      const data: User = await res.json();
      await delay(userId === "1" ? 1000 : 300);
      if (!isCancelled) setUser(data);
    };

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return <UserDisplay label="目前畫面顯示資料：" user={user} />;
}

// ✅ 使用 AbortController 中止舊請求
function AbortFetch({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          { signal: controller.signal }
        );

        // ❗將 delay 放進來，使其只在請求成功時才執行
        await delay(userId === "1" ? 1000 : 300);

        const data: User = await res.json(); // 注意：這行放在 delay 後面會出現競態
        setUser(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("✅ 請求已中止");
        } else {
          console.error("⚠️ 發生其他錯誤", err);
        }
      }
    };

    fetchData();
    return () => {
      controller.abort(); // 中止請求
    };
  }, [userId]);

  return <UserDisplay label="目前畫面顯示資料：" user={user} />;
}

// ✅ 使用 SWR 自動處理競態與快取
function SWRFetch({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR(
    userId ? `https://jsonplaceholder.typicode.com/users/${userId}` : null,
    fetcher
  );

  if (error) return <p className="text-sm text-destructive">載入錯誤</p>;
  if (isLoading) return <p className="text-sm">讀取中...</p>;

  return <UserDisplay label="目前畫面顯示資料：" user={user} />;
}

// 🌟 顯示目前資料
function UserDisplay({ user, label }: { user: User | null; label: string }) {
  return (
    <div className="text-sm">
      <p className="font-semibold">{label}</p>
      {user ? (
        <>
          <p>使用者名稱：{user.name}</p>
          <p>Email：{user.email}</p>
        </>
      ) : (
        <p>讀取中...</p>
      )}
    </div>
  );
}

// ✅ GroundTruth：實際應該呈現的資料（用來比對）
function GroundTruth({ userId }: { userId: string }) {
  const { data: user, isLoading } = useSWR(
    userId ? `https://jsonplaceholder.typicode.com/users/${userId}` : null,
    fetcher
  );

  return (
    <div className="text-sm border rounded p-3 bg-muted">
      <p className="font-semibold">✔️ 正確資料（根據 userId = {userId}）</p>
      {isLoading || !user ? (
        <p>讀取中...</p>
      ) : (
        <>
          <p>使用者名稱：{user.name}</p>
          <p>Email：{user.email}</p>
        </>
      )}
    </div>
  );
}
