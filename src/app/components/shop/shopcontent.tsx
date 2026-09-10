"use client";

import { useEffect, useRef, useState } from "react";
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

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

function parsePriceRange(price: string | null) {
  if (!price) {
    return {
      minPrice: null,
      maxPrice: null,
    };
  }

  const [min, max] = price.split("+-+").map(Number);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return {
      minPrice: null,
      maxPrice: null,
    };
  }

  return {
    minPrice: min,
    maxPrice: max,
  };
}

export default function Shopcontent() {
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const skipRef = useRef(0);
  const isFetchingRef = useRef(false);

  const searchParams = useSearchParams();

  const { data: categories } = useQuery(get_category);
  const { data: pricefilter } = useQuery(get_price_filter);

  const { minPrice, maxPrice } = parsePriceRange(price);

  /*
   * READ URL PARAMETERS
   */
  useEffect(() => {
    if (!searchParams) return;

    setCategory(searchParams.get("category"));
    setPrice(searchParams.get("price"));
    setSearch(searchParams.get("search"));
  }, [searchParams]);

  /*
   * LOAD PRODUCTS
   */
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

      skipRef.current += 32;
    },

    onError: () => {
      isFetchingRef.current = false;
      setInitialLoadDone(true);
    },
  });

  /*
   * RESET PRODUCTS WHEN FILTER CHANGES
   */
  useEffect(() => {
    setProducts([]);
    skipRef.current = 0;
    setHasMore(true);
    setInitialLoadDone(false);
    isFetchingRef.current = true;

    loadProducts({
      variables: {
        skip: 0,
        take: 32,
        category,
        minPrice,
        maxPrice,
        search,
      },
    });
  }, [
    category,
    price,
    search,
    minPrice,
    maxPrice,
    loadProducts,
  ]);

  /*
   * INFINITE SCROLL
   */
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500;

      if (!nearBottom || !hasMore || isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;

      loadProducts({
        variables: {
          skip: skipRef.current,
          take: 32,
          category,
          minPrice,
          maxPrice,
          search,
        },
      });
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [
    hasMore,
    category,
    minPrice,
    maxPrice,
    search,
    loadProducts,
  ]);

  return (
    <div className="min-h-screen mt-32 lg:mt-14 md:mt-32 bg-[#fafafa]">
      {/* SHOP HEADER */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-600">
                Our Collection
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                Shop
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                Discover our carefully selected collection of premium
                products, made to bring quality and style to your everyday
                life.
              </p>
            </div>

            {initialLoadDone && products.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
                products
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN SHOP AREA */}

      <div className="mx-auto flex max-w-[1600px] gap-6 px-5 py-8 md:px-8">
        {/* DESKTOP SIDEBAR */}

        

        {/* PRODUCTS */}

        <main className="min-w-0 flex-1">
          {/* MOBILE FILTER */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
            <Sidebar
              categories={categories?.categories}
              priceRanges={pricefilter}
            />
          </div>

          {/* LOADING SKELETON */}

          {!initialLoadDone && products.length === 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="h-72 animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />

                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />

                    <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}

          {initialLoadDone && products.length === 0 && (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-3xl text-gray-400">⌕</span>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900">
                  No products found
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  We couldn&apos;t find any products matching your current
                  filters. Try changing your category, price range, or search.
                </p>
              </div>
            </div>
          )}

          {/* PRODUCT GRID */}

          {products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
                >
                  {/* PRODUCT IMAGE */}

                  <div className="relative overflow-hidden bg-gray-100">
                    <Link href={`/singleproduct/${product.id}`}>
                      <div className="relative h-72 overflow-hidden sm:h-80">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
                      </div>
                    </Link>

                    {/* PRODUCT ICONS */}

                    <div className="absolute right-15 top-4 z-10">
                      <Shopicons product={product} />
                    </div>
                  </div>

                  {/* PRODUCT INFORMATION */}

                  <div className="p-5">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-gray-400">
                      Premium Collection
                    </p>

                    <Link href={`/singleproduct/${product.id}`}>
                      <h2 className="line-clamp-2 min-h-[48px] text-lg font-semibold leading-6 text-gray-900 transition-colors duration-200 group-hover:text-amber-600">
                        {product.name}
                      </h2>
                    </Link>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </p>

                      <Link
                        href={`/singleproduct/${product.id}`}
                        className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                      >
                        View details →
                      </Link>
                    </div>

                    {/* ADD TO CART */}

                    <div className="mt-5">
                      <Shopbutton product={product} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* LOAD MORE */}

          {products.length > 0 && hasMore && (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />

                <span>Loading more products...</span>
              </div>
            </div>
          )}

          {/* END OF PRODUCTS */}

          {products.length > 0 && !hasMore && (
            <div className="py-14 text-center">
              <div className="mx-auto mb-4 h-px w-16 bg-gray-300" />

              <p className="text-sm text-gray-400">
                You&apos;ve reached the end of the collection
              </p>
            </div>
          )}

          <Cartsidebar />
        </main>
      </div>
    </div>
  );
}