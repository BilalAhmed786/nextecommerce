'use client';


export default function FilterForm({ categories, priceRanges }: any) {
  

  return (

    <form method="get" className="flex flex-col justify-center items-center">
      <div className="">
        <h2 className="font-semibold mb-2">Category</h2>
        {categories?.map((cat: any, index: number) => (
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
        {priceRanges?.pricefilter?.map((label:any, index:number) => (
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
        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-800 mt-4 -ml-5"
      >
        Apply Filters
      </button>
    </form>

  
  );
}
