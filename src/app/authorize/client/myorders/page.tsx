'use client';

import { useQuery } from '@apollo/client';
import { order_by_email } from '@/app/graphql/orders';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Reactdatatable from '../../components/datatable';
import Searchdatatable from '../../components/searchdatatable';
import { useSession } from 'next-auth/react';
import {
  FaEye,
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
} from 'react-icons/fa';

export default function MyOrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data: session, status } = useSession();

  const { data, loading, error } = useQuery(order_by_email, {
    variables: {
      email: session?.user.email,
    },
    skip: !session?.user.email,
  });

  if (status === 'loading' || loading) {
    return (
      <div className="mt-20 flex min-h-[70vh] items-center justify-center bg-[#f7f7f5]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500" />
          <p className="text-sm font-semibold text-gray-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 flex min-h-[70vh] items-center justify-center bg-[#f7f7f5] px-4">
        <div className="rounded-2xl border border-red-100 bg-white px-8 py-7 text-center shadow-sm">
          <FaTimesCircle className="mx-auto mb-3 text-2xl text-red-500" />
          <p className="font-bold text-gray-900">
            Unable to load orders
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  const orders = data?.userOrders || [];

  const filteredOrders = orders.filter((order: any) => {
    const value = search.toLowerCase();

    return (
      order.id?.toLowerCase().includes(value) ||
      order.status?.toLowerCase().includes(value) ||
      order.payment?.toLowerCase().includes(value) ||
      order.address?.name?.toLowerCase().includes(value)
    );
  });

  const getStatusIcon = (status: any) => {
    if (status === 'DELIVERED') {
      return <FaCheckCircle />;
    }

    if (status === 'CANCELLED') {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  };

  const getStatusClass = (status: any) => {
    if (status === 'DELIVERED') {
      return 'bg-green-50 text-green-600 border-green-100';
    }

    if (status === 'CANCELLED') {
      return 'bg-red-50 text-red-600 border-red-100';
    }

    if (status === 'SHIPPED') {
      return 'bg-blue-50 text-blue-600 border-blue-100';
    }

    return 'bg-amber-50 text-amber-600 border-amber-100';
  };

  const columns = [
    {
      name: 'Order',
      selector: (row: any) => row.id,
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-3 py-2">
          <div className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl bg-black text-amber-400
          ">
            <FaShoppingBag size={15} />
          </div>

          <div>
            <p className="font-bold text-gray-900">
              #{row.id?.slice(-8)}
            </p>

            <p className="text-[10px] text-gray-400">
              Order ID
            </p>
          </div>
        </div>
      ),
    },

    {
      name: 'Customer',
      selector: (row: any) => row.address?.name,
      sortable: true,
      cell: (row: any) => (
        <div>
          <p className="font-semibold text-gray-800">
            {row.address?.name || 'N/A'}
          </p>
          <p className="text-xs text-gray-400">
            {row.address?.email || ''}
          </p>
        </div>
      ),
    },

    {
      name: 'Total',
      selector: (row: any) => row.total,
      sortable: true,
      cell: (row: any) => (
        <span className="font-black text-gray-900">
          ${Number(row.total || 0).toFixed(2)}
        </span>
      ),
    },

    {
      name: 'Payment',
      selector: (row: any) => row.payment,
      sortable: true,
      cell: (row: any) => (
        <div className="
          flex items-center gap-2
          rounded-lg bg-gray-50
          px-3 py-2
          text-xs font-bold text-gray-600
        ">
          <FaCreditCard className="text-gray-400" />
          {row.payment}
        </div>
      ),
    },

    {
      name: 'Status',
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => (
        <span
          className={`
            inline-flex items-center gap-2
            rounded-full border
            px-3 py-1.5
            text-[11px] font-bold
            ${getStatusClass(row.status)}
          `}
        >
          {getStatusIcon(row.status)}
          {row.status}
        </span>
      ),
    },

    {
      name: 'Action',
      cell: (row: any) => (
        <button
          type="button"
          onClick={() =>
            router.push(
              `/authorize/client/myorders/${row.id}`
            )
          }
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl
            bg-black
            text-amber-400
            transition-all
            hover:-translate-y-0.5
            hover:bg-amber-500
            hover:text-black
            hover:shadow-lg
            hover:shadow-amber-500/20
          "
          title="View order"
        >
          <FaEye size={14} />
        </button>
      ),
    },
  ];

  return (
    <main className="mt-20 min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="
          mb-8 flex flex-col gap-5
          sm:flex-row sm:items-end sm:justify-between
        ">
          <div>
            <div className="
              mb-2 flex items-center gap-2
              text-xs font-bold uppercase
              tracking-[0.25em] text-amber-600
            ">
              <FaShoppingBag />
              Your Account
            </div>

            <h1 className="
              text-3xl font-black tracking-tight
              text-gray-950 sm:text-4xl
            ">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Track and manage all your purchases in one place.
            </p>
          </div>

          <div className="
            flex w-fit items-center gap-3
            rounded-2xl border border-gray-200
            bg-white px-5 py-3
            shadow-sm
          ">
            <div className="
              flex h-10 w-10 items-center justify-center
              rounded-xl bg-amber-100 text-amber-600
            ">
              <FaShoppingBag />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Total Orders
              </p>

              <p className="text-xl font-black text-gray-950">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5">
          <Searchdatatable search={setSearch} />
        </div>

        {/* Orders */}
        <section className="
          overflow-hidden
          rounded-2xl
          border border-gray-200
          bg-white
          shadow-sm
        ">
          <div className="
            flex flex-col gap-2
            border-b border-gray-100
            px-5 py-4
            sm:flex-row sm:items-center
            sm:justify-between
          ">
            <div>
              <h2 className="font-bold text-gray-950">
                Order History
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                {filteredOrders.length} order
                {filteredOrders.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {search && (
              <div className="
                rounded-lg
                bg-amber-50
                px-3 py-1.5
                text-xs font-semibold
                text-amber-700
              ">
                Searching: {search}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <Reactdatatable
              columns={columns}
              filterproducts={filteredOrders}
            />
          </div>
        </section>

        {/* Bottom message */}
        <div className="
          mt-5 flex items-center justify-center gap-2
          text-xs text-gray-400
        ">
          <FaCheckCircle className="text-amber-500" />
          All your orders are securely stored
        </div>

      </div>
    </main>
  );
}