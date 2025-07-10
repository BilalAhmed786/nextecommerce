'use client';

import { useQuery, useMutation } from '@apollo/client';
import { get_products, delete_product } from '@/app/graphql/product';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import Link from 'next/link';

export default function ProductTable() {
    const { data, loading, error } = useQuery(get_products);
    const [deleteProduct] = useMutation(delete_product, {
        refetchQueries: [{ query: get_products }],
    });


    const [search, setSearch] = useState('');

    const handleDelete = async (id: string) => {

        try {
            const { data } = await deleteProduct({ variables: { id } });


        } catch (err) {
            console.error(err);
            alert('Failed to delete product.');
        }

    };

    const filteredProducts = data?.products?.filter((product: any) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.name.toLowerCase().includes(search.toLowerCase())

    )

    const columns = [
        {
            name: '#',
            cell: (_: any, index: number) => index + 1,
            width: '60px',
        },
        {
            name: 'Name',
            selector: (row: any) => row.name,
            sortable: true,
        },
        {
            name: 'Price',
            selector: (row: any) => row.price,
            sortable: true,
        },
        {
            name: 'Stock',
            selector: (row: any) => row.stock,
        },
        {
            name: 'Category',
            selector: (row: any) => row.category?.name || '-',
        },
        {
            name: 'Image',

            cell: (row: any) => (
                <img
                    src={row.image}
                    className="w-20 m-2 rounded"
                    alt="Main"
                />
            ),

        },
        {
            name: 'Gallery',
            cell: (row: any) => (
                <div
                    className="flex gap-2 flex-wrap">
                    {row.images.map((img: any, i: number) => (
                        <img
                            key={i}
                            src={img.url}
                            alt={`Gallery ${i}`}
                            className="w-10 rounded"
                        />
                    ))}
                </div>
            ),
        },
        {
            name: 'Actions',
            cell: (row: any) => (
                <div className="flex text-xs gap-1">
                    <Link
                        href={`allproducts/${row.id}`}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    if (loading) return <p className="p-4">Loading products...</p>;
    if (error) return <p className="p-4">Error loading products.</p>;

    return (
        <div className="p-4">
            
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-11 px-3 py-2 border w-full rounded"
                />
            

            <DataTable
                columns={columns}
                data={filteredProducts}
                pagination
                highlightOnHover
                striped
                responsive
            />
        </div>
    );
}
