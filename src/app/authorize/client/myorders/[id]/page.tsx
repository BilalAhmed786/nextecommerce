'use client';

import { useQuery } from '@apollo/client';
import { get_single_order } from '@/app/graphql/orders';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function OrderDetailPage() {
    const { id } = useParams() as { id: string };

    const { data, loading, error } = useQuery(get_single_order, {
        variables: { id },
    });

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading order...</p>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Error: {error.message}</p>
            </div>
        );

    const order = data?.order;

    console.log(order)

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-5xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-10">
                    🧾 Order Detail
                </h1>

                {/* Flex container only on large screens */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    {/* Order Summary */}
                    <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-sm m-5">
                        <h2 className="font-semibold text-lg mb-3 text-gray-800">Order Summary</h2>
                        <div className="space-y-2 text-sm sm:text-base text-gray-700">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Payment:</strong> {order.payment}</p>
                            <p><strong>Total:</strong> ${order.total}</p>
                            <p><strong>Shipment:</strong> ${order.shippingCost}</p>
                            
                            <p>
                                <strong>Placed On:</strong>{' '}
                                {order.createdAt && !isNaN(Number(order.createdAt))
                                    ? new Date(Number(order.createdAt)).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-sm m-5">
                        <h2 className="font-semibold text-lg mb-3 text-gray-800">Shipping Address</h2>
                        <div className="space-y-2 text-sm sm:text-base text-gray-700">
                            <p><strong>Name:</strong> {order.address.name}</p>
                            <p><strong>Email:</strong> {order.address.email}</p>
                            <p><strong>City:</strong> {order.address.city}</p>
                            <p><strong>Street:</strong> {order.address.street}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-lg mb-3 text-gray-800">Items</h2>
                    <ul className="divide-y">
                        {order.orderItems.map((item: any,index:number) => (
                            <li
                                key={index}
                                className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                            >
                                <Image
                                    src={item.product.image}
                                    alt={item.product.name}
                                    width={60}
                                    height={60}
                                    className="rounded border object-cover"
                                />
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">Price: ${item.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
