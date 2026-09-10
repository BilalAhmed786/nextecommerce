"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CartItem } from "../types/layouttype";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@apollo/client";
import { get_shipments } from "../graphql/product";
import { get_address } from "../graphql/orders";
import axios from "axios";

import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiArrowRight,
  HiCheckCircle,
} from "react-icons/hi";
import { FaMoneyBillWave } from "react-icons/fa";

const stripePromise = loadStripe(
  "pk_test_51NcvwgKgFXig68gS6L70mmG6mn6OYPuyBgpMbqQtRtEwfhvfzjU8Emuh8kHJn9U512rxYValI8Jn6MUxoUtf3D2B00k8kkT6Im"
);

interface Shipment {
  city: string;
  amount: string;
}

interface Address {
  street: string;
  city: string;
  amount: number | null;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: shipmentData } = useQuery(get_shipments);

  const { data: session } = useSession();

  const { data: useraddress } = useQuery(get_address, {
    variables: {
      email: session?.user?.email,
    },
    skip: !session?.user?.email,
  });

  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    amount: null,
    state: "",
    postalCode: "",
    country: "",
  });

  /*
   * LOAD CART
   */
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const cart = storedCart ? JSON.parse(storedCart) : [];

    setCartItems(Array.isArray(cart) ? cart : []);
  }, []);

  /*
   * LOAD USER ADDRESS
   */
  useEffect(() => {
    const savedAddress = useraddress?.address;

    if (!savedAddress) return;

    setGuestEmail(savedAddress.email || "");
    setGuestName(savedAddress.name || "");

    setAddress({
      street: savedAddress.street || "",
      city: savedAddress.city || "",
      amount: savedAddress.amount ?? null,
      state: savedAddress.state || "",
      postalCode: savedAddress.postalCode || "",
      country: savedAddress.country || "",
    });

    if (savedAddress.amount) {
      setShippingCost(Number(savedAddress.amount));
    }
  }, [useraddress]);

  /*
   * TOTALS
   */
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const grandTotal = subTotal + shippingCost;

  /*
   * SHIPPING
   */
  const shippingcharges = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCity = e.target.value;

    const selectedShipment = (
      shipmentData?.shipments as Shipment[] | undefined
    )?.find((shipment) => shipment.city === selectedCity);

    if (selectedShipment) {
      const amount = parseFloat(selectedShipment.amount);

      setAddress((prev) => ({
        ...prev,
        city: selectedCity,
        amount,
      }));

      setShippingCost(amount);
    } else {
      setAddress((prev) => ({
        ...prev,
        city: "",
        amount: null,
      }));

      setShippingCost(0);
    }
  };

  /*
   * PLACE ORDER
   */
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!address.street || !address.city || !address.country) {
      alert("Please fill in the address fields");
      return;
    }

    const userId = null;

    if (!guestName || !guestEmail) {
      alert("Please enter your name and email");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/order", {
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

      if (paymentMethod === "COD") {
        localStorage.removeItem("cart");

        window.dispatchEvent(new Event("cartChanged"));

        alert("Order placed with Cash on Delivery");
      } else {
        const stripe = await stripePromise;

        await stripe?.redirectToCheckout({
          sessionId,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during order creation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 pb-20 mt-32 lg:mt-20 md:mt-32">

      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/2 top-20 -z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* PAGE HEADER */}
        <div className="mb-10 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] shadow-xl shadow-black/10">
            <HiOutlineShoppingBag className="text-2xl text-amber-400" />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            Secure Checkout
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
            Enter your details, choose your delivery location, and select
            your preferred payment method.
          </p>
        </div>

        {/* CHECKOUT GRID */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* CUSTOMER INFORMATION */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                  <HiOutlineUser className="text-xl text-amber-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                    Step 01
                  </p>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Information
                  </h2>
                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* NAME */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Full Name
                  </label>

                  <div className="relative">
                    <HiOutlineUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      placeholder="John Doe"
                      value={guestName}
                      onChange={(e) =>
                        setGuestName(e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email Address
                  </label>

                  <div className="relative">
                    <HiOutlineMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={guestEmail}
                      onChange={(e) =>
                        setGuestEmail(e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* SHIPPING ADDRESS */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                  <HiOutlineLocationMarker className="text-xl text-amber-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                    Step 02
                  </p>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

              </div>

              <div className="space-y-4">

                {/* STREET */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Street Address
                  </label>

                  <input
                    type="text"
                    placeholder="House / Street / Area"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        street: e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>

                {/* CITY + STATE */}
                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                      City
                    </label>

                    <select
                      value={address.city}
                      onChange={shippingcharges}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    >
                      <option value="">
                        Select City
                      </option>

                      {shipmentData?.shipments?.map(
                        (ship: Shipment, index: number) => (
                          <option
                            key={`${ship.city}-${index}`}
                            value={ship.city}
                          >
                            {ship.city}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                      State
                    </label>

                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          state: e.target.value,
                        })
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    />
                  </div>

                </div>

                {/* POSTAL + COUNTRY */}
                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Postal Code
                    </label>

                    <input
                      type="text"
                      placeholder="46000"
                      value={address.postalCode}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          postalCode: e.target.value,
                        })
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Country
                    </label>

                    <input
                      type="text"
                      placeholder="Pakistan"
                      value={address.country}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          country: e.target.value,
                        })
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    />
                  </div>

                </div>

                {/* SHIPPING COST */}
                {address.city && (
                  <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

                    <div className="flex items-center gap-2">
                      <HiCheckCircle className="text-amber-600" />

                      <span className="text-sm font-medium text-gray-700">
                        Delivery to {address.city}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-amber-600">
                      ${shippingCost.toFixed(2)}
                    </span>

                  </div>
                )}

              </div>
            </section>

            {/* PAYMENT */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                  <HiOutlineCreditCard className="text-xl text-amber-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                    Step 03
                  </p>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h2>
                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                    paymentMethod === "COD"
                      ? "border-amber-400 bg-amber-50 ring-4 ring-amber-500/10"
                      : "border-gray-200 bg-gray-50 hover:border-amber-200 hover:bg-white"
                  }`}
                >

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod === "COD"
                        ? "bg-amber-500 text-black"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    <FaMoneyBillWave />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>

                  {paymentMethod === "COD" && (
                    <HiCheckCircle className="absolute right-4 top-4 text-lg text-amber-600" />
                  )}

                </button>

                {/* STRIPE */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("STRIPE")}
                  className={`relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                    paymentMethod === "STRIPE"
                      ? "border-amber-400 bg-amber-50 ring-4 ring-amber-500/10"
                      : "border-gray-200 bg-gray-50 hover:border-amber-200 hover:bg-white"
                  }`}
                >

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod === "STRIPE"
                        ? "bg-amber-500 text-black"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    <HiOutlineCreditCard className="text-xl" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Stripe
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Secure online payment
                    </p>
                  </div>

                  {paymentMethod === "STRIPE" && (
                    <HiCheckCircle className="absolute right-4 top-4 text-lg text-amber-600" />
                  )}

                </button>

              </div>

            </section>

          </div>

          {/* RIGHT SIDE — ORDER SUMMARY */}
          <aside className="lg:sticky lg:top-28 lg:self-start">

            <div className="overflow-hidden rounded-3xl bg-[#111111] text-white shadow-2xl shadow-black/10">

              {/* Summary header */}
              <div className="border-b border-white/10 p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                      Your Order
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Order Summary
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <HiOutlineShoppingBag className="text-xl text-amber-400" />
                  </div>

                </div>

                <p className="mt-3 text-sm text-gray-500">
                  {cartItems.length}{" "}
                  {cartItems.length === 1 ? "item" : "items"} in your bag
                </p>

              </div>

              {/* Items */}
              <div className="max-h-[360px] space-y-3 overflow-y-auto p-5">

                {cartItems.length === 0 ? (
                  <div className="py-10 text-center">

                    <HiOutlineShoppingBag className="mx-auto text-4xl text-gray-700" />

                    <p className="mt-3 text-sm text-gray-500">
                      Your cart is empty
                    </p>

                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                    >

                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-800">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="line-clamp-2 text-sm font-medium text-gray-200">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Qty: {item.Qty}
                        </p>

                      </div>

                      <p className="shrink-0 text-sm font-semibold text-amber-400">
                        ${item.total.toFixed(2)}
                      </p>

                    </div>
                  ))
                )}

              </div>

              {/* Totals */}
              <div className="border-t border-white/10 p-6">

                <div className="space-y-3">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="text-gray-300">
                      ${subTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Shipping
                    </span>

                    <span className="text-gray-300">
                      ${shippingCost.toFixed(2)}
                    </span>
                  </div>

                </div>

                <div className="my-5 h-px bg-white/10" />

                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      Including shipping
                    </p>
                  </div>

                  <p className="text-3xl font-bold text-amber-400">
                    ${grandTotal.toFixed(2)}
                  </p>

                </div>

                {/* PLACE ORDER */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                  className="group mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-amber-500 px-5 py-4 text-sm font-bold text-black transition-all duration-300 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <HiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* SECURITY */}
                <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-500">
                  <HiOutlineShieldCheck className="text-amber-500" />
                  Secure and protected checkout
                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}
