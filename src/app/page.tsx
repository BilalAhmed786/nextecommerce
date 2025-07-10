import Link from 'next/link';
import { getClient } from './lib/apolloSSR';
import { get_products, get_category, get_price_filter } from '@/app/graphql/product';
import { Props } from './types/layouttype';
import Shopbutton from './components/shopbutton';
import FilterForm from './components/FilterForm';
import Shopsearchform from './components/shopsearchform';
import Shopicons from './components/shopicons';
import MediaSidebar from './components/mediasidebar';
import { FiRefreshCcw } from 'react-icons/fi' 

function parsePriceRange(price: string | undefined) {
  if (!price) return { minPrice: null, maxPrice: null };
  const [min, max] = price.split('-').map(Number);
  return { minPrice: min, maxPrice: max };
}

export default async function ShopPage({ searchParams }: Props) {
  const { category, price, search } = await searchParams

  const selectedCategory = category;
  const selectedPrice = parsePriceRange(price);
  const searchitem = search;
  const { data } = await getClient().query({ query: get_products });
  const { data: pricefilter } = await getClient().query({ query: get_price_filter })
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

  if (data.length < 0) {

    return <div>...loading</div>
  }


  return (


    <div className="flex m-5">
      
      <aside className="hidden w-64 md:hidden lg:block h-screen">
        <Link className='block mb-5 w-[80%] m-auto' href={'http://localhost:3000'}><FiRefreshCcw/></Link>
        <FilterForm categories={categories.categories} priceRanges={pricefilter} />

      </aside>

      <MediaSidebar categories = {categories.categories} priceRanges={pricefilter} />

     
      <div className='block w-full m-5'>
       <div className='hidden md:hidden lg:block'><Shopsearchform /></div>

        <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 m-3">
          {filter?.length > 0 ? (
            filter.map((product: any, i: number) => (
              <div
                key={i}
                className="p-4 rounded shadow-lg hover:scale-105 transition-all ease-in-out duration-700"
              >
                {/* Image Wrapper with relative position */}
                <div className="relative group">
                  <div className="hidden md:hidden lg:block">
                    <img
                      src={product.image}
                      className="w-full h-70 object-cover mb-2 rounded"
                      alt={product.name}
                    />
                  </div>
                  <div className="block md:block lg:hidden">
                    <Link href={`/singleproduct/${product.id}`}>

                      <img
                        src={product.image}
                        className="w-full h-70 object-cover mb-2 rounded"
                        alt={product.name}
                      />
                    </Link>
                  </div>


                  <Shopicons product={product} />


                </div>

                <div className='block md:block lg:hidden'>  
                   <Shopbutton product={product} /> 
                </div>
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
