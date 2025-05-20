"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// 計算勝利者
function calculateWinner(squares: ("X" | "O" | null)[]): "X" | "O" | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToePage() {
  // 棋盤格子狀態
  const [squares, setSquares] = useState<("X" | "O" | null)[]>(
    Array(9).fill(null)
  );
  // true: X 下一手，false: O 下一手
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  // 判斷是否平手：無勝者且格子都已填滿
  const isDraw = !winner && squares.every((v) => v !== null);

  // 點擊格子處理
  const handleClick = (index: number) => {
    if (winner || squares[index]) return;
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // 重置遊戲
  const resetBoard = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // 狀態文字
  let statusText: string;
  if (winner) {
    statusText = `勝利者：${winner}`;
  } else if (isDraw) {
    statusText = "平手";
  } else {
    statusText = `下一位玩家：${xIsNext ? "X" : "O"}`;
  }

  return (
    <Card className="p-6 max-w-sm mx-auto">
      <CardContent className="space-y-4">
        <h1 className="text-2xl font-bold text-center">井字遊戲</h1>
        <p
          className={
            winner
              ? "text-green-600 font-bold text-center"
              : isDraw
              ? "text-gray-600 font-bold text-center"
              : "text-center"
          }
        >
          {statusText}
        </p>

        {/* 棋盤置中處理 */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 border">
            {squares.map((value, idx) => {
              const borderClasses =
                (idx % 3 !== 2 ? "border-r " : "") +
                (idx < 6 ? "border-b" : "");
              return (
                <button
                  key={idx}
                  onClick={() => handleClick(idx)}
                  className={
                    "w-16 h-16 flex items-center justify-center " +
                    "text-xl font-bold border " +
                    borderClasses
                  }
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={resetBoard}
          className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Reset
        </button>
      </CardContent>
    </Card>
  );
}
