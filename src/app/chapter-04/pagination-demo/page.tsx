"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  name: string;
}

/**
 * 模擬向 API 請求使用者資料，每頁 pageSize 筆
 */
function fetchUsers(page: number, pageSize = 10): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const users = Array.from({ length: pageSize }, (_, i) => ({
        id: start + i + 1,
        name: `User ${start + i + 1}`,
      }));
      resolve(users);
    }, 1000);
  });
}

export default function PaginationDemoPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchUsers(page);
        if (canceled) return;
        setUsers(data);
        // 若回傳筆數小於 pageSize，代表沒有更多
        setHasMore(data.length === 10);
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => {
      canceled = true;
    };
  }, [page]);

  return (
    <Card className="p-6 max-w-md mx-auto">
      <CardContent className="space-y-4">
        <h1 className="text-2xl font-bold">簡易分頁示範</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="border p-2 rounded">
                {user.name}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一頁
          </button>

          <span className="px-4 py-2">第 {page} 頁</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一頁
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
