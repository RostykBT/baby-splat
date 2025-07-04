"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Link
          href="/gaussian"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          View Gaussian Splatting Demo
        </Link>
      </div>
    </div>
  );
}
