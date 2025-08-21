'use client';

import React, { useState } from 'react';
import Searchdatatable from '../../components/searchdatatable';
import Reactdatatable from '../../components/datatable';
import { FiEdit, FiTrash } from 'react-icons/fi';

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
                        className="bg-amber-600 text-white px-2 py-1 rounded"
                    >
                        <FiEdit/>
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-amber-500 text-white px-2 py-1 rounded"
                    >
                        <FiTrash/>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full p-6 mt-20">
            <div className='block w-[75%] m-auto text-center relative'>
                <h2 className="text-lg font-bold mb-4">Manage Price Ranges</h2>
                {editId &&
                 
                 <button
                 onClick={()=>{
                    setEditId('')
                    setRange('')
                    setValid('')

                 }}
                 className='absolute top-1.5 -right-2 px-1 border-1 text-xs rounded-full'
                 >X
                 </button>
                
                }   
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-[75%] m-auto space-y-3">
                <input
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="Price range e.g. 0-50"
                    className="border p-2 w-full rounded"
                />
                <div>
                    {valid ? <div className='text-red-600 text-center'>{valid}</div> : ''}
                </div>
                <button className="block m-auto bg-amber-600  text-white px-4 py-2 rounded">
                    {editId ? 'Update' : 'Add'}
                </button>
            </form>

           
            <Searchdatatable search={setSearch}/>
            <Reactdatatable columns={columns} filterproducts={filteredData}/>
           
        </div>
    );
};

export default PriceFilterPage;
