'use client'
import React, { useEffect, useState } from 'react'


const ProductQty = ({ product }: { product: any }) => {
  const [productQty, setQty] = useState(1)

  useEffect(() => {
    const cart = localStorage.getItem('cart')
    const parsedCart =cart? JSON.parse(cart): []

    const updatedCart = parsedCart.map((item: any) => {
      if (item.id === product.id) {
        return {
          ...item,
          Qty: productQty,
          total: productQty * item.price,
        }
      }
      return item
    })

    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }, [productQty])

  const handleDecrement = () => {
    setQty(prev => (prev > 1 ? prev - 1 : prev))
  }

  const handleIncrement = () => {
    const cart = localStorage.getItem('cart')
    const parsedCart = cart? JSON.parse(cart):[]
    const exists = parsedCart.some((item: any) => item.id === product.id)
  if (exists) {
    
      setQty(prev => prev + 1)
    }
  }

  return (
    <div className="flex gap-3">
      <button onClick={handleDecrement}>-</button>
      {productQty}
      <button onClick={handleIncrement}>+</button>
    </div>
  )
}

export default ProductQty
