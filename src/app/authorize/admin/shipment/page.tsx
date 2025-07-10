'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
  get_shipments,
  create_shipment,
  update_shipment,
  delete_shipment,
} from '@/app/graphql/product';
import { useQuery, useMutation } from '@apollo/client';

const ShipmentPage = () => {
  const [city, setCity] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [valid, setValid] = useState<string>('')
  const [search,searchitem] =useState('')
  const { data, loading, error, refetch } = useQuery(get_shipments);
  const [createShipment] = useMutation(create_shipment);
  const [updateShipment] = useMutation(update_shipment);
  const [deleteShipment] = useMutation(delete_shipment);


  const filterdata = data?.shipments.filter((shipment:any)=>shipment.city.toLowerCase().includes(search.toLowerCase()))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setValid('amount should be a number')
      return
    }

    if (editId) {

      const { data } = await updateShipment({
        variables: { id: editId, city, amount: parsedAmount },
      });

      if (data.updateShipment.message) {

        setValid(data.updateShipment.message)
      } else {

        refetch();
        setEditId(null)

      }


    } else {
      const { data } = await createShipment({
        variables: { city, amount: parsedAmount },
      });

      if (data.createShipment.message) {
        setValid(data.createShipment.message)
      } else {
        setCity('');
        setAmount('');
        refetch();

      }

    }


  };

  const handleEdit = (shipment: any) => {
    setEditId(shipment.id);
    setCity(shipment.city);
    setAmount(shipment.amount.toString());
  };

  const handleDelete = async (id: string) => {

    await deleteShipment({ variables: { id } });
    refetch();
  };

  const columns = [
    {
      name: 'City',
      selector: (row: any) => row.city,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row: any) => `$${row.amount}`,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: any) => (
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
    <div className="max-w-3xl mx-auto p-4">
      <div className='flex justify-between mx-14'>
        <h2 className="text-2xl font-bold mb-4">Add Shipment</h2>
        {editId ? <button onClick={()=>{
          setEditId(null)
          setCity('')
          setAmount('')
        }}
        >X</button>:''}
      </div>


      <form onSubmit={handleSubmit} className="space-y-4 mb-6">

        <div>
          <label className="block font-semibold">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter City"
          />
        </div>
        <div>
          <label className="block font-semibold">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter Amount"
          />
        </div>
        {valid ? <div>{valid}</div> : ""}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editId ? 'Update' : 'Add'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Shipment List</h3>
        <input 
        className='w-[90%] h-10 rounded-2xl border-1 px-3 outline-0' 
        placeholder='search city..' 
        type="text"
        onChange={(e)=>searchitem(e.target.value)}
        />
      {loading ? 
        <p>Loading...</p>
       : error ? 
        <p className="text-red-500">Error loading shipments</p>
       : 
        <DataTable
          columns={columns}
          data={filterdata}
          pagination
          highlightOnHover
          striped
        />
      }
    </div>
  );
};

export default ShipmentPage;
