"use client";

import React, { useState } from "react";
import Reactdatatable from "../../components/datatable";
import Searchdatatable from "../../components/searchdatatable";
import { FiEdit, FiTrash } from "react-icons/fi";

import {
get_shipments,
create_shipment,
update_shipment,
delete_shipment,
} from "@/app/graphql/product";
import { useQuery, useMutation } from "@apollo/client";

const ShipmentPage = () => {
const [city, setCity] = useState("");
const [amount, setAmount] = useState("");
const [editId, setEditId] = useState<string | null>(null);
const [valid, setValid] = useState("");
const [search, searchitem] = useState("");

const { data, refetch } = useQuery(get_shipments);

const [createShipment, { loading: creating }] =
useMutation(create_shipment);

const [updateShipment, { loading: updating }] =
useMutation(update_shipment);

const [deleteShipment] = useMutation(delete_shipment);

const filterdata = data?.shipments?.filter((shipment: any) =>
shipment.city.toLowerCase().includes(search.toLowerCase())
);

const resetForm = () => {
setCity("");
setAmount("");
setEditId(null);
setValid("");
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setValid("");

if (!city.trim()) {
  setValid("City is required");
  return;
}

const parsedAmount = parseFloat(amount);

if (isNaN(parsedAmount)) {
  setValid("Amount should be a number");
  return;
}

if (parsedAmount < 0) {
  setValid("Amount cannot be negative");
  return;
}

try {
  if (editId) {
    const { data } = await updateShipment({
      variables: {
        id: editId,
        city: city.trim(),
        amount: parsedAmount,
      },
    });

    if (data?.updateShipment?.message) {
      setValid(data.updateShipment.message);
      return;
    }

    resetForm();
    refetch();
    return;
  }

  const { data } = await createShipment({
    variables: {
      city: city.trim(),
      amount: parsedAmount,
    },
  });

  if (data?.createShipment?.message) {
    setValid(data.createShipment.message);
    return;
  }

  resetForm();
  refetch();
} catch (error) {
  console.error(error);
  setValid("Something went wrong. Please try again.");
}

};

const handleEdit = (shipment: any) => {
setEditId(shipment.id);
setCity(shipment.city);
setAmount(shipment.amount.toString());
setValid("");
};

const handleDelete = async (id: string) => {
try {
await deleteShipment({
variables: { id },
});


  refetch();
} catch (error) {
  console.error(error);
}


};

const columns = [
{
name: "City",
selector: (row: any) => row.city,
sortable: true,
},
{
name: "Amount",
selector: (row: any) => `$${Number(row.amount).toFixed(2)}`,
sortable: true,
},
{
name: "Actions",
cell: (row: any) => ( <div className="flex items-center gap-2">
<button
type="button"
onClick={() => handleEdit(row)}
className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111] text-white transition hover:bg-amber-600"
> <FiEdit size={15} /> </button>


      <button
        type="button"
        onClick={() => handleDelete(row.id)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
      >
        <FiTrash size={15} />
      </button>
    </div>
  ),
},


];

return ( <div className="min-h-screen w-full bg-[#f7f7f5] px-4 py-10 md:px-8"> <div className="mx-auto mt-10 w-full max-w-6xl"> <div className="mb-10 border-b border-gray-200 pb-6"> <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
Shipping Management </p>


      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111]">
            {editId ? "Update Shipment" : "Add Shipment"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage shipping cities and delivery charges.
          </p>
        </div>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="text-sm font-semibold text-gray-500 transition hover:text-red-500"
          >
            Cancel
          </button>
        )}
      </div>
    </div>

    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-16 max-w-3xl space-y-7"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#111]">
          City
        </label>

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="w-full border-b-2 border-gray-200 bg-transparent px-1 py-3 text-[#111] outline-none transition placeholder:text-gray-400 focus:border-amber-600"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#111]">
          Shipping Amount
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter shipping amount"
          min="0"
          step="0.01"
          className="w-full border-b-2 border-gray-200 bg-transparent px-1 py-3 text-[#111] outline-none transition placeholder:text-gray-400 focus:border-amber-600"
        />
      </div>

      {valid && (
        <div className="border-l-4 border-amber-600 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {valid}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={creating || updating}
          className="rounded-xl bg-[#111] px-8 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating || updating
            ? "Saving..."
            : editId
              ? "Update Shipment"
              : "Add Shipment"}
        </button>
      </div>
    </form>

    <div className="border-t border-gray-200 pt-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-amber-600">
            Delivery Areas
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#111]">
            Shipment List
          </h2>
        </div>

        <div className="text-sm text-gray-500">
          {filterdata?.length || 0} cities
        </div>
      </div>

      <div className="mb-5">
        <Searchdatatable search={searchitem} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Reactdatatable
          columns={columns}
          filterproducts={filterdata}
        />
      </div>
    </div>
  </div>
</div>

);
};

export default ShipmentPage;
