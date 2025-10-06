import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">English Journal</h1>
      <div className="space-x-3">
        <Link href="/journal" className="px-4 py-2 bg-blue-600 text-white rounded">新規投稿</Link>
        <Link href="/feed" className="px-4 py-2 bg-gray-700 text-white rounded">投稿一覧</Link>
        <Link href="/mypage" className="px-4 py-2 bg-gray-200 rounded">My Page</Link>
      </div>
    </main>
  );
}
