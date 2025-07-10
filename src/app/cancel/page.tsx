export default function CancelPage() {
  return (
    <div className="max-w-xl mx-auto py-12 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-gray-700 mb-6">
        Your payment was not completed. If you change your mind, you can try again from your cart.
      </p>
      <a href="/cart" className="text-blue-500 underline">Return to Cart</a>
    </div>
  );
}
