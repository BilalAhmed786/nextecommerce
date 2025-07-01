'use client';

export default function Shopbutton({ product }: { product: any }) {
  const addttoCart = () => {
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];

    const exists = cart.find((item: any) => item.id === product.id);
    if (!exists) {
      const updatedCart = [...cart, {
        id: product.id,
        name: product.name,
        image: product.image
      }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };
  
  return (
    <div className="">
      <button
        type="button"
        className="bg-green-500 px-3 py-1 text-sm text-white"
        onClick={addttoCart}
        >
        
        Add to cart
      </button>
    </div>
  )
}

