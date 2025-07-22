'use client';

import { useEffect, useState, useRef } from 'react';

export default function StickyHeaderWrapper({ children }: { children: React.ReactNode }) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {

    
    const handleScroll = () => {
      
      const currentY = window.scrollY;
      

      if (currentY < 100) {
        
        setShowHeader(true);
      
      } else if (currentY > lastScrollY.current) {
     
        setShowHeader(false);
      } else {
        
        setShowHeader(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`
        w-full z-50 fixed top-0 bg-blue-600
        transition-all duration-1000 ease-in-out transform
        ${showHeader ? 'translate-y-0 opacity-100 shadow-md' : '-translate-y-full opacity-0'}
      `}
    >
      {children}
    </div>
  );
}
