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
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const { data: categories } = useQuery(get_category);
  const { data: pricefilter } = useQuery(get_price_filter);
  const searchParams = useSearchParams();

  const { minPrice, maxPrice } = parsePriceRange(price);

  // Update filters from query params
  useEffect(() => {
    setCategory(searchParams?.get("category") ?? null);
    setPrice(searchParams?.get("price") ?? null);
    setSearch(searchParams?.get("search") ?? null);
  }, [searchParams]);

  const [loadProducts, { loading }] = useLazyQuery(get_products, {
    onCompleted: (res) => {
      setInitialLoadDone(true);

      if (!res?.products?.length) {
        setHasMore(false);
        if (skip === 0) setProducts([]); // explicitly set empty on first load
        return;
      }

      setProducts((prev) => [...prev, ...res.products]);
      setSkip((prev) => prev + 3);
    },
    fetchPolicy: "network-only",
  });

  // Reset products on filter change
  useEffect(() => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);
    setInitialLoadDone(false);

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

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !loading &&
        products.length > 0 // 🔹 only scroll if we have some products
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
  }, [skip, hasMore, loading, category, price, search, products]);

  return (
    <div className="flex m-5 min-h-screen">
      {/* Sidebar always separate */}
      <Sidebar categories={categories?.categories} priceRanges={pricefilter} />

      <main className="flex-1 m-5">
        {loading && products.length === 0 && (
          <p className="text-center mt-10">Loading products...</p>
        )}

        {!loading && initialLoadDone && products.length === 0 && (
          <p className="flex flex-col h-screen justify-center items-center text-black">No products found</p>
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

        {/* Cart Sidebar */}
        <Cartsidebar />
      </main>
    </div>
  );
}