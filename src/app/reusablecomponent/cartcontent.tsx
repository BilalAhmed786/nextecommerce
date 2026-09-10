"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaMinus, FaPlus, FaTrashAlt, FaShoppingBag } from "react-icons/fa";
import { usePathname } from "next/navigation";

import { CartItem } from "../types/layouttype";
import Cartnotification from "./cartnotification";
import { increaseCartQty } from "../helperfunctions/increaseqty";
import { decreaseQty } from "../helperfunctions/decreaseqty";
import { SetupCartListener } from "../helperfunctions/eventlistner";
import { removeitem } from "../helperfunctions/removeitem";

export interface Props {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartContents({ setCartItems, cartItems }: Props) {
  const pathname = usePathname();

  const pathSegments = pathname?.split("/");
  const lastSegment = pathSegments?.pop() || pathSegments?.pop();

  const [valid, setValid] = useState("");

  useEffect(() => {
    const cleanup = SetupCartListener(setCartItems);

    return cleanup;
  }, [setCartItems]);

  const grandTotal = cartItems
    .reduce((sum, item) => sum + item.total, 0)
    .toFixed(2);

  const isCartPage = lastSegment === "cart";

  return (
    <div className="w-full">
      {/* EMPTY CART */}
      {cartItems.length === 0 ? (
        <div
          className={`flex min-h-[420px] flex-col items-center justify-center px-6 text-center ${
            isCartPage ? "bg-white" : ""
          }`}
        >
          <div
            className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${
              isCartPage
                ? "bg-amber-50 ring-1 ring-amber-100"
                : "bg-white/5 ring-1 ring-white/10"
            }`}
          >
            <FaShoppingBag
              className={`text-3xl ${
                isCartPage ? "text-amber-500" : "text-amber-400"
              }`}
            />
          </div>

          <h3
            className={`text-xl font-semibold ${
              isCartPage ? "text-gray-900" : "text-white"
            }`}
          >
            Your shopping bag is empty
          </h3>

          <p
            className={`mt-2 max-w-xs text-sm leading-6 ${
              isCartPage ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Looks like you haven&apos;t added anything to your bag yet. Explore
            our collection and find something you love.
          </p>
        </div>
      ) : (
        <div className="px-2 pb-6 sm:px-4">
          {/* CART ITEMS */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`group relative rounded-2xl border p-4 transition-all duration-300 ${
                  isCartPage
                    ? "border-gray-200 bg-white shadow-sm hover:border-amber-200 hover:shadow-md"
                    : "border-white/10 bg-white/[0.05] hover:border-amber-500/30 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex gap-4">
                  {/* PRODUCT IMAGE */}
                  <div
                    className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl ${
                      isCartPage ? "bg-gray-100" : "bg-gray-800"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3
                          className={`line-clamp-2 text-sm font-semibold leading-5 ${
                            isCartPage ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {item.name}
                        </h3>

                        <p
                          className={`mt-1 text-xs ${
                            isCartPage ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          ${item.price} each
                        </p>
                      </div>

                      {/* REMOVE */}
                      <button
                        type="button"
                        onClick={() =>
                          removeitem({
                            id: item.id,
                            cartItems,
                          })
                        }
                        aria-label={`Remove ${item.name}`}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                          isCartPage
                            ? "text-gray-400 hover:bg-red-50 hover:text-red-500"
                            : "text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                        }`}
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      {/* QUANTITY */}
                      <div
                        className={`flex h-9 shrink-0 items-center overflow-hidden rounded-xl border ${
                          isCartPage
                            ? "border-gray-200 bg-gray-50"
                            : "border-white/10 bg-black/20"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQty({
                              id: item.id,
                              cartItems,
                            })
                          }
                          aria-label="Decrease quantity"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                            isCartPage
                              ? "text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                              : "text-gray-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <FaMinus className="text-[9px]" />
                        </button>

                        <span
                          className={`flex h-9 min-w-10 shrink-0 items-center justify-center border-x text-sm font-semibold ${
                            isCartPage
                              ? "border-gray-200 bg-white text-gray-900"
                              : "border-white/10 text-white"
                          }`}
                        >
                          {item.Qty}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseCartQty({
                              id: item.id,
                              cartItems,
                              setValid,
                            })
                          }
                          aria-label="Increase quantity"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                            isCartPage
                              ? "text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                              : "text-gray-400 hover:bg-white/10 hover:text-amber-400"
                          }`}
                        >
                          <FaPlus className="text-[9px]" />
                        </button>
                      </div>

                      {/* TOTAL */}
                      <p
                        className={`shrink-0 text-base font-bold ${
                          isCartPage ? "text-gray-900" : "text-amber-400"
                        }`}
                      >
                        ${item.total}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div
            className={`mt-6 rounded-2xl border p-5 ${
              isCartPage
                ? "border-gray-200 bg-gray-50"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  isCartPage ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Subtotal
              </span>

              <span
                className={`text-sm ${
                  isCartPage ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div
              className={`my-4 h-px ${
                isCartPage ? "bg-gray-200" : "bg-white/10"
              }`}
            />

            <div className="flex items-center justify-between">
              <span
                className={`text-base font-semibold ${
                  isCartPage ? "text-gray-900" : "text-white"
                }`}
              >
                Total
              </span>

              <span className="text-2xl font-bold text-amber-500">
                ${grandTotal}
              </span>
            </div>

            <p
              className={`mt-2 text-right text-[10px] ${
                isCartPage ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Taxes and shipping calculated at checkout
            </p>
          </div>
        </div>
      )}

      <Cartnotification valid={valid} setValid={setValid} />
    </div>
  );
}
