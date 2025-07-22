import { CartItem } from "../types/layouttype";
interface Props{
   cartItems:CartItem[]
}
export const updateCart = ({ cartItems }: Props) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
 
    window.dispatchEvent(new Event('cartChanged'));
};