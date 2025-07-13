'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CartItem } from '../types/layouttype';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery, useMutation } from '@apollo/client';
import { get_shipments } from '../graphql/product';
import axios from 'axios';
const stripePromise = loadStripe('pk_test_51NcvwgKgFXig68gS6L70mmG6mn6OYPuyBgpMbqQtRtEwfhvfzjU8Emuh8kHJn9U512rxYValI8Jn6MUxoUtf3D2B00k8kkT6Im');

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const { data } = useQuery(get_shipments);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    amount: null,
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(cart);
  }, []);

  const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = subTotal + shippingCost;


  const shippingcharges = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const selectedCity = e.target.value;

    const selectedShipment = data?.shipments?.find((s: any) => s.city === selectedCity);

    if (selectedShipment) {
      setAddress({ ...address, city: selectedCity, amount: selectedShipment.amount });
      setShippingCost(parseFloat(selectedShipment.amount));
    } else {

      setAddress({ ...address, city: '', amount: null });
      setShippingCost(0);
    }


  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (!address.street || !address.city || !address.country) {
      alert('Please fill in the address fields');
      return;
    }

    const userId = null; // Replace with auth if needed
    if (!guestName || !guestEmail) {
      alert('Please enter your name and email');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      const res = await axios.post('/api/order', {
        userId,
        guestName,
        guestEmail,
        cartItems,
        address,
        subTotal,
        shippingCost,
        total: grandTotal,
        paymentMethod,
      });

      const { sessionId } = res.data;

      if (paymentMethod === 'COD') {
        localStorage.removeItem('cart');
        window.dispatchEvent( new Event('cartChanged'))
        alert('Order placed with Cash on Delivery');
      } else {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId });
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong during order creation');
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {/* Guest Info */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Info</h2>
        <input
          type="text"
          placeholder="Name"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={guestEmail}
          onChange={e => setGuestEmail(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      {/* Address */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <input
          type="text"
          placeholder="Street"
          value={address.street}
          onChange={e => setAddress({ ...address, street: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <select
          value={address.city}
          className="border p-2 w-full mb-2"
          onChange={shippingcharges}
        >
          <option value="">Select City</option>
          {data?.shipments?.map((ship: any, index: number) => (
            <option key={index} value={ship.city}>
              {ship.city}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="State"
          value={address.state}
          onChange={e => setAddress({ ...address, state: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={e =>
            setAddress({ ...address, postalCode: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Country"
          value={address.country}
          onChange={e => setAddress({ ...address, country: e.target.value })}
          className="border p-2 w-full"
        />
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={e => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="STRIPE"
              checked={paymentMethod === 'STRIPE'}
              onChange={e => setPaymentMethod(e.target.value)}
            />
            Stripe
          </label>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        {cartItems.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-3"
          >
            <div className="flex items-center gap-4">
              <Image
                src={item.image}
                alt={item.name}
                width={60}
                height={60}
                className="rounded object-cover"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.Qty}</p>
              </div>
            </div>
            <div className="text-right">
              <p>${item.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
        <div className="text-right mt-4">
          <p className="text-base">Subtotal: ${subTotal.toFixed(2)}</p>
          <p className="text-base">Shipping: ${shippingCost.toFixed(2)}</p>
          <p className="text-lg font-semibold mt-1">
            Total: ${grandTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Place Order */}
      <div className="text-right">
        <button
          onClick={handlePlaceOrder}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
