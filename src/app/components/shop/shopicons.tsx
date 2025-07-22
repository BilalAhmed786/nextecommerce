'use client'
import { FaEye, FaCartPlus } from 'react-icons/fa';
import Link from 'next/link';
import { addtocart} from '../../helperfunctions/addtocart';
const shopicons = ({ product }: { product: any }) => {

   return (
        <div className="absolute opacity-0 group-hover:opacity-100 group-hover:translate-y-3 group-hover:scale-1.2 top-1/2 left-1/2 flex gap-3 -translate-x-1/2 transition-all duration-700 ease-in-out z-10">
            <Link href={`/singleproduct/${product.id}`}>
                <FaEye className="text-4xl text-amber-700 bg-white px-2 rounded-full hover:text-amber-500 cursor-pointer transition duration-300" />
            </Link>
            <FaCartPlus
                className="text-4xl  text-amber-700 bg-white px-2 rounded-full hover:text-amber -500 cursor-pointer transition duration-300"
                onClick={()=>addtocart(product)}
            />
        </div>
    )
}

export default shopicons