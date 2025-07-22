'use client';

import { useMutation, useQuery } from '@apollo/client';
import { create_category, delete_category, get_category, update_category } from '@/app/graphql/product';
import { useState } from 'react';
import Searchdatatable from '../../components/searchdatatable';
import Reactdatatable from '../../components/datatable';
import { FiEdit, FiTrash } from 'react-icons/fi';
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
            className="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            <FiEdit/>
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600"
          >
           <FiTrash/>
          </button>
        </div>
      ),
    },
  ];

  const filteredData = data?.categories?.filter((cat: any) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="w-full flex flex-col items-center mt-20">
      {!editvalue.id ?
        <>
          <h1 className="block font-semibold w-full text-2xl text-center m-5">Create Category</h1>

          <form onSubmit={handleForm} className="w-full flex flex-col items-center space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              className="w-[76%] h-12 border rounded p-3"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />

            {validation && <div className="text-red-500 text-center w-full">{validation}</div>}

            <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 cursor-pointer">
              Save
            </button>
          </form>
        </>
        :
        <>
          <div className='flex justify-evenly relative'>
            <h1 className="font-semibold w-full text-2xl text-center m-5">Update Category</h1>
            <button
              className='absolute top-6 -left-7 cursor-pointer border-1 px-1 rounded-full text-xs'
              onClick={() => {
                setEditvalue({ id: '', name: '' })
                setValid('')
            }}
            >X
            </button>
          </div>

          <form onSubmit={handleupdateForm} className="w-full flex flex-col items-center space-y-4 rounded">

            <input
              type="text"
              placeholder="Category Name"
              name='name'
              className="w-[76%] border px-3 py-2 rounded h-12 outline-0"
              value={editvalue.name}
              onChange={changeCategory}
            />
            {validation && <div className="text-red-500 text-center w-full">{validation}</div>}
            <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 cursor-pointer">
              Update
            </button>

          </form>
        </>
      }

     <div className='w-full'>
        <Searchdatatable search={setSearch}/>
    </div>

      {/* Data table */}
      <div className="w-full">
        <Reactdatatable columns={columns} filterproducts={filteredData}/>
      </div>
    </div>
  );
}
