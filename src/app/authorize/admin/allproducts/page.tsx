'use client';

import { useQuery, useMutation } from '@apollo/client';
import { get_products, delete_product } from '@/app/graphql/product';
import { useState } from 'react';
import Reactdatatable from '../../components/datatable';
import Searchdatatable from '../../components/searchdatatable';
import { FiEdit, FiTrash, FiPackage, FiPlus, FiBox } from 'react-icons/fi';
import Link from 'next/link';

export default function ProductTable() {
    const { data, loading, error } = useQuery(get_products);

    const [deleteProduct] = useMutation(delete_product, {
        refetchQueries: [{ query: get_products }],
    });

    const [search, setSearch] = useState('');

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct({
                variables: { id },
            });
        } catch (err) {
            console.error(err);
            alert('Failed to delete product.');
        }
    };

    const filteredProducts =
        data?.products?.filter((product: any) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category?.name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        ) || [];

    const columns = [
        {
            name: '#',
            cell: (_row: any, index: number) => (
                <span className="text-xs font-semibold text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                </span>
            ),
            width: '65px',
        },

        {
            name: 'Product',
            selector: (row: any) => row.name,
            sortable: true,
            cell: (row: any) => (
                <div className="flex items-center gap-3 py-2 w-3xl">
                    <div className="relative group">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                            <img
                                src={row.image}
                                alt={row.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-[100px] ">
                            {row.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                            Product
                        </p>
                    </div>
                </div>
            ),
        },

        {
            name: 'Price',
            selector: (row: any) => row.price,
            sortable: true,
            cell: (row: any) => (
                <div>
                    <p className="font-bold text-gray-900">
                        ${Number(row.price).toFixed(2)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Price
                    </p>
                </div>
            ),
        },

        {
            name: 'Stock',
            selector: (row: any) => row.stock,
            sortable: true,
            cell: (row: any) => {
                const stock = Number(row.stock);

                return (
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            stock === 0
                                ? 'bg-red-50 text-red-600'
                                : stock < 10
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                        } `}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                stock === 0
                                    ? 'bg-red-500'
                                    : stock < 10
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                            }`}
                        />

                        {stock === 0
                            ? 'Out of stock'
                            : stock < 10
                              ? `${stock} left`
                              : `${stock} in stock`}
                    </div>
                );
            },
        },

        {
            name: 'Category',
            selector: (row: any) => row.category?.name || '-',
            sortable: true,
            cell: (row: any) => (
                <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                    {row.category?.name || 'Uncategorized'}
                </span>
            ),
        },

        {
            name: 'Gallery',
            cell: (row: any) => (
                <div className="flex items-center">
                    {row.images?.slice(0, 3).map((img: any, i: number) => (
                        <div
                            key={i}
                            className={`w-9 h-9 rounded-lg overflow-hidden border-2 border-white shadow-sm ${
                                i !== 0 ? '-ml-2' : ''
                            }`}
                        >
                            <img
                                src={img.url}
                                alt={`Gallery ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}

                    {row.images?.length > 3 && (
                        <div className="-ml-2 w-9 h-9 rounded-lg bg-gray-900 border-2 border-white flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">
                                +{row.images.length - 3}
                            </span>
                        </div>
                    )}

                    {(!row.images || row.images.length === 0) && (
                        <span className="text-xs text-gray-400">
                            No gallery
                        </span>
                    )}
                </div>
            ),
        },

        {
            name: 'Actions',
            right: true,
            cell: (row: any) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`allproducts/${row.id}`}
                        className="group w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-amber-500 hover:text-white transition-all duration-200"
                        title="Edit product"
                    >
                        <FiEdit
                            size={15}
                            className="transition-transform group-hover:scale-110"
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="group w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                        title="Delete product"
                    >
                        <FiTrash
                            size={15}
                            className="transition-transform group-hover:scale-110"
                        />
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center bg-[#f7f7f5] rounded-3xl">
                <div className="text-center">
                    <div className="relative mx-auto w-14 h-14">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                        <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                    </div>

                    <p className="mt-5 text-sm font-medium text-gray-500">
                        Loading your products...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-[#f7f7f5] rounded-3xl">
                <div className="text-center">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                        <FiBox className="text-red-500" size={24} />
                    </div>

                    <h3 className="mt-4 font-bold text-gray-900">
                        Unable to load products
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Something went wrong while fetching your products.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] p-5 mt-32 lg:mt-20 md:mt-32">

            {/* Header */}
            <div className="max-w-[1600px] mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-7">

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                                <FiPackage className="text-white" size={16} />
                            </div>

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                                Inventory
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950">
                            Products
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage your products, stock and catalog.
                        </p>
                    </div>

                    <Link
                        href="allproducts/create"
                        className="inline-flex items-center justify-center gap-2 bg-gray-950 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-gray-950/10"
                    >
                        <FiPlus size={18} />
                        Add Product
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                                    Total Products
                                </p>

                                <p className="text-2xl font-black text-gray-950 mt-2">
                                    {data?.products?.length || 0}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                                <FiPackage
                                    className="text-amber-600"
                                    size={20}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                                    In Stock
                                </p>

                                <p className="text-2xl font-black text-gray-950 mt-2">
                                    {data?.products?.filter(
                                        (p: any) => Number(p.stock) > 0
                                    ).length || 0}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <FiBox
                                    className="text-emerald-600"
                                    size={20}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                                    Low Stock
                                </p>

                                <p className="text-2xl font-black text-gray-950 mt-2">
                                    {data?.products?.filter(
                                        (p: any) =>
                                            Number(p.stock) > 0 &&
                                            Number(p.stock) < 10
                                    ).length || 0}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                                <span className="text-orange-500 font-black">
                                    !
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-950 rounded-2xl p-5 shadow-lg shadow-gray-950/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                    Search Results
                                </p>

                                <p className="text-2xl font-black text-white mt-2">
                                    {filteredProducts.length}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <FiPackage
                                    className="text-amber-400"
                                    size={20}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Table Card */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Table top */}
                    <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            <div>
                                <h2 className="text-lg font-bold text-gray-950">
                                    Product Catalog
                                </h2>

                                <p className="text-xs text-gray-400 mt-1">
                                    {filteredProducts.length} products displayed
                                </p>
                            </div>

                            <div className="w-full lg:w-[320px]">
                                <Searchdatatable search={setSearch} />
                            </div>

                        </div>

                    </div>

                    {/* Table */}
                    <div className="p-2 sm:p-4 overflow-x-auto">
                        <Reactdatatable
                            columns={columns}
                            filterproducts={filteredProducts}
                        />
                    </div>

                </div>

            </div>
        </div>
    );
}
