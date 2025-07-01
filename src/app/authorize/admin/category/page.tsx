'use client';

import { useMutation, useQuery } from '@apollo/client';
import { create_category, delete_category, get_category, update_category } from '@/app/graphql/product';
import { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function CategoryPage() {
  const [createCat] = useMutation(create_category);
  const [deleteCat] = useMutation(delete_category);
  const [updateCat] = useMutation(update_category)
  const { data, loading, refetch } = useQuery(get_category);
  const [category, setCategory] = useState<string>('');
  const [validation, setValid] = useState<string>('');
  const [editvalue, setEditvalue] = useState({ id: '', name: '' })
  const [search, setSearch] = useState('');

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createCat({
        variables: { name: category },
      });

      if (result.data.createCategory.message) {
        setValid(result.data.createCategory.message);
      }

      if (result.data.createCategory.message === 'Category created successfully') {
        setCategory('');
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {

    try {
      const { data } = await deleteCat({ variables: { id } });
      refetch();

      console.log(data)
    } catch (error) {

      console.log(error)
    }

  };

  const handleEdit = (cat: { id: string, name: string }) => {

    setEditvalue(cat)
  }

  const changeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target

    setEditvalue({ ...editvalue, [name]: value })


  }

  const handleupdateForm = async (e: React.FormEvent) => {

    e.preventDefault()
    
    try {

      const { data } = await updateCat({
        variables: editvalue
      })

        setValid(data.upateCategory.message)
      if (!data.upateCategory.message) {

        await refetch()

      }

    } catch (error) {

      console.log(error)
    }

  }

  const columns = [
    {
      name: 'Name',
      selector: (row: any) => row.name,
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
            }} // Replace with edit logic
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredData = data?.categories?.filter((cat: any) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="w-full flex flex-col items-center px-4">
      {!editvalue.id ?
        <>
          <h1 className="text-xl font-bold mb-4">Create Category</h1>

          <form onSubmit={handleForm} className="flex flex-col items-center space-y-4 w-[55%]">
            <input
              type="text"
              placeholder="Category Name"
              className="w-full border px-3 py-2 rounded"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />

            {validation && <div className="text-red-500 text-center w-full">{validation}</div>}

            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
              Save
            </button>
          </form>
        </>
        :
        <>
          <div className='w-full flex justify-evenly'>
            <h1 className="text-xl font-bold mb-4">Update Category</h1>
            <button
              className='-mt-2 cursor-pointer'
              onClick={() => {
                setEditvalue({ id: '', name: '' })
                setValid('')
            }}
            >X
            </button>
          </div>

          <form onSubmit={handleupdateForm} className="flex flex-col items-center space-y-4 w-[55%]">

            <input
              type="text"
              placeholder="Category Name"
              name='name'
              className="w-full border px-3 py-2 rounded"
              value={editvalue.name}
              onChange={changeCategory}
            />
            {validation && <div className="text-red-500 text-center w-full">{validation}</div>}
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
              Update
            </button>

          </form>
        </>
      }

      {/* Search bar */}
      <div className="mt-8 mb-4 w-[55%]">
        <input
          type="text"
          placeholder="Search category..."
          className="w-full border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Data table */}
      <div className="flex flex-col items-center">
        <DataTable
          title=""
          columns={columns}
          data={filteredData || []}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
}
