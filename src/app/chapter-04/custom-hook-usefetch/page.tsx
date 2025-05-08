"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 自訂 Hook：useFetch
 * - 接收 url 作為參數
 * - 回傳 { data, loading, error }
 * - 使用 fetch 並搭配 useEffect
 */
function useFetch<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; // 避免元件卸載後還嘗試更新 state

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`伺服器回應非 2xx：${res.status}`);
        }
        const json = await res.json();
        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      // 清除標記，避免記憶體洩漏
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function UseFetchPage() {
  // 範例：從 JSONPlaceholder 讀取文章列表
  const {
    data: posts,
    loading,
    error,
  } = useFetch<Post[]>("https://jsonplaceholder.typicode.com/posts");

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <CardContent className="space-y-4">
        <h1 className="text-2xl font-bold">使用自訂 Hook 的資料請求示範</h1>

        {loading && <p>載入中……</p>}
        {error && <p className="text-red-600">發生錯誤：{error.message}</p>}

        {!loading && !error && posts && (
          <ul className="space-y-2">
            {posts.slice(0, 10).map((post) => (
              <li key={post.id} className="border-b pb-2">
                <h2 className="font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-600">{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
