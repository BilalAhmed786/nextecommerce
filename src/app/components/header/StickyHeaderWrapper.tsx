'use client';

import { useEffect, useRef, useState } from "react";

export default function StickyHeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY <= 80) {
          setShowHeader(true);
        } else if (currentY > lastScrollY.current) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed z-40 left-0 top-0 w-full transform-gpu transition-all duration-300 ease-out ${
        showHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      <div className="shadow-2xl shadow-black/20">
        {children}
      </div>
    </div>
  );
}
