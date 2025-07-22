'use client';

import { useQuery } from '@apollo/client';
import { orders_detail } from '@/app/graphql/orders';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Orders } from '@/app/types/layouttype';
import Reactdatatable from '../../components/datatable';
import Searchdatatable from '../../components/searchdatatable';
import { FaEye } from 'react-icons/fa';

export default function AllOrdersPage() {
  const { data, loading, error } = useQuery(orders_detail);
  const router = useRouter();

  const [search, setSearch] = useState('');

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders: {error.message}</p>;

  const orders = data.orders;



  // Filter orders by user name, email, or order ID
  const filteredOrders = orders.filter((order:any) =>
    order.address.name.toLowerCase().includes(search.toLowerCase()) ||
    order.address.email.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase()) ||
    order.payment.toLowerCase().includes(search.toLowerCase())

  );

  const columns = [
    { name: 'Order ID', selector: (row:any) => row.id, sortable: true },
    { name: 'Customer', selector: (row:any) => row.address.name, sortable: true },
    { name: 'Email', selector: (row:any) => row.address.email },
    { name: 'Total', selector: (row:any) => `$${row.total}`, sortable: true },
    { name: 'Payment', selector: (row:any) => row.payment },
    { name: 'Status', selector: (row:any) => row.status },
    {
      name: 'Action',
      cell: (row:Orders) => (
        <button
          className="text-amber-600 underline"
          onClick={() => router.push(`/authorize/admin/orders/${row.id}`)}
        >
          <FaEye/>
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 mt-20">
      <h1 className="text-xl text-center font-bold mb-4">All Orders</h1>

      {/* Search Input */}
        <Searchdatatable search={setSearch}/>

        <Reactdatatable columns={columns} filterproducts={filteredOrders}/>
    </div>
  );
}
