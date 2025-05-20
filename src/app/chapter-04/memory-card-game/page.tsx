"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

// 卡片資料型別
interface CardItem {
  id: number;
  pairId: number;
  imgSrc: string;
}

// 初始化並洗牌：6 組配對，共 12 張
function initCards(): CardItem[] {
  const totalPairs = 6;
  const cards: CardItem[] = [];
  for (let idx = 0; idx < totalPairs; idx++) {
    const src = `/cards/${idx + 1}.webp`;
    cards.push({ id: idx * 2, pairId: idx, imgSrc: src });
    cards.push({ id: idx * 2 + 1, pairId: idx, imgSrc: src });
  }
  // Fisher–Yates 洗牌
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export default function MemoryCardGamePage() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);

  // 僅在 client 初始化卡片
  useEffect(() => {
    setCards(initCards());
  }, []);

  // 翻牌處理
  const handleFlip = (cardId: number) => {
    if (
      flipped.includes(cardId) ||
      completed.includes(cardId) ||
      flipped.length === 2
    ) {
      return;
    }
    setFlipped((prev) => [...prev, cardId]);
  };

  // 檢查匹配
  useEffect(() => {
    if (flipped.length === 2) {
      const [firstId, secondId] = flipped;
      const first = cards.find((c) => c.id === firstId)!;
      const second = cards.find((c) => c.id === secondId)!;
      if (first.pairId === second.pairId) {
        setCompleted((prev) => [...prev, firstId, secondId]);
        setFlipped([]);
      } else {
        const timeout = setTimeout(() => setFlipped([]), 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [flipped, cards]);

  const isWin = completed.length === cards.length;

  return (
    <Card className="p-6 max-w-md mx-auto">
      <CardContent className="space-y-4">
        <h1 className="text-2xl font-bold text-center">翻牌配對遊戲</h1>
        {isWin && (
          <p className="text-green-600 font-bold text-center text-xl">
            You Win!
          </p>
        )}

        {/* 卡片區 */}
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => {
            const isFlipped =
              flipped.includes(card.id) || completed.includes(card.id);
            return (
              <div
                key={card.id}
                onClick={() => handleFlip(card.id)}
                className="w-20 h-28 cursor-pointer perspective"
              >
                <div
                  className="relative w-full h-full transition-transform duration-300"
                  style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* 背面 */}
                  <div
                    className="absolute inset-0 bg-gray-300 rounded border"
                    style={{ backfaceVisibility: "hidden" }}
                  />

                  {/* 正面 */}
                  <div
                    className="absolute inset-0 rounded border overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Image
                      src={card.imgSrc}
                      alt="card front"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
