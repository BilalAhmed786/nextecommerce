'use client';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    arrows:false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
      <>
      <h1 className='text-2xl font-bold text-center m-10'>Featured products</h1>
    <div className="w-[320px] md:[w-600px] lg:w-[1000px] m-auto  px-2 mt-10">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <Link href={`/singleproduct/${product.id}`}>
              <div className="bg-white rounded shadow hover:shadow-lg transition duration-300 p-4">
                <div className="h-[200px] md:h-[250px] lg:h-[350px] mb-4 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className='text-center'>
                <h2 className="text-xs md:text-xs lg:text-xs font-extralight truncate">{product.name}</h2>
                <p className="text-blue-600 font-bold">${product.price}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>

    </>
  );
}
