'use client';
import React from 'react';

interface Prop {
  valid: string;
  setValid: React.Dispatch<React.SetStateAction<string>>;
}

export default function CartNotification({ valid, setValid }: Prop) {
  if (!valid) return null;

  return (
    <div className="fixed w-full flex justify-center bottom-2">
      <div className="relative flex justify-center items-center w-[80%] m-auto bottom-0.5 text-white h-12 bg-amber-700">
        <button
          className="absolute right-2"
          onClick={() => setValid('')}
        >
          X
        </button>
        <p>{valid}</p>
      </div>
    </div>
  );
}