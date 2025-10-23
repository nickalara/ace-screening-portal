import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full bg-dark-900 border-b border-dark-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="https://startguides.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <Image
            src="https://startguides.net/wp-content/uploads/2023/07/cropped-StartGuides_Logo_whiteType-1.png"
            alt="StartGuides Logo"
            width={200}
            height={24}
            priority
            className="h-6 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
