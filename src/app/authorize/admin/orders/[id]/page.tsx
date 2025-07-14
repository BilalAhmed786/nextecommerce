'use client';

import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'next/navigation';
import {
  get_single_order,
  update_order_status,
} from '@/app/graphql/orders';


export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, loading, error, refetch } = useQuery(get_single_order, {
    variables: { id },
    
  });

  

  const [updateStatus, { loading: updatingStatus }] = useMutation(update_order_status, {
    onCompleted: () => refetch(),
  });

 

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    updateStatus({ variables: { id, status: newStatus } });
  };

  const statusOptions = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error.message}</p>;

  const order = data.order;

  return (
    <div className="w-[80%] mx-auto p-6 bg-white shadow rounded-md mt-20">
      <h1 className="text-xs font-bold mb-6 text-blue-700">Order #{order.id}</h1>
       <p><strong>Placed On:</strong>{' '}
          {order.createdAt && !isNaN(Number(order.createdAt))
            ? new Date(Number(order.createdAt)).toLocaleDateString()
          : 'N/A'}
        </p>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
          <p><strong>Name:</strong> {order.address.name}</p>
          <p><strong>Email:</strong> {order.address.email}</p>

          <div className="mt-2 w-[40%]">
            <label className="block font-semibold mb-1">Update Status</label>
            <select
              value={order.status}
              onChange={handleStatusChange}
              className="border px-4 py-2 rounded"
              disabled={updatingStatus}
            >
              {statusOptions.map((status,index) => (
                <option key={index} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Payment & Charges</h2>
          <p><strong>Current Status:</strong> {order.status}</p>
          <p><strong>Payment:</strong> {order.payment}</p>
          <p><strong>Shipping:</strong> ${order.shippingCost}</p>
          <p><strong>Subtotal:</strong> ${order.subtotal}</p>
          <p><strong>Total:</strong> <span className="font-bold text-green-600">${order.total}</span></p>

        
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <div className="text-gray-700">
          <p>{order.address.name}</p>
          <p>{order.address.street}</p>
          <p>{order.address.city}, {order.address.country}</p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item: any, index: number) => (
                <tr key={index} className="border-t">
                  <td className="p-3 border">{item.product.name}</td>
                  <td className="p-3 border">{item.quantity}</td>
                  <td className="p-3 border">${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
