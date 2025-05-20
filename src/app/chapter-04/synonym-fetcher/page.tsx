"use client";

import React, { useState, useCallback, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SynonymItem {
  word: string;
  score?: number;
  tags?: string[];
}

interface UseFetchSynonymsResult {
  synonyms: string[];
  isLoading: boolean;
  error: Error | null;
  fetchSynonyms: (word: string) => void;
}

/**
 * 自訂 Hook：useFetchSynonyms
 * - 接收英文單字 word 作為參數
 * - 回傳 { synonyms, isLoading, error, fetchSynonyms }
 * - 使用 encodeURIComponent 防範 injection
 */
function useFetchSynonyms(): UseFetchSynonymsResult {
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSynonyms = useCallback(async (word: string) => {
    if (!word) return;
    setIsLoading(true);
    setError(null);
    try {
      const safeWord = encodeURIComponent(word);
      const res = await fetch(
        `https://api.datamuse.com/words?rel_syn=${safeWord}`
      );
      if (!res.ok) {
        throw new Error(`伺服器回應非 2xx：${res.status}`);
      }
      const data: SynonymItem[] = await res.json();
      const list = data.map((item) => item.word);
      setSynonyms(list);
    } catch (err) {
      setError(err as Error);
      setSynonyms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { synonyms, isLoading, error, fetchSynonyms };
}

export default function SynonymFetcherPage() {
  const [word, setWord] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const { synonyms, isLoading, error, fetchSynonyms } = useFetchSynonyms();

  // 驗證輸入是否僅限英文字母
  const validate = (input: string) => {
    if (!/^[a-zA-Z]+$/.test(input)) {
      return "僅限英文單字，請勿包含空格或特殊字元。";
    }
    return "";
  };

  // 表單提交或列表字詞點擊
  const handleSearch = (searchWord?: string) => {
    const raw = searchWord ?? word.trim();
    const msg = validate(raw);
    if (msg) {
      setValidationError(msg);
      return;
    }
    setValidationError("");
    setWord(raw);
    setHasSearched(true);
    fetchSynonyms(raw);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <CardContent className="space-y-6">
        <h1 className="text-2xl font-bold">同義字查詢器</h1>

        {/* 查詢區塊：input 與按鈕同排 */}
        <form onSubmit={onSubmit} className="flex items-start space-x-2">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="輸入英文單字"
            className="flex-1 px-3 py-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            maxLength={30}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            查詢
          </button>
        </form>
        {validationError && (
          <p className="text-red-600 text-sm">{validationError}</p>
        )}

        {/* 結果區塊 */}
        <div className="border-t pt-4">
          {isLoading && <p>載入中…</p>}
          {error && <p className="text-red-600">發生錯誤：{error.message}</p>}

          {!isLoading && !error && hasSearched && (
            <>
              {synonyms.length > 0 ? (
                <ul className="grid grid-cols-2 gap-2">
                  {synonyms.map((syn) => (
                    <li key={syn}>
                      <button
                        onClick={() => handleSearch(syn)}
                        className="w-full text-left px-3 py-2 border rounded hover:bg-gray-100 transition"
                      >
                        {syn}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>找不到同義字。</p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
