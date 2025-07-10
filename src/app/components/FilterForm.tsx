'use client';
import { useSearchParams } from 'next/navigation';

export default function FilterForm({ categories, priceRanges }: any) {
  
  const searchParams = useSearchParams();
  const selectedCategory = searchParams?.get('category') || '';
  const selectedPrice = searchParams?.get('price') || '';

  return (
    <form method="get" className="space-y-6">
      <div>
        <h2 className="font-semibold mb-2">Category</h2>
        {categories.map((cat: any, index: number) => (
          <label key={index} className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="category"
              value={cat.id}
              
            />
            {cat.name}
          </label>
        ))}
      </div>

      <div>
        <h2 className="font-semibold mb-2">Price</h2>
        {priceRanges.pricefilter.map((label:any, index:number) => (
          <label key={index} className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="price"
              value={label.amount}
              
            />
              ${label.amount}
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Apply Filters
      </button>
    </form>
  );
}
