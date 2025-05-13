"use client";
import React, { useState, MouseEvent } from "react";

// 可自訂的水果 emoji 列表
const EMOJIS = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍑", "🍍"];

type EmojiItem = {
  id: number;
  x: number;
  y: number;
  symbol: string;
};

export default function EmojiClickEffectPage() {
  const [emojis, setEmojis] = useState<EmojiItem[]>([]);

  // 點擊畫面時呼叫，並在點擊位置顯示隨機 emoji
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // 取得容器相對座標
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 隨機選 emoji
    const symbol = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const id = Date.now() + Math.random();

    // 新增到 state
    setEmojis((prev) => [...prev, { id, x, y, symbol }]);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        cursor: "pointer",
      }}
    >
      {emojis.map(({ id, x, y, symbol }) => (
        <span
          key={id}
          role="img"
          className="emoji"
          style={{
            position: "absolute",
            left: x,
            top: y,
            userSelect: "none",
            transform: "translate(-50%, -50%)",
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}
