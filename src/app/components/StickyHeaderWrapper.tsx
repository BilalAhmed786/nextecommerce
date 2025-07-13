'use client';

import { useEffect, useState } from 'react';

export default function StickyHeaderWrapper({ children }: { children: React.ReactNode }) {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 300) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`
        w-full z-50 fixed top-0 bg-blue-600
        transition-all duration-700 ease-in-out transform
        ${showHeader ? 'translate-y-0 opacity-100 shadow-md' : '-translate-y-full opacity-0'}
      `}
    >
      {children}
    </div>
  );
}
