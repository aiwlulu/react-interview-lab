"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null; // 首頁不顯示

  return (
    <nav className="text-sm text-muted-foreground mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:underline">
            首頁
          </Link>
        </li>
        {segments.map((seg, index) => {
          const path = "/" + segments.slice(0, index + 1).join("/");
          return (
            <li key={path} className="flex items-center">
              <span className="mx-1">/</span>
              <Link href={path} className="hover:underline capitalize">
                {decodeURIComponent(seg)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
