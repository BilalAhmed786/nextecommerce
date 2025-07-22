import { CartItem } from '../types/layouttype';

export function SetupCartListener(
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) {
  const fetchCart = () => {
    const stored = localStorage.getItem('cart');
    setCartItems(stored ? JSON.parse(stored) : []);
  };


  fetchCart();

 
   window.addEventListener('cartChanged', fetchCart);

  return () => {
    window.removeEventListener('cartChanged', fetchCart);
  };
}
