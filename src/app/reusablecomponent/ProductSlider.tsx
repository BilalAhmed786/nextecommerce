"use client";

import { useState } from "react";
import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePhotograph,
} from "react-icons/hi";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-inner-image-zoom/lib/styles.min.css";

interface Props {
  images: string[];
}

export default function ProductSlider({ images }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);

  const validImages = images.filter(Boolean);

  if (!validImages.length) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center rounded-3xl bg-gray-100">
        <HiOutlinePhotograph className="text-5xl text-gray-300" />
      </div>
    );
  }

  const settings = {
    infinite: validImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    adaptiveHeight: false,

    beforeChange: (_current: number, next: number) => {
      setActiveSlide(next);
    },

    prevArrow: (
      <button
        type="button"
        aria-label="Previous image"
        className="z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 text-gray-900 shadow-lg backdrop-blur transition-all duration-300 hover:bg-amber-400 hover:text-black"
      >
        <HiChevronLeft className="text-xl" />
      </button>
    ) as unknown as React.ReactElement,

    nextArrow: (
      <button
        type="button"
        aria-label="Next image"
        className="z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 text-gray-900 shadow-lg backdrop-blur transition-all duration-300 hover:bg-amber-400 hover:text-black"
      >
        <HiChevronRight className="text-xl" />
      </button>
    ) as unknown as React.ReactElement,
  };

  return (
    <div className="w-full max-w-[520px]">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
        {/* Image counter */}
        <div className="absolute right-5 top-5 z-20 rounded-full border border-white/60 bg-black/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          {activeSlide + 1} / {validImages.length}
        </div>

        <div className="overflow-hidden rounded-2xl bg-[#f5f5f2]">
          <Slider {...settings}>
            {validImages.map((image, index) => (
              <div key={`${image}-${index}`}>
                <div className="flex h-[280px] items-center justify-center p-6 sm:h-[450px]">
                  <InnerImageZoom
                    src={image}
                    zoomType="hover"
                    zoomScale={1.5}
                    zoomPreload
                    className="h-full w-full"
                    hideHint
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {validImages.slice(0, 5).map((image, index) => (
            <button
              key={`${image}-thumbnail`}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`group relative h-20 overflow-hidden rounded-xl border-2 bg-white p-1 transition-all duration-300 sm:h-24 ${
                activeSlide === index
                  ? "border-amber-400 shadow-lg shadow-amber-400/10"
                  : "border-gray-200 hover:border-amber-300"
              }`}
              aria-label={`View product image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                className="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
              />

              {activeSlide === index && (
                <span className="absolute bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-amber-400" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Gallery information */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <HiOutlinePhotograph className="text-amber-500" />
        <span>Hover over the image to zoom</span>
      </div>
    </div>
  );
}
