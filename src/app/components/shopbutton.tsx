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
        image: product.image,
        price:product.price,
        Qty:1,
        total:product.price * 1
      }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      window.dispatchEvent(new Event('cartChanged'));
    
    }
  };
  
  return (
    <div className="">
      <button
        type="button"
        className="bg-green-500 px-3 py-1 text-sm text-white cursor-pointer"
        onClick={addttoCart}
        >
        
        Add to cart
      </button>
    </div>
  )
}

