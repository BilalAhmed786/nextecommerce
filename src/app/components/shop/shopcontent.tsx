'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLazyQuery, useQuery } from '@apollo/client';
import { get_products, get_category, get_price_filter } from '@/app/graphql/product';

import Shopbutton from '../../reusablecomponent/shopbutton';
import Shopicons from './shopicons';
import Cartsidebar from '../../reusablecomponent/cartsidebar';
import Sidebar from './sidebar';
import Link from 'next/link';


function parsePriceRange(price: string | null | undefined) {
  if (!price) return { minPrice: null, maxPrice: null };
  const [min, max] = price.split('-').map(Number);
  return { minPrice: min, maxPrice: max };
}

export default function Shopcontent({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category');
  const price = searchParams?.get('price');
  const search = searchParams?.get('search');

  const selectedCategory = category;
  const selectedPrice = parsePriceRange(price);
  const searchitem = search;

  const [products, setProducts] = useState(initialProducts);
  const [skip, setSkip] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [newlyAddedIndex, setNewlyAddedIndex] = useState<number | null>(null);

  const { data: pricefilter } = useQuery(get_price_filter);
  const { data: categories } = useQuery(get_category);

  const [loadMoreProducts, { loading }] = useLazyQuery(get_products, {
    onCompleted: (res) => {
      if (res?.products?.length === 0) {
        setHasMore(false);
      } else {
        const startIndex = products.length;
        setProducts((prev) => [...prev, ...res.products]);
        setSkip((prev) => prev + 3);
        setNewlyAddedIndex(startIndex);

      }
    },
  });

  const filterProducts = useCallback(
    (data: any[]) => {
      const hasMin = selectedPrice.minPrice != null;
      const hasMax = selectedPrice.maxPrice != null;

      return data.filter((product) => {
        const matchesCategory = selectedCategory ? product.category.id === selectedCategory : true;
        const matchesPrice =
          hasMin && hasMax
            ? product.price >= selectedPrice.minPrice && product.price <= selectedPrice.maxPrice
            : true;
        const matchesSearch = searchitem
          ? product.name.toLowerCase().includes(searchitem.toLowerCase())
          : true;

        return matchesCategory && matchesPrice && matchesSearch;
      });
    },
    [selectedCategory, selectedPrice, searchitem]
  );

  const filtered = filterProducts(products);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 300 && hasMore && !loading) {

        loadMoreProducts({ variables: { skip, take: 3} });

      }
    };


    window.addEventListener('scroll', handleScroll);


    return () => window.removeEventListener('scroll', handleScroll);
  }, [skip, hasMore, loading, loadMoreProducts]);

  return (
    <div className="flex m-5 mt-30 mb-20 min-h-screen">
     

      <Sidebar categories={categories?.categories} priceRanges={pricefilter} />

      <div className="block w-[95%] m-auto">
        
        <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filtered?.length > 0 ? (
            filtered.map((product: any, i: number) => {
              const isNew = newlyAddedIndex !== null && i >= newlyAddedIndex;

              return (
                <div
                  key={i}
                  className={`p-2 rounded transition-all duration-1000 ease-in hover:scale-105
                  ${isNew ? 'translate-y-7 opacity-100' : ''}`}
                >
                  <div className="relative group">
                    <div className="hidden md:hidden lg:block">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-85 object-cover mb-2 rounded"
                      />
                    </div>
                    <div className="block md:block lg:hidden">
                      <Link href={`/singleproduct/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-85 object-cover mb-2 rounded"
                        />
                      </Link>
                    </div>
                    <Shopicons product={product} />
                  </div>

                  <div className="block md:block lg:hidden">
                    <Shopbutton product={product} />
                  </div>
                  <h2 className="font-medium text-[14px]">{product.name}</h2>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-sm text-gray-500">{product.category.name}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 col-span-full text-center">No products found.</p>
          )}

          <Cartsidebar />
        </main>

       
      </div>
    </div>
  );
}
