"use client";

import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { HiArrowRight, HiSparkles } from "react-icons/hi";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Props {
  products: Product[];
}

export default function ProductCarousel({ products }: Props) {
  if (!products.length) return null;

  const settings = {
    infinite: products.length > 4,
    speed: 600,
    slidesToShow: Math.min(products.length, 4),
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    autoplay: products.length > 4,
    autoplaySpeed: 3200,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(products.length, 3),
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(products.length, 2),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f7f5] py-16 sm:py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-10 text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            <HiSparkles className="text-sm" />
            Our Collection
          </div>

          <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            Featured{" "}
            <span className="text-amber-500">Products</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore our handpicked collection and discover products worth
            adding to your cart.
          </p>
        </div>

        {/* Carousel */}
        <div className="-mx-2">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="px-2 pb-5">
                <Link
                  href={`/singleproduct/${product.id}`}
                  className="group block"
                >
                  <article className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-500/10">
                    {/* Image area */}
                    <div className="relative h-[270px] overflow-hidden bg-[#f2f2ef] sm:h-[310px] lg:h-[330px]">
                      {/* Decorative circle */}
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/10 bg-amber-400/5 blur-[1px] transition-all duration-700 group-hover:h-60 group-hover:w-60" />

                      {/* Product image */}
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                        className="relative z-10 object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />

                      {/* Featured badge */}
                      <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 shadow-lg">
                        <HiSparkles />
                        Featured
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center bg-linear-to-t from-black/60 to-transparent px-4 pb-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex translate-y-2 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black shadow-xl transition-transform duration-300 group-hover:translate-y-0">
                          View Product
                          <HiArrowRight />
                        </span>
                      </div>
                    </div>

                    {/* Product details */}
                    <div className="p-5">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500">
                        Thrifter&apos;s Point
                      </p>

                      <h3 className="truncate text-sm font-bold text-gray-900 transition-colors duration-300 group-hover:text-amber-600 sm:text-base">
                        {product.name}
                      </h3>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xl font-black text-gray-950">
                          ${product.price}
                        </p>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-300 group-hover:bg-amber-400 group-hover:text-black">
                          <HiArrowRight className="text-sm" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
