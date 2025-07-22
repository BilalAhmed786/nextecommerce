import { Props } from "./decreaseqty";
import { updateCart } from '../helperfunctions/updatecart';
export function removeitem({id,cartItems}:Props){

    const updated = cartItems.filter(item => item.id !== id);
    updateCart({cartItems:updated });
}