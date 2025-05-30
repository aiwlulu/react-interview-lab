import Link from "next/link";
import { chapters } from "@/data/chapters";

const chapter = chapters.find((c) => c.id === "chapter-02");

export default function Chapter02() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{chapter?.title}</h1>

      <ul className="space-y-2">
        {chapter?.topics.map((topic) => (
          <li key={topic.id}>
            <Link
              href={`/chapter-02/${topic.id}`}
              className="text-blue-600 hover:underline"
            >
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
