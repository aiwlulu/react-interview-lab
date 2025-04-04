import Link from "next/link";
import { chapters } from "@/data/chapters";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">React Interview Lab 🧪</h1>
      <p className="text-muted-foreground">
        從這裡開始，逐步掌握 React 的核心技巧
      </p>

      <ul className="space-y-2">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <Link
              href={`/${chapter.id}`}
              className="text-blue-600 hover:underline"
            >
              {chapter.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
