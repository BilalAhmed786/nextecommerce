'use client';

import { useQuery } from '@apollo/client';
import { get_single_order } from '@/app/graphql/orders';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
FaArrowLeft,
FaBoxOpen,
FaCheckCircle,
FaClock,
FaMapMarkerAlt,
FaCreditCard,
FaReceipt,
FaTruck,
FaTimesCircle,
} from 'react-icons/fa';

export default function OrderDetailPage() {
const { id } = useParams() as { id: string };
const router = useRouter();

const { data, loading, error } = useQuery(get_single_order, {
variables: { id },
});

if (loading) {
return ( <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-4"> <div className="text-center"> <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500" /> <p className="text-sm font-medium text-gray-500">
Loading your order... </p> </div> </div>
);
}

if (error) {
return ( <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-4"> <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm"> <FaTimesCircle className="mx-auto mb-4 text-4xl text-red-500" /> <h2 className="text-xl font-bold text-gray-900">
Unable to load order </h2> <p className="mt-2 text-sm text-gray-500">{error.message}</p>


      <button
        onClick={() => router.back()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-black"
      >
        <FaArrowLeft />
        Go Back
      </button>
    </div>
  </div>
);


}

const order = data?.order;

if (!order) {
return ( <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-4"> <div className="text-center"> <FaBoxOpen className="mx-auto mb-4 text-5xl text-gray-300" /> <h2 className="text-2xl font-bold text-gray-900">
Order not found </h2> <p className="mt-2 text-gray-500">
We could not find this order. </p>


      <button
        onClick={() => router.back()}
        className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-black"
      >
        Back to Orders
      </button>
    </div>
  </div>
);


}

const formattedDate =
order.createdAt && !isNaN(Number(order.createdAt))
? new Date(Number(order.createdAt)).toLocaleDateString('en-US', {
day: 'numeric',
month: 'long',
year: 'numeric',
})
: 'N/A';

const status = order.status?.toUpperCase();

const getStatusStyles = () => {
if (status === 'DELIVERED') {
return {
icon: <FaCheckCircle />,
className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};
}


if (status === 'CANCELLED') {
  return {
    icon: <FaTimesCircle />,
    className: 'bg-red-50 text-red-700 border-red-200',
  };
}

if (status === 'SHIPPED') {
  return {
    icon: <FaTruck />,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  };
}

return {
  icon: <FaClock />,
  className: 'bg-amber-50 text-amber-700 border-amber-200',
};


};

const statusStyle = getStatusStyles();

const orderTotal = Number(order.total || 0);
const shippingCost = Number(order.shippingCost || 0);

return ( <div className="min-h-screen bg-[#f7f7f5] p-4 mt-32 lg:mt-20 sm:mt-32"> <div className="mx-auto max-w-6xl">


    {/* Header */}
    <div className="mb-8">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black"
      >
        <FaArrowLeft />
        Back to Orders
      </button>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            <FaReceipt />
            Your Order
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Order Details
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review your order, payment and delivery information.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${statusStyle.className}`}
        >
          {statusStyle.icon}
          {status || 'PENDING'}
        </div>
      </div>
    </div>

    {/* Top Summary */}
    <div className="grid gap-5 lg:grid-cols-3">

      {/* Order Information */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <FaReceipt />
          </div>

          <div>
            <h2 className="font-bold text-gray-950">
              Order Summary
            </h2>
            <p className="text-xs text-gray-400">
              Order information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Order ID
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-gray-900">
              {order.id}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-sm text-gray-500">
              Payment
            </span>
            <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800">
              {order.payment}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Placed On
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <FaMapMarkerAlt />
          </div>

          <div>
            <h2 className="font-bold text-gray-950">
              Shipping Address
            </h2>
            <p className="text-xs text-gray-400">
              Delivery information
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-lg font-bold text-gray-950">
            {order.address?.name}
          </p>

          <p className="text-gray-500">
            {order.address?.email}
          </p>

          <div className="border-t border-gray-100 pt-4">
            <p className="font-semibold text-gray-900">
              {order.address?.street}
            </p>

            <p className="mt-1 text-gray-500">
              {order.address?.city}
            </p>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] p-6 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />

        <div className="relative">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-black">
              <FaCreditCard />
            </div>

            <div>
              <h2 className="font-bold">
                Payment Summary
              </h2>
              <p className="text-xs text-gray-500">
                Final order amount
              </p>
            </div>
          </div>

          <div className="space-y-4 border-b border-white/10 pb-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                Shipping
              </span>
              <span>
                ${shippingCost.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-5">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Total Paid
            </p>

            <p className="mt-2 text-4xl font-black text-amber-400">
              ${orderTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Items */}
    <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              Your Selection
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Order Items
            </h2>
          </div>

          <div className="hidden rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 sm:block">
            {order.orderItems?.length || 0} Items
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {order.orderItems?.map((item: any, index: number) => {
          const itemTotal =
            Number(item.price || 0) *
            Number(item.quantity || 0);

          return (
            <div
              key={index}
              className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:p-6"
            >
              {/* Product Image */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="96px"
                  className="object-cover transition duration-500 hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-gray-950 sm:text-lg">
                  {item.product.name}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    Qty: {item.quantity}
                  </span>

                  <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    ${Number(item.price || 0).toFixed(2)} each
                  </span>
                </div>
              </div>

              {/* Item Total */}
              <div className="sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Item Total
                </p>

                <p className="mt-1 text-xl font-black text-gray-950">
                  ${itemTotal.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Total */}
      <div className="flex flex-col gap-3 border-t border-gray-100 bg-[#fafafa] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-bold text-gray-950">
            Order Total
          </p>
          <p className="text-xs text-gray-400">
            Including shipping charges
          </p>
        </div>

        <p className="text-3xl font-black text-gray-950">
          ${orderTotal.toFixed(2)}
        </p>
      </div>
    </div>

    {/* Bottom Trust Strip */}
    <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FaCheckCircle />
        </div>

        <div>
          <p className="text-sm font-bold text-gray-900">
            Order information is secure
          </p>
          <p className="text-xs text-gray-500">
            Thank you for shopping with us.
          </p>
        </div>
      </div>

      <button
        onClick={() => router.back()}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-black"
      >
        <FaArrowLeft />
        Back to Orders
      </button>
    </div>
  </div>
</div>


);
}
