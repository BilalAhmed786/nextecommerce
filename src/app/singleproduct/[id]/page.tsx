import { getClient } from "../../lib/apolloSSR";
import { getsingle_product, get_products } from "@/app/graphql/product";
import ProductSlider from "../../reusablecomponent/ProductSlider";
import Shopbutton from "@/app/reusablecomponent/shopbutton";
import ProductQty from "@/app/components/productsinglepage/ProductQty";
import MultiProductSlider from "@/app/reusablecomponent/featuredproducts";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineShoppingBag,
  HiArrowLeft,
  HiSparkles,
} from "react-icons/hi";
import Link from "next/link";

interface ProductImage {
  url: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: ProductImage[];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = getClient();

  const [{ data }, { data: allproducts }] = await Promise.all([
    client.query({
      query: getsingle_product,
      variables: { id },
      fetchPolicy: "no-cache",
    }),

    client.query({
      query: get_products,
    }),
  ]);

  const product: Product | null = data?.getSingleproduct ?? null;

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <HiOutlineShoppingBag className="text-3xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sorry, we couldn&apos;t find the product you&apos;re looking for.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-black"
          >
            <HiArrowLeft />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const products: Product[] = allproducts?.products ?? [];

  const featuredproducts = products.filter(
    (item) => item.id !== id
  );

  const gallery = [
    product.image,
    ...product.images.map((image) => image.url),
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f5] pb-20">
      {/* Hero background */}
      <section className="relative overflow-hidden">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-amber-400/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-amber-400/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-20">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="transition-colors hover:text-amber-600"
            >
              Shop
            </Link>

            <span>/</span>

            <span className="max-w-[220px] truncate text-gray-900">
              {product.name}
            </span>
          </div>

          {/* Main product card */}
          <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-gray-200/50">
            <div className="grid lg:grid-cols-2">
              {/* ================= IMAGE SIDE ================= */}
              <div className="relative min-h-[480px] bg-[#f1f1ee] p-5 sm:p-8 lg:min-h-[650px]">
                {/* Product badge */}
                <div className="absolute left-7 top-7 z-10 flex items-center gap-2 rounded-full border border-amber-300/40 bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-400 shadow-lg">
                  <HiSparkles />
                  Featured
                </div>

                {/* Decorative circle */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/10" />

                <div className="relative flex h-full min-h-[450px] items-center justify-center">
                  <ProductSlider images={gallery} />
                </div>
              </div>

              {/* ================= DETAILS SIDE ================= */}
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                {/* Small label */}
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                  Thrifter&apos;s Point
                </p>

                {/* Product name */}
                <h1 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-8 flex items-end gap-3">
                  <span className="text-4xl font-black tracking-tight text-gray-950">
                    ${product.price}
                  </span>

                  <span className="mb-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                    Available
                  </span>
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-gray-200" />

                {/* Quantity + Add to cart */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Quantity
                  </p>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-1">
                      <ProductQty product={product} />
                    </div>

                    <div className="flex-1">
                      <Shopbutton product={product} />
                    </div>
                  </div>
                </div>

                {/* Trust features */}
                <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <HiOutlineTruck className="text-xl text-amber-600" />

                    <p className="mt-2 text-xs font-bold text-gray-900">
                      Fast Delivery
                    </p>

                    <p className="mt-1 text-[11px] text-gray-500">
                      Quick & reliable
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <HiOutlineShieldCheck className="text-xl text-amber-600" />

                    <p className="mt-2 text-xs font-bold text-gray-900">
                      Secure Payment
                    </p>

                    <p className="mt-1 text-[11px] text-gray-500">
                      100% protected
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <HiOutlineRefresh className="text-xl text-amber-600" />

                    <p className="mt-2 text-xs font-bold text-gray-900">
                      Easy Returns
                    </p>

                    <p className="mt-1 text-[11px] text-gray-500">
                      Shop with confidence
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom guarantee strip */}
            <div className="border-t border-gray-200 bg-[#111111] px-6 py-5 sm:px-10">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                    <HiOutlineShieldCheck className="text-lg" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white">
                      Shop with confidence
                    </p>

                    <p className="text-[11px] text-gray-500">
                      Your satisfaction is our priority
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Product available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      {featuredproducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                You may also like
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
                More to Explore
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Discover more products from our collection.
              </p>
            </div>

            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-amber-600"
            >
              View all
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <MultiProductSlider products={featuredproducts} />
        </section>
      )}
    </main>
  );
}
