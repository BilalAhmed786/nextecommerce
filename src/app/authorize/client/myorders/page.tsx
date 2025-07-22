'use client';

import { useQuery } from '@apollo/client';
import { order_by_email } from '@/app/graphql/orders'; // your GraphQL query
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Orders } from '@/app/types/layouttype';
import Reactdatatable from '../../components/datatable';
import Searchdatatable from '../../components/searchdatatable';
import { useSession } from 'next-auth/react';
import { FaEye } from 'react-icons/fa';

export default function MyOrdersPage() {
   
   const router = useRouter();
   const [search, setSearch] = useState('');
   const {data:session,status} = useSession()
   

   
   const { data, loading, error } = useQuery(order_by_email, {
    variables: { email: session?.user.email },
  });
 

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const orders = data?.userOrders || [];

  const filteredOrders = orders.filter((order: any) =>
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase()) ||
    order.payment.toLowerCase().includes(search.toLowerCase()) ||
    order.address.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: 'Order ID', selector: (row: any) => row.id, sortable: true },
    { name: 'Name', selector: (row: any) => row.address.name },
    { name: 'Email', selector: (row: any) => row.address.email },
    { name: 'Total', selector: (row: any) => `$${row.total}` },
    { name: 'Payment', selector: (row: any) => row.payment },
    { name: 'Status', selector: (row: any) => row.status },
    {
      name: 'Action',
      cell: (row: Orders) => (
        <button
          className="text-amber-600 underline"
          onClick={() => router.push(`/authorize/client/myorders/${row.id}`)}
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 mt-20">
      <h1 className="text-xl text-center font-bold mb-4">My Orders</h1>

      <Searchdatatable search={setSearch} />

      <Reactdatatable columns={columns} filterproducts={filteredOrders} />
    </div>
  );
}
