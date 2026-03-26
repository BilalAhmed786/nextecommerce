"use client";

import { useEffect, useState, useRef } from "react";
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

  const [min, max] = price.split("+-+").map(Number);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return { minPrice: null, maxPrice: null };
  }

  return { minPrice: min, maxPrice: max };
}

export default function Shopcontent() {
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const skipRef = useRef(0);
  const isFetchingRef = useRef(false);

  const { data: categories } = useQuery(get_category);
  const { data: pricefilter } = useQuery(get_price_filter);
  const searchParams = useSearchParams();

  const { minPrice, maxPrice } = parsePriceRange(price);

  /* READ URL PARAMS */
  useEffect(() => {
    setCategory(searchParams?.get("category") ?? null);
    setPrice(searchParams?.get("price") ?? null);
    setSearch(searchParams?.get("search") ?? null);
  }, [searchParams]);

  const [loadProducts] = useLazyQuery(get_products, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      isFetchingRef.current = false;
      setInitialLoadDone(true);

      if (!res?.products?.length) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...res.products]);
      skipRef.current += 3;
    },
    onError: () => {
      isFetchingRef.current = false;
    },
  });

  /* RESET ON FILTER CHANGE */
  useEffect(() => {
    setProducts([]);
    skipRef.current = 0;
    setHasMore(true);
    setInitialLoadDone(false);
    isFetchingRef.current = true;

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

  /* INFINITE SCROLL */
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true;

        loadProducts({
          variables: {
            skip: skipRef.current,
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
  }, [hasMore, category, minPrice, maxPrice, search]);

  return (
    <div className="flex m-5 min-h-screen">
      <Sidebar
        categories={categories?.categories}
        priceRanges={pricefilter}
      />

      <main className="flex-1 m-5">
        {!initialLoadDone && products.length === 0 && (
          <p className="text-center mt-10">Loading products...</p>
        )}

        {initialLoadDone && products.length === 0 && (
          <p className="flex h-screen justify-center items-center">
            No products found
          </p>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={`${product.id}-${index}`} className="p-2">
                <Link href={`/singleproduct/${product.id}`}>
                  <img
                    src={product.image}
                    className="w-full h-80 object-cover"
                    alt={product.name}
                  />
                </Link>

                <Shopicons product={product} />
                <Shopbutton product={product} />
                <h2>{product.name}</h2>
                <p>${product.price}</p>
              </div>
            ))}
          </div>
        )}

        <Cartsidebar />
      </main>
    </div>
  );
}