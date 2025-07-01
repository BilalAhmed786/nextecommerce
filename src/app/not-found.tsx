export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-lg mt-2">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="mt-4 inline-block text-blue-500 hover:underline">
        Go back to homepage
      </a>
    </div>
  );
}
