"use client";

import { useQuery } from "@apollo/client";
import { orders_detail } from "@/app/graphql/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Orders } from "@/app/types/layouttype";
import Reactdatatable from "../../components/datatable";
import Searchdatatable from "../../components/searchdatatable";
import { FaEye, FaShoppingBag } from "react-icons/fa";

export default function AllOrdersPage() {
const { data, loading, error } = useQuery(orders_detail);
const router = useRouter();
const [search, setSearch] = useState("");

if (loading) {
return ( <div className="min-h-screen bg-[#f7f7f5] px-4 py-10 md:px-8"> <div className="mx-auto mt-20 max-w-6xl"> <div className="animate-pulse"> <div className="mb-3 h-3 w-32 rounded bg-gray-200" /> <div className="mb-10 h-10 w-52 rounded bg-gray-200" /> <div className="h-14 rounded-xl bg-gray-200" /> </div> </div> </div>
);
}

if (error) {
return ( <div className="min-h-screen bg-[#f7f7f5] px-4 py-10"> <div className="mx-auto mt-20 max-w-6xl border-l-4 border-red-500 bg-red-50 px-5 py-4 text-red-700">
Error loading orders: {error.message} </div> </div>
);
}

const orders = data?.orders || [];

const filteredOrders = orders.filter((order: any) => {
const searchValue = search.toLowerCase();


return (
  order.address?.name?.toLowerCase().includes(searchValue) ||
  order.address?.email?.toLowerCase().includes(searchValue) ||
  order.id?.toLowerCase().includes(searchValue) ||
  order.status?.toLowerCase().includes(searchValue) ||
  order.payment?.toLowerCase().includes(searchValue)
);


});

const columns = [
{
name: "Order",
selector: (row: any) => row.id,
sortable: true,
cell: (row: any) => ( <div className="flex items-center gap-3"> <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600"> <FaShoppingBag size={14} /> </div>


      <div className="min-w-0">
        <p className="font-semibold text-[#111]">
          #{row.id.slice(-8)}
        </p>
        <p className="text-xs text-gray-400">
          Order ID
        </p>
      </div>
    </div>
  ),
},
{
  name: "Customer",
  selector: (row: any) => row.address?.name,
  sortable: true,
  cell: (row: any) => (
    <div>
      <p className="font-semibold text-[#111]">
        {row.address?.name || "Guest"}
      </p>
      <p className="max-w-[220px] truncate text-xs text-gray-400">
        {row.address?.email || "No email"}
      </p>
    </div>
  ),
},
{
  name: "Total",
  selector: (row: any) => row.total,
  sortable: true,
  cell: (row: any) => (
    <span className="font-bold text-[#111]">
      ${Number(row.total).toFixed(2)}
    </span>
  ),
},
{
  name: "Payment",
  selector: (row: any) => row.payment,
  cell: (row: any) => (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
      {row.payment}
    </span>
  ),
},
{
  name: "Status",
  selector: (row: any) => row.status,
  cell: (row: any) => {
    const status = row.status?.toLowerCase();

    const statusClass =
      status === "completed" || status === "delivered"
        ? "bg-green-100 text-green-700"
        : status === "cancelled"
          ? "bg-red-100 text-red-700"
          : status === "pending"
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-100 text-blue-700";

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass}`}
      >
        {row.status}
      </span>
    );
  },
},
{
  name: "Action",
  cell: (row: Orders) => (
    <button
      type="button"
      onClick={() =>
        router.push(`/authorize/admin/orders/${row.id}`)
      }
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111] text-white transition hover:bg-amber-600"
      title="View order"
    >
      <FaEye size={14} />
    </button>
  ),
},


];

return ( <div className="min-h-screen w-full bg-[#f7f7f5] px-4 py-10 md:px-8"> <div className="mx-auto mt-10 w-full max-w-7xl">


    <div className="mb-10 border-b border-gray-200 pb-7">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-600">
        Order Management
      </p>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
            All Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and manage all customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          {filteredOrders.length} orders
        </div>
      </div>
    </div>

    <div className="mb-6">
      <Searchdatatable search={setSearch} />
    </div>

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Reactdatatable
        columns={columns}
        filterproducts={filteredOrders}
      />
    </div>
  </div>
</div>


);
}
