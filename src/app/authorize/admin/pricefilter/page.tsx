'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import {
    get_price_filter,
    create_price_filter,
    update_price_filter,
    delete_price_filter,
} from '@/app/graphql/product';
import { useQuery, useMutation } from '@apollo/client';

interface PriceFilter {
    id: string;
    amount: string;
}

const PriceFilterPage = () => {
    const [range, setRange] = useState('');
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [valid, setValid] = useState('')

    const { data, loading, error, refetch } = useQuery(get_price_filter);
    const [createPriceFilter] = useMutation(create_price_filter);
    const [updatePriceFilter] = useMutation(update_price_filter);
    const [deletePriceFilter] = useMutation(delete_price_filter);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            const {data} = await updatePriceFilter({ variables: { id: editId, range } });

             if (data.updatePriceFilter.message) {

                setValid(data.updatePriceFilter.message)

            } else {
                setRange('');
                refetch();

            }
        } else {
            const { data } = await createPriceFilter({ variables: { range } });

            if (data.createPriceFilter.message) {

                setValid(data.createPriceFilter.message)

            } else {
                setRange('');
                refetch();

            }

        }


    };

    const handleEdit = (item: PriceFilter) => {
        setEditId(item.id);
        setRange(item.amount);
    };

    const handleDelete = async (id: string) => {
        await deletePriceFilter({ variables: { id } });
        refetch();
    };

    const filteredData = (data?.pricefilter || []).filter((item: PriceFilter) =>
        item.amount.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            name: 'Price Range',
            selector: (row: PriceFilter) => row.amount,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row: PriceFilter) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            handleEdit(row)
                            setValid('')
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className='flex justify-between mx-14'>
                <h2 className="text-2xl font-bold mb-4">Manage Price Ranges</h2>
                {editId &&
                 
                 <button
                 onClick={()=>{
                    setEditId('')
                    setRange('')
                    setValid('')

                 }}
                 >X
                 </button>
                
                }   
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <input
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="Price range e.g. 0-50"
                    className="border p-2 w-full rounded"
                />
                <div>
                    {valid ? <div className='text-red-600'>{valid}</div> : ''}
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    {editId ? 'Update' : 'Add'}
                </button>
            </form>

            {/* Search */}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search price ranges..."
                className="border p-2 rounded w-full mb-4"
            />

            {/* Table */}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Error loading data</p>
            ) : (
                <DataTable
                    title="Price Filter List"
                    columns={columns}
                    data={filteredData}
                    pagination
                    striped
                    highlightOnHover
                />
            )}
        </div>
    );
};

export default PriceFilterPage;
