"use client";

import { useMutation, useQuery } from "@apollo/client";
import {
  create_category,
  delete_category,
  get_category,
  update_category,
} from "@/app/graphql/product";
import { useState } from "react";
import Searchdatatable from "../../components/searchdatatable";
import Reactdatatable from "../../components/datatable";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiLayers,
  FiTag,
  FiX,
  FiCheck,
  FiSearch,
} from "react-icons/fi";

interface Category {
  id: string;
  name: string;
}

export default function CategoryPage() {
  const [createCat] = useMutation(create_category);
  const [deleteCat] = useMutation(delete_category);
  const [updateCat] = useMutation(update_category);

  const { data, loading, refetch } = useQuery(get_category);

  const [category, setCategory] = useState("");
  const [validation, setValid] = useState("");

  const [editvalue, setEditvalue] = useState({
    id: "",
    name: "",
  });

  const [search, setSearch] = useState("");

  const isEditing = Boolean(editvalue.id);

  /* ---------------- CREATE ---------------- */

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.trim()) {
      setValid("Please enter a category name.");
      return;
    }

    try {
      const result = await createCat({
        variables: {
          name: category.trim(),
        },
      });

      if (result.data.createCategory.message) {
        setValid(result.data.createCategory.message);
      }

      if (
        result.data.createCategory.message ===
        "Category created successfully"
      ) {
        setCategory("");
        await refetch();
      }
    } catch (error) {
      console.log(error);
      setValid("Something went wrong while creating the category.");
    }
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id: string) => {
    try {
      await deleteCat({
        variables: { id },
      });

      await refetch();
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (cat: Category) => {
    setEditvalue(cat);
    setValid("");
  };

  const changeCategory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setEditvalue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- UPDATE ---------------- */

  const handleupdateForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editvalue.name.trim()) {
      setValid("Please enter a category name.");
      return;
    }

    try {
      const { data } = await updateCat({
        variables: {
          id: editvalue.id,
          name: editvalue.name.trim(),
        },
      });

      setValid(data.upateCategory.message);

      if (!data.upateCategory.message) {
        await refetch();

        setEditvalue({
          id: "",
          name: "",
        });
      }
    } catch (error) {
      console.log(error);
      setValid("Something went wrong while updating the category.");
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredData =
    data?.categories?.filter((cat: Category) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  /* ---------------- TABLE ---------------- */

  const columns = [
    {
      name: "Category",
      selector: (row: Category) => row.name,
      sortable: true,

      cell: (row: Category) => (
        <div className="flex items-center gap-3 py-2">

          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <FiTag
              className="text-amber-600"
              size={17}
            />
          </div>

          <div>
            <p className="font-bold text-gray-900">
              {row.name}
            </p>

            <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">
              Product Category
            </p>
          </div>

        </div>
      ),
    },

    {
      name: "ID",
      selector: (row: Category) => row.id,

      cell: (row: Category) => (
        <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-mono max-w-[180px] truncate">
          {row.id}
        </span>
      ),
    },

    {
      name: "Actions",
      right: true,

      cell: (row: Category) => (
        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => {
              handleEdit(row);
              setValid("");
            }}
            className="group w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-amber-500 hover:text-white transition-all duration-200"
            title="Edit category"
          >
            <FiEdit
              size={15}
              className="transition-transform group-hover:scale-110"
            />
          </button>

          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            className="group w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
            title="Delete category"
          >
            <FiTrash2
              size={15}
              className="transition-transform group-hover:scale-110"
            />
          </button>

        </div>
      ),
    },
  ];

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">

          <div className="relative w-14 h-14 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />

            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">
            Loading categories...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] mt-32 lg:mt-20 md:mt-32 p-5">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2 mb-3">

              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <FiLayers
                  className="text-white"
                  size={18}
                />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                Catalog Management
              </span>

            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950">
              Categories
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Organize your products into clean and manageable
              categories.
            </p>

          </div>

          {/* COUNT */}

          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">

            <div className="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center">
              <FiLayers
                className="text-amber-400"
                size={17}
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                Total Categories
              </p>

              <p className="text-xl font-black text-gray-950">
                {data?.categories?.length || 0}
              </p>
            </div>

          </div>

        </div>

        {/* ================= TOP GRID ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 mb-6">

          {/* CREATE / EDIT CARD */}

          <div className="bg-gray-950 rounded-3xl overflow-hidden shadow-xl shadow-gray-950/10">

            {/* CARD HEADER */}

            <div className="p-6 border-b border-white/10">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    {isEditing ? (
                      <FiEdit
                        className="text-amber-400"
                        size={18}
                      />
                    ) : (
                      <FiPlus
                        className="text-amber-400"
                        size={19}
                      />
                    )}
                  </div>

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400">
                      {isEditing
                        ? "Modify"
                        : "New Category"}
                    </p>

                    <h2 className="text-lg font-bold text-white">
                      {isEditing
                        ? "Update Category"
                        : "Create Category"}
                    </h2>

                  </div>

                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditvalue({
                        id: "",
                        name: "",
                      });

                      setValid("");
                    }}
                    className="w-9 h-9 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                  >
                    <FiX size={17} />
                  </button>
                )}

              </div>

            </div>

            {/* FORM */}

            <div className="p-6">

              <form
                onSubmit={
                  isEditing
                    ? handleupdateForm
                    : handleForm
                }
              >

                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Category Name
                </label>

                <div className="relative">

                  <FiTag
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={17}
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Electronics"
                    value={
                      isEditing
                        ? editvalue.name
                        : category
                    }
                    onChange={
                      isEditing
                        ? changeCategory
                        : (e) => {
                            setCategory(e.target.value);
                            setValid("");
                          }
                    }
                    className="w-full h-13 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition"
                  />

                </div>

                {/* VALIDATION */}

                {validation && (
                  <div
                    className={`mt-3 px-4 py-3 rounded-xl text-xs font-medium ${
                      validation.toLowerCase().includes("success")
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                        : "bg-red-500/10 text-red-400 border border-red-500/10"
                    }`}
                  >
                    {validation}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-5 h-12 rounded-xl bg-amber-500 text-gray-950 font-bold text-sm hover:bg-amber-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                >
                  {isEditing ? (
                    <>
                      <FiCheck size={17} />
                      Update Category
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} />
                      Create Category
                    </>
                  )}
                </button>

              </form>

              {/* HELPER */}

              <div className="flex items-center gap-2 mt-5 pt-5 border-t border-white/10">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                  Categories help customers find products faster
                </p>

              </div>

            </div>

          </div>

          {/* CATEGORY INFO CARD */}

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-600">
                  Overview
                </p>

                <h2 className="text-xl font-black text-gray-950 mt-1">
                  Catalog Structure
                </h2>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <FiLayers
                  className="text-amber-600"
                  size={20}
                />
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="rounded-2xl bg-[#f7f7f5] border border-gray-100 p-5">

                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4">
                  <FiTag
                    className="text-amber-500"
                    size={18}
                  />
                </div>

                <p className="text-2xl font-black text-gray-950">
                  {data?.categories?.length || 0}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Active categories
                </p>

              </div>

              <div className="rounded-2xl bg-gray-950 p-5">

                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <FiLayers
                    className="text-amber-400"
                    size={18}
                  />
                </div>

                <p className="text-2xl font-black text-white">
                  {filteredData.length}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Search results
                </p>

              </div>

            </div>

            {/* INFO */}

            <div className="mt-5 p-4 rounded-2xl border border-amber-100 bg-amber-50/50">

              <div className="flex gap-3">

                <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-500 flex items-center justify-center">
                  <FiTag
                    className="text-white"
                    size={14}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Keep categories simple
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Use clear names that make it easy for
                    customers to understand what products
                    belong in each category.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

          {/* TABLE HEADER */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold text-gray-950">
                  Category List
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Manage and organize your product categories
                </p>

              </div>

              <div className="w-full lg:w-[320px]">
                <Searchdatatable search={setSearch} />
              </div>

            </div>

          </div>

          {/* SEARCH INDICATOR */}

          {search && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">

              <FiSearch
                className="text-gray-400"
                size={14}
              />

              <span className="text-xs text-gray-500">
                Showing{" "}
                <strong className="text-gray-900">
                  {filteredData.length}
                </strong>{" "}
                result
                {filteredData.length !== 1
                  ? "s"
                  : ""}{" "}
                for{" "}
                <strong className="text-amber-600">
                  "{search}"
                </strong>
              </span>

            </div>
          )}

          {/* TABLE */}

          <div className="p-2 sm:p-4 overflow-x-auto">

            <Reactdatatable
              columns={columns}
              filterproducts={filteredData}
            />

          </div>

        </div>

      </div>
    </div>
  );
}
