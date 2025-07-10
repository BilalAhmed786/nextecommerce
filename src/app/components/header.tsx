import Link from "next/link";
import Cart from "./Cart";
import Hamburger from "./hamburger";
export default function Header() {
  return (
    
    <header className="bg-blue-600 text-white p-4">
      <div className="flex justify-between p-4">
      <h1 className="textxs md:text-sm lg:text-2xl font-bold">Thrifter's Point</h1>

    <nav className="hidden md:hidden lg:flex  justify-evenly w-[32%] transition all 3s ease-in">

    <Link className="font-extralight hover:text-green-200 hover:scale-110 transition-transform duration-200" href={'/'}>Shop</Link>
    <Link className="font-extralight hover:text-green-200 hover:scale-110 transition-transform duration-200" href={'/cart'}>Cart</Link>
    <Link className="font-extralight hover:text-green-200 hover:scale-110 transition-transform duration-200" href={'/checkout'}>Checkout</Link>
    <Link className="font-extralight hover:text-green-200 hover:scale-110 transition-transform duration-200" href={'/authorize/admin/allproducts'}>Dashboard</Link>

    </nav>

    <Hamburger/>
    



        <div className="hover:scale-110 hover:text-green-200 transition-transform duration-200"><Cart/></div>
      </div>
    </header>
  );
}