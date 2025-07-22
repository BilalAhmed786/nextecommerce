'use client';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import InnerImageZoom from 'react-inner-image-zoom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-inner-image-zoom/lib/styles.min.css';

interface Props {
  images: string[];
}

export default function ProductSlider({ images }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const zoomType = isMobile ? 'click' : 'hover';

  const settings = { infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 };

  return (
    <div className="w-[320px] sm:w-[500px] md:w-[750px] lg:w-[450px]">
      <Slider {...settings}>
        {images.map((img, i) => (
          <div key={i} className="p-2">
            <InnerImageZoom
              src={img}
              zoomType={zoomType}
              zoomScale={1.5}
              zoomPreload={true}
              className={isMobile ? 'no-lens' : ''}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
