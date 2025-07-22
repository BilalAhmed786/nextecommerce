import { CartItem } from '../types/layouttype';
import { updateCart } from '../helperfunctions/updatecart';
export interface Props{
id:string
cartItems:CartItem[]


}
  export function decreaseQty({id,cartItems}:Props){
   
   const updated = cartItems.map(item =>
      item.id === id && item.Qty > 1
        ? { ...item, Qty: item.Qty - 1, total: item.price * (item.Qty - 1) }
        : item
    );
    updateCart({cartItems:updated});
  };
