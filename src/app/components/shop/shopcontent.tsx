"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  get_products,
  get_category,
  get_price_filter,
} from "@/app/graphql/product";
import Sidebar from "./sidebar";
import Shopbutton from "../../reusablecomponent/shopbutton";
import Shopicons from "./shopicons";
import Cartsidebar from "../../reusablecomponent/cartsidebar";
import Link from "next/link";

function parsePriceRange(price: string | null) {
  if (!price) return { minPrice: null, maxPrice: null };
  const [min, max] = price.split("-").map(Number);
  return { minPrice: min, maxPrice: max };
}

export default function Shopcontent() {
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { data: categories } = useQuery(get_category);
  const { data: pricefilter } = useQuery(get_price_filter);
  const searchParams = useSearchParams();

    //parse price into range
    const { minPrice, maxPrice } = parsePriceRange(price);
  
  
  useEffect(() => {
    setCategory(searchParams?.get("category") ?? null);
    setPrice(searchParams?.get("price") ?? null);
    setSearch(searchParams?.get("search") ?? null);
  }, [searchParams])
 
  

  const [loadProducts, { loading }] = useLazyQuery(get_products, {
    onCompleted: (res) => {
      if (!res?.products?.length) {
        setHasMore(false);
        return;
      }
      setProducts((prev) => [...prev, ...res.products]);
      setSkip((prev) => prev + 3);
    },
  });

  // ✅ Reset & refetch when filters change
  useEffect(() => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);

    loadProducts({
      variables: {
        skip: 0,
        take: 3,
        category,
        minPrice,
        maxPrice,
        search,
      },
    });
  }, [category, price, search]);

  // ✅ Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !loading
      ) {
        loadProducts({
          variables: {
            skip,
            take: 3,
            category,
            minPrice,
            maxPrice,
            search,
          },
        });
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [skip, hasMore, loading]);

  return (
    <div className="flex m-5 min-h-screen">
      <Sidebar categories={categories?.categories} priceRanges={pricefilter} />

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {products.length ? (
          products.map((product,index) => (
            <div  key={`${product.id}-${index}`} className="p-2">
              <Link href={`/singleproduct/${product.id}`}>
                <img src={product.image} className="w-full h-80 object-cover" />
              </Link>
              <Shopicons product={product} />
              <Shopbutton product={product} />
              <h2>{product.name}</h2>
              <p>${product.price}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center">No products found</p>
        )}

        <Cartsidebar />
      </main>
    </div>
  );
}
