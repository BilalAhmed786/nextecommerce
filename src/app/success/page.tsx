'use client';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    // Remove cart only after successful Stripe payment
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartChanged'));
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
      <p className="mt-4">Thank you for your purchase!</p>
      <a href="/" className="text-blue-500 underline">Return to Home</a>
    </div>
  );
}
