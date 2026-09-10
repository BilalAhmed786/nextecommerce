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
        <div className="w-full max-w-md text-center">
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
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f5] pb-12 sm:pb-20 mt-16">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-[90px] sm:-left-40 sm:h-96 sm:w-96" />

        <div className="pointer-events-none absolute -right-32 top-32 h-64 w-64 rounded-full bg-amber-400/10 blur-[90px] sm:-right-40 sm:h-96 sm:w-96" />

        <div className="relative mx-auto w-full max-w-7xl px-3 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">

          {/* Breadcrumb */}
          <div className="mb-5 flex min-w-0 items-center gap-2 overflow-hidden text-xs text-gray-500 sm:mb-8 sm:text-sm">
            <Link
              href="/"
              className="shrink-0 transition-colors hover:text-amber-600"
            >
              Shop
            </Link>

            <span className="shrink-0">/</span>

            <span className="min-w-0 truncate text-gray-900">
              {product.name}
            </span>
          </div>

          {/* ================= PRODUCT CONTAINER ================= */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/40 sm:rounded-[2rem] sm:shadow-xl">

            <div className="grid min-w-0 lg:grid-cols-2">

              {/* ================= IMAGE ================= */}
              <div className="relative min-w-0 overflow-hidden bg-[#f1f1ee] p-3 sm:p-6 lg:p-8">

                {/* Badge */}
                <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 shadow-lg sm:left-7 sm:top-7 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                  <HiSparkles />
                  Featured
                </div>

                {/* Decorative circle */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/10" />

                {/* Slider wrapper */}
                <div className="relative z-10 flex min-h-[300px] w-full items-center justify-center sm:min-h-[420px] lg:min-h-[560px]">
                  <div className="w-full max-w-full">
                    <ProductSlider images={gallery} />
                  </div>
                </div>
              </div>

              {/* ================= DETAILS ================= */}
              <div className="min-w-0 p-5 sm:p-8 md:p-10 lg:flex lg:flex-col lg:justify-center lg:p-12 xl:p-14">

                {/* Brand */}
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
                  Thrifter&apos;s Point
                </p>

                {/* Product name */}
                <h1 className="break-words text-2xl font-black leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:mt-6 sm:text-base sm:leading-7">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
                  <span className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                    ${Number(product.price).toFixed(2)}
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-600 sm:text-xs">
                    Available
                  </span>
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-gray-200 sm:my-8" />

                {/* Quantity */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Quantity
                  </p>

                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">

                    {/* Quantity selector */}
                    <div className="w-fit rounded-xl border border-gray-200 bg-gray-50 p-1">
                      <ProductQty product={product} />
                    </div>

                    {/* Add button */}
                    <div className="w-full min-w-0 sm:flex-1">
                      <Shopbutton product={product} />
                    </div>

                  </div>
                </div>

                {/* Trust features */}
                <div className="mt-7 grid grid-cols-1 gap-2.5 sm:mt-9 sm:grid-cols-3 sm:gap-3">

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:block sm:p-4">
                    <HiOutlineTruck className="shrink-0 text-xl text-amber-600" />

                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Fast Delivery
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-[11px]">
                        Quick & reliable
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:block sm:p-4">
                    <HiOutlineShieldCheck className="shrink-0 text-xl text-amber-600" />

                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Secure Payment
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-[11px]">
                        100% protected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:block sm:p-4">
                    <HiOutlineRefresh className="shrink-0 text-xl text-amber-600" />

                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Easy Returns
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-[11px]">
                        Shop with confidence
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* ================= GUARANTEE ================= */}
            <div className="border-t border-gray-200 bg-[#111111] px-4 py-4 sm:px-8 sm:py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                    <HiOutlineShieldCheck className="text-lg" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white">
                      Shop with confidence
                    </p>

                    <p className="text-[10px] text-gray-500 sm:text-[11px]">
                      Your satisfaction is our priority
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-12 text-[10px] text-gray-500 sm:pl-0 sm:text-xs">
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
        <section className="mx-auto w-full max-w-7xl px-3 pt-12 sm:px-6 sm:pt-16 lg:px-8">

          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 sm:text-xs sm:tracking-[0.25em]">
                You may also like
              </p>

              <h2 className="mt-1.5 text-2xl font-black tracking-tight text-gray-950 sm:mt-2 sm:text-3xl">
                More to Explore
              </h2>

              <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm">
                Discover more products from our collection.
              </p>
            </div>

            <Link
              href="/"
              className="group inline-flex w-fit items-center gap-2 text-xs font-semibold text-gray-700 transition-colors hover:text-amber-600 sm:text-sm"
            >
              View all

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

          </div>

          <div className="w-full min-w-0 overflow-hidden">
            <MultiProductSlider products={featuredproducts} />
          </div>

        </section>
      )}

    </main>
  );
}