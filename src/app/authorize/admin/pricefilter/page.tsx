"use client";

import React, { useState } from "react";
import Searchdatatable from "../../components/searchdatatable";
import Reactdatatable from "../../components/datatable";
import { FiEdit, FiTrash, FiDollarSign, FiPlus } from "react-icons/fi";

import {
get_price_filter,
create_price_filter,
update_price_filter,
delete_price_filter,
} from "@/app/graphql/product";
import { useQuery, useMutation } from "@apollo/client";

interface PriceFilter {
id: string;
amount: string;
}

const PriceFilterPage = () => {
const [range, setRange] = useState("");
const [search, setSearch] = useState("");
const [editId, setEditId] = useState<string | null>(null);
const [valid, setValid] = useState("");

const { data, refetch } = useQuery(get_price_filter);

const [createPriceFilter, { loading: creating }] =
useMutation(create_price_filter);

const [updatePriceFilter, { loading: updating }] =
useMutation(update_price_filter);

const [deletePriceFilter] = useMutation(delete_price_filter);

const resetForm = () => {
setRange("");
setEditId(null);
setValid("");
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setValid("");


if (!range.trim()) {
  setValid("Please enter a price range");
  return;
}

try {
  if (editId) {
    const { data } = await updatePriceFilter({
      variables: {
        id: editId,
        range: range.trim(),
      },
    });

    if (data?.updatePriceFilter?.message) {
      setValid(data.updatePriceFilter.message);
      return;
    }

    resetForm();
    refetch();
  } else {
    const { data } = await createPriceFilter({
      variables: {
        range: range.trim(),
      },
    });

    if (data?.createPriceFilter?.message) {
      setValid(data.createPriceFilter.message);
      return;
    }

    resetForm();
    refetch();
  }
} catch (error) {
  console.error(error);
  setValid("Something went wrong. Please try again.");
}


};

const handleEdit = (item: PriceFilter) => {
setEditId(item.id);
setRange(item.amount);
setValid("");
};

const handleDelete = async (id: string) => {
try {
await deletePriceFilter({
variables: { id },
});


  refetch();
} catch (error) {
  console.error(error);
}


};

const filteredData = (data?.pricefilter || []).filter(
(item: PriceFilter) =>
item.amount.toLowerCase().includes(search.toLowerCase())
);

const columns = [
{
name: "Price Range",
selector: (row: PriceFilter) => row.amount,
sortable: true,
cell: (row: PriceFilter) => ( <div className="flex items-center gap-3"> <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600"> <FiDollarSign size={17} /> </div>


      <span className="font-semibold text-[#111]">
        {row.amount}
      </span>
    </div>
  ),
},
{
  name: "Actions",
  cell: (row: PriceFilter) => (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleEdit(row)}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111] text-white transition hover:bg-amber-600"
      >
        <FiEdit size={15} />
      </button>

      <button
        type="button"
        onClick={() => handleDelete(row.id)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
      >
        <FiTrash size={15} />
      </button>
    </div>
  ),
},


];

return ( <div className="min-h-screen w-full bg-[#f7f7f5] p-4 mt-28 lg:mt-20 md:mt-28"> <div className="mx-auto mt-10 w-full max-w-6xl">


    <div className="mb-10 border-b border-gray-200 pb-7">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-600">
        Store Management
      </p>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
            Price Ranges
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create and manage price filter ranges for your store.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          {filteredData.length} ranges
        </div>
      </div>
    </div>

    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-16 max-w-3xl"
    >
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-semibold text-[#111]">
          {editId ? "Update Price Range" : "Add Price Range"}
        </label>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:text-red-500"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiDollarSign
            className="absolute left-1 top-1/2 -translate-y-1/2 text-amber-600"
            size={18}
          />

          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="Price range e.g. 0-50"
            className="w-full border-b-2 border-gray-200 bg-transparent py-4 pl-8 pr-2 text-[#111] outline-none transition placeholder:text-gray-400 focus:border-amber-600"
          />
        </div>

        <button
          type="submit"
          disabled={creating || updating}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#111] px-7 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {editId ? (
            "Update Range"
          ) : (
            <>
              <FiPlus size={17} />
              Add Range
            </>
          )}
        </button>
      </div>

      {valid && (
        <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {valid}
        </div>
      )}
    </form>

    <div className="border-t border-gray-200 pt-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
            Available Filters
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#111]">
            Price Range List
          </h2>
        </div>
      </div>

      <div className="mb-5">
        <Searchdatatable search={setSearch} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Reactdatatable
          columns={columns}
          filterproducts={filteredData}
        />
      </div>
    </div>
  </div>
</div>


);
};

export default PriceFilterPage;
