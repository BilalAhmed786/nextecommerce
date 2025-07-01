import Link from 'next/link';
import { getClient } from './lib/apolloSSR';
import { get_products, get_category } from '@/app/graphql/product';
import { Props } from './types/layouttype';
import Shopbutton from './components/shopbutton';
import FilterForm from './components/FilterForm';
import Shopsearchform from './components/shopsearchform';

const priceRanges = [
  { label: 'Under $50', value: '1-50' },
  { label: '$51 - $100', value: '51-100' },
  { label: '$101 - $200', value: '101-200' },
];

function parsePriceRange(price: string | undefined) {
  if (!price) return { minPrice: null, maxPrice: null };
  const [min, max] = price.split('-').map(Number);
  return { minPrice: min, maxPrice: max };
}

export default async function ShopPage({ searchParams }: Props) {
  const { category, price, search } =  await searchParams

  const selectedCategory = category ;
  const selectedPrice = parsePriceRange(price);
  const searchitem = search;
  const { data } = await getClient().query({ query: get_products });
  const { data: categories } = await getClient().query({ query: get_category })

  function filterproducts(data: any) {

    if (selectedCategory && !selectedPrice.maxPrice && !selectedPrice.minPrice) {

      return data.filter((products: any) => products.category.id === selectedCategory)

    } else if (selectedPrice.maxPrice && selectedPrice.minPrice && !selectedCategory) {


      return data.filter((products: any) => products.price >= selectedPrice.minPrice && products.price <= selectedPrice.maxPrice)


    } else if (selectedCategory && selectedPrice.minPrice && selectedPrice.maxPrice) {

      return data.filter((products: any) => products.category.id === selectedCategory && products.price >= selectedPrice.minPrice && products.price <= selectedPrice.maxPrice)

    }
    else if (searchitem) {

      return data.filter((products: any) => products.name.toLowerCase().includes(searchitem.toLowerCase()))

    } else {

      return data
    }

  }

  const filter = filterproducts(data.products)


  return (


    <div className="flex m-5">
      {/* Sidebar Filters */}
      <aside className="w-64 h-screen">
        <Link className='block mb-5' href={'http://localhost:3000'}>All products</Link>
        <FilterForm categories={categories.categories} priceRanges={priceRanges} />

      </aside>

      {/* Products */}
      <div className='block w-full m-5'>
        <Shopsearchform />

        <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 m-3">
          {filter?.length > 0 ? (
            filter.map((product: any) => (
              <div
                key={product.id}
                className="p-4 rounded shadow-lg hover:text-red-500 hover:shadow-2xl transition-all ease-in-out duration-1000"
              >
                <img
                  src={product.image}
                  className="w-full h-70 object-cover mb-2 rounded hover:h-80 transition-all ease-in-out duration-1000"
                  alt={product.name}
                />
                <Shopbutton product={product} />
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">{product.category.name}</p>
              </div>

            ))
          ) : (
            <p className="text-gray-500 col-span-full">No products found.</p>
          )}
        </main>

      </div>
    </div>

  );
}
