'use client';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

interface Props {
  images: string[];
}

export default function ProductSlider({ images }: Props) {
  
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="w-[320px] md:w-[750px] lg:w-[300px]">
     <Slider {...settings}>
        {images.map((img, i) => (
          <div key={i} className="h-[500px] md:h-[600px] lg:h-[400px] relative outline-0">
            <Image
              src={img}
              alt={`img-${i}`}
              fill
              className="object-fill"
              
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
