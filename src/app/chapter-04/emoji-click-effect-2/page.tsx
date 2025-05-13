"use client";
import React, { useState, MouseEvent, useEffect, useRef } from "react";

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
  const [playHeartbeat, setPlayHeartbeat] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // 點擊畫面新增 emoji，並重置心跳計時
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (playHeartbeat) return; // 心跳中無法新增
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const symbol = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const id = Date.now() + Math.random();
    setEmojis((prev) => [...prev, { id, x, y, symbol }]);
    resetHeartbeatInterval();
  };

  // 開始每 2 秒觸發心跳，動畫持續 1s
  const startHeartbeatInterval = () => {
    clearHeartbeatInterval();
    intervalRef.current = window.setInterval(() => {
      setPlayHeartbeat(true);
      setTimeout(() => setPlayHeartbeat(false), 1000);
    }, 2000);
  };

  const clearHeartbeatInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 每次點擊後重置計時
  const resetHeartbeatInterval = () => {
    startHeartbeatInterval();
  };

  // 組件卸載時清除 interval
  useEffect(() => {
    return () => clearHeartbeatInterval();
  }, []);

  return (
    <div className="w-screen h-screen">
      <div
        onClick={handleClick}
        className={`relative w-full h-full bg-gray-100 ${
          playHeartbeat ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {emojis.map(({ id, x, y, symbol }) => (
          <Emoji
            key={id}
            x={x}
            y={y}
            symbol={symbol}
            playHeartbeat={playHeartbeat}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes heartbeat {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}

interface EmojiProps {
  x: number;
  y: number;
  symbol: string;
  playHeartbeat: boolean;
}

function Emoji({ x, y, symbol, playHeartbeat }: EmojiProps) {
  return (
    <span
      role="img"
      className={`absolute select-none transform -translate-x-1/2 -translate-y-1/2 ${
        playHeartbeat ? "animate-[heartbeat_1s_ease-in-out]" : ""
      }`}
      style={{ left: x, top: y }}
    >
      {symbol}
    </span>
  );
}
