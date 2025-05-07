"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TabProps {
  label: string;
  content: React.ReactNode;
}

interface TabSwitcherProps {
  tabs: TabProps[];
  autoRotate?: boolean;
  rotateInterval?: number;
}

export default function TabSwitchChallengePage() {
  const tabs: TabProps[] = [
    { label: "Tab 1", content: <p>這是 Tab 1 的內容</p> },
    { label: "Tab 2", content: <p>這是 Tab 2 的內容</p> },
    { label: "Tab 3", content: <p>這是 Tab 3 的內容</p> },
  ];

  return (
    <Card className="p-6 max-w-md mx-auto">
      <CardContent className="space-y-4">
        <h1 className="text-2xl font-bold">Tab 切換元件</h1>
        <TabSwitcher tabs={tabs} autoRotate rotateInterval={3000} />
      </CardContent>
    </Card>
  );
}

function TabSwitcher({
  tabs,
  autoRotate = false,
  rotateInterval = 5000,
}: TabSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % tabs.length);
      }, rotateInterval);
    }
  }, [autoRotate, rotateInterval, tabs.length]);

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetInterval]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    resetInterval();
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              index === activeIndex
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded">{tabs[activeIndex].content}</div>
    </div>
  );
}
