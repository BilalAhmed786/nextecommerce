"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "next/navigation";
import {
get_single_order,
update_order_status,
} from "@/app/graphql/orders";
import {
FaUser,
FaEnvelope,
FaMapMarkerAlt,
FaCreditCard,
FaTruck,
FaBoxOpen,
FaCalendarAlt,
FaCheckCircle,
FaClock,
FaTimesCircle,
FaShippingFast,
} from "react-icons/fa";

export default function OrderDetailPage() {
const params = useParams();
const id = params?.id as string;

const { data, loading, error, refetch } = useQuery(get_single_order, {
variables: { id },
});

const [updateStatus, { loading: updatingStatus }] = useMutation(
update_order_status,
{
onCompleted: () => refetch(),
}
);

const handleStatusChange = (
e: React.ChangeEvent<HTMLSelectElement>
) => {
updateStatus({
variables: {
id,
status: e.target.value,
},
});
};

const statusOptions = [
"PENDING",
"SHIPPED",
"DELIVERED",
"CANCELLED",
];

if (loading) {
return ( <div className="min-h-screen bg-[#f5f5f3] px-4 py-10"> <div className="mx-auto mt-20 max-w-6xl animate-pulse"> <div className="h-8 w-60 rounded bg-gray-200" /> <div className="mt-8 grid gap-6 md:grid-cols-2"> <div className="h-64 rounded-2xl bg-gray-200" /> <div className="h-64 rounded-2xl bg-gray-200" /> </div> </div> </div>
);
}

if (error) {
return ( <div className="min-h-screen bg-[#f5f5f3] px-4 py-10"> <div className="mx-auto mt-20 max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
Error: {error.message} </div> </div>
);
}

const order = data?.order;

if (!order) {
return ( <div className="min-h-screen bg-[#f5f5f3] pt-32 text-center"> <h1 className="text-2xl font-bold text-[#111]">
Order not found </h1> </div>
);
}

const formattedDate =
order.createdAt && !isNaN(Number(order.createdAt))
? new Date(Number(order.createdAt)).toLocaleDateString(
"en-US",
{
year: "numeric",
month: "long",
day: "numeric",
}
)
: "N/A";

const status = order.status?.toUpperCase();

const statusConfig =
status === "DELIVERED"
? {
icon: <FaCheckCircle />,
bg: "bg-green-50",
text: "text-green-700",
border: "border-green-200",
}
: status === "CANCELLED"
? {
icon: <FaTimesCircle />,
bg: "bg-red-50",
text: "text-red-700",
border: "border-red-200",
}
: status === "SHIPPED"
? {
icon: <FaShippingFast />,
bg: "bg-blue-50",
text: "text-blue-700",
border: "border-blue-200",
}
: {
icon: <FaClock />,
bg: "bg-amber-50",
text: "text-amber-700",
border: "border-amber-200",
};

return ( <div className="min-h-screen bg-[#f5f5f3] p-4 mt-28 lg:mt-20 sm:mt-28"> <div className="mx-auto mt-16 max-w-6xl">


    {/* Header */}
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          <FaBoxOpen />
          Order Details
        </div>

        <h1 className="text-3xl font-black tracking-tight text-[#111] md:text-4xl">
          #{order.id}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <FaCalendarAlt />
          Placed on {formattedDate}
        </div>
      </div>

      <div
        className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
      >
        {statusConfig.icon}
        {status}
      </div>
    </div>

    {/* Main Grid */}
    <div className="grid gap-6 lg:grid-cols-3">

      {/* Customer */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#111] text-amber-400">
            <FaUser />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Customer
            </p>
            <h2 className="font-bold text-[#111]">
              Customer Information
            </h2>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-gray-400">
              Name
            </p>
            <p className="font-semibold text-[#111]">
              {order.address?.name}
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-gray-400">
              Email
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaEnvelope className="text-amber-600" />
              {order.address?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white">
            <FaCreditCard />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Payment
            </p>
            <h2 className="font-bold text-[#111]">
              Payment & Charges
            </h2>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold capitalize text-[#111]">
              {order.payment}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold">
              ${Number(order.subtotal).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Shipping</span>
            <span className="font-semibold">
              ${Number(order.shippingCost).toFixed(2)}
            </span>
          </div>

          <div className="my-3 border-t border-dashed border-gray-200" />

          <div className="flex items-center justify-between">
            <span className="font-bold text-[#111]">
              Total
            </span>

            <span className="text-xl font-black text-amber-600">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-2xl bg-[#111] p-6 text-white shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white">
            <FaTruck />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Order Progress
            </p>
            <h2 className="font-bold">
              Update Status
            </h2>
          </div>
        </div>

        <label className="mb-2 block text-sm text-gray-400">
          Current status
        </label>

        <select
          value={order.status}
          onChange={handleStatusChange}
          disabled={updatingStatus}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white outline-none transition focus:border-amber-500 disabled:opacity-50"
        >
          {statusOptions.map((item) => (
            <option
              key={item}
              value={item}
              className="bg-[#111] text-white"
            >
              {item.charAt(0) +
                item.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        {updatingStatus && (
          <p className="mt-3 text-xs text-amber-400">
            Updating order status...
          </p>
        )}
      </div>
    </div>

    {/* Shipping Address */}
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <FaMapMarkerAlt />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Delivery
          </p>
          <h2 className="text-lg font-bold text-[#111]">
            Shipping Address
          </h2>
        </div>
      </div>

      <div className="grid gap-5 text-sm sm:grid-cols-3">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-gray-400">
            Recipient
          </p>
          <p className="font-semibold text-[#111]">
            {order.address?.name}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-gray-400">
            Address
          </p>
          <p className="text-gray-600">
            {order.address?.street}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-gray-400">
            Location
          </p>
          <p className="text-gray-600">
            {order.address?.city},{" "}
            {order.address?.country}
          </p>
        </div>
      </div>
    </div>

    {/* Order Items */}
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Products
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#111]">
            Order Items
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          <FaBoxOpen />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-[#fafafa] text-xs uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4 font-semibold">
                Product
              </th>
              <th className="px-6 py-4 font-semibold">
                Quantity
              </th>
              <th className="px-6 py-4 text-right font-semibold">
                Price
              </th>
            </tr>
          </thead>

          <tbody>
            {order.orderItems.map(
              (item: any, index: number) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-0 transition hover:bg-amber-50/30"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <FaBoxOpen size={14} />
                      </div>

                      <span className="font-semibold text-[#111]">
                        {item.product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      × {item.quantity}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right font-bold text-[#111]">
                    ${Number(item.price).toFixed(2)}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Bottom Status */}
    <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#111] to-[#1c1c1c] px-6 py-5 text-white shadow-lg">
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400">
          Order Total
        </p>

        <p className="mt-1 text-2xl font-black">
          ${Number(order.total).toFixed(2)}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs uppercase tracking-wider text-gray-400">
          Status
        </p>

        <p className="mt-1 font-bold text-amber-400">
          {order.status}
        </p>
      </div>
    </div>
  </div>
</div>


);
}
