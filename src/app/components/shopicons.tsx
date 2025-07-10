'use client'
import { FaEye, FaCartPlus } from 'react-icons/fa';
import Link from 'next/link';
const shopicons = ({ product }: { product: any }) => {

    const addttoCart = () => {

        const storedCart = localStorage.getItem('cart');
        const cart = storedCart ? JSON.parse(storedCart) : [];

        const exists = cart.find((item: any) => item.id === product.id);
        if (!exists) {
            const updatedCart = [...cart, {
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                Qty: 1,
                total: product.price * 1
            }];
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            window.dispatchEvent(new Event('cartChanged'));

        }
    };



    return (
        <div className="absolute opacity-0 group-hover:opacity-100 group-hover:translate-y-2 group-hover:scale-1.2 top-1/2 left-1/2 flex gap-3 -translate-x-1/2 transition-all duration-700 ease-in-out z-10">
           <Link href={`/singleproduct/${product.id}`}>
           <FaEye className="text-3xl  text-red-700 bg-gray-300 px-1 rounded-full hover:text-blue-500 cursor-pointer transition duration-300" />
           </Link>
            <FaCartPlus
                className="text-3xl  text-red-700 bg-gray-300 px-1 rounded-full hover:text-blue-500 cursor-pointer transition duration-300"
                onClick={addttoCart}
            />
        </div>
    )
}

export default shopicons