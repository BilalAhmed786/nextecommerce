import { updateCart } from '../helperfunctions/updatecart';
import { CartItem } from '../types/layouttype';

interface Props {
id:string
cartItems:CartItem[]
setValid:React.Dispatch<React.SetStateAction<string>>

}

export function increaseCartQty({id,cartItems,setValid}:Props) {
  
    
const find = cartItems.find((items)=>items.id === id)
 console.log(find)
      if(!find){

        setValid('item is not in cart')
      }

  const updated = cartItems.map(item =>
    item.id === id && item.stock > item.Qty
      ? { ...item, Qty: item.Qty + 1, total: item.price * (item.Qty + 1) }
      : item
  );

   updateCart({cartItems:updated})

  const valid = updated.some(item => item.id === id && item.Qty === item.stock);
  if (valid) {
    setValid('no more items available');
  }
}