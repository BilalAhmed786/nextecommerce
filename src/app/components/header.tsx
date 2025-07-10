import Link from "next/link";
import Cart from "./Cart";
import Hamburger from "./hamburger";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 w-full">
      <div className="flex w-full justify-between items-center px-5">
        <h2 className="text-sm md:text-sm lg:text-2xl font-bold">Thrifters point</h2>
        <nav className="hidden lg:flex items-center gap-6">
          <Link className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200" href="/">
            Shop
          </Link>
          <Link className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200" href="/cart">
            Cart
          </Link>
          <Link className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200" href="/checkout">
            Checkout
          </Link>
          <Link className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200" href="/authorize/admin/allproducts">
            Dashboard
          </Link>
        </nav>

        <div className="ml-4 hover:scale-110 hover:text-green-200 transition-transform duration-200">
          <Cart />
        </div>
      </div>
      <div className="w-full">
      <Hamburger />
      </div>
    </header>
  );
}
