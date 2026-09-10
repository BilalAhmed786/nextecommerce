"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { get_category, create_poroduct } from "@/app/graphql/product";
import { prodCategory } from "../../../types/layouttype";
import axios from "axios";

export default function ProductForm() {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: 1,
    stock: 1,
    categoryId: "",
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [validation, setValid] = useState("");

  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const otherImagesInputRef = useRef<HTMLInputElement | null>(null);

  const { data } = useQuery<{ categories: prodCategory[] }>(get_category);
  const [createProduct, { loading }] = useMutation(create_poroduct);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setMainImageFile(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setImagesFiles((prev) => [...prev, ...files]);
  };

  const removeImageAtIndex = (index: number) => {
    setImagesFiles((prev) => prev.filter((_, i) => i !== index));

    if (otherImagesInputRef.current) {
      otherImagesInputRef.current.value = "";
    }
  };

  const removeMainImage = () => {
    setMainImageFile(null);

    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValid("");

    if (
      !mainImageFile ||
      !imagesFiles.length ||
      !formValues.name ||
      formValues.price === 0 ||
      formValues.stock === 0 ||
      !formValues.description ||
      !formValues.categoryId
    ) {
      setValid("* All fields are required");
      return;
    }

    try {
      let mainImage = null;

      const mainForm = new FormData();
      mainForm.append("image", mainImageFile);

      const mainResponse = await axios.post("/api/upload/main", mainForm);

      mainImage = mainResponse.data.image;

      const imagesForm = new FormData();

      imagesFiles.forEach((file) => {
        imagesForm.append("images", file);
      });

      const galleryResponse = await axios.post(
        "/api/upload/images",
        imagesForm,
      );

      const galleryImages = galleryResponse.data.images;

      const { data } = await createProduct({
        variables: {
          input: {
            ...formValues,
            image: mainImage?.url || "",
            imagePublicId: mainImage?.publicId || null,
            images: galleryImages.map((img: any) => ({
              url: img.url,
              publicId: img.publicId,
            })),
          },
        },
      });

      setValid(data.createProduct.message);
    } catch (error) {
      console.error(error);
      setValid("Failed to create product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-5 mt-32 lg:mt-20 md:mt-32">
      {" "}
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
        {" "}
        <div className="mb-10 border-b border-gray-200 pb-6">
          {" "}
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-amber-600">
            Product Management{" "}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#111]">
            Create Product
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Add a new product to your store.
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111]">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full border-b-2 border-gray-200 bg-transparent px-1 py-3 text-[#111] outline-none transition focus:border-amber-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111]">
              Description
            </label>

            <textarea
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your product..."
              className="w-full resize-none border-b-2 border-gray-200 bg-transparent px-1 py-3 text-[#111] outline-none transition focus:border-amber-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111]">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formValues.price}
                onChange={handleInputChange}
                step="0.01"
                className="w-full border-b-2 border-gray-200 bg-transparent px-1 py-3 text-[#111] outline-none transition focus:border-amber-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111]">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formValues.stock}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-200 bg-transparent px-1 py-3 text-[#111] outline-none transition focus:border-amber-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111]">
                Category
              </label>

              <select
                name="categoryId"
                value={formValues.categoryId}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-200 bg-transparent px-1 py-3 text-[#111] outline-none transition focus:border-amber-600"
              >
                <option value="">Select category</option>

                {data?.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-[#111]">
              Main Image
            </label>

            {!mainImageFile ? (
              <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white transition hover:border-amber-500 hover:bg-amber-50/30">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-600">
                  +
                </div>

                <span className="font-semibold text-[#111]">
                  Upload main image
                </span>

                <span className="mt-1 text-sm text-gray-400">
                  PNG, JPG or WEBP
                </span>

                <input
                  ref={mainImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative w-fit">
                <img
                  src={URL.createObjectURL(mainImageFile)}
                  alt="Main Preview"
                  className="h-56 w-56 rounded-2xl object-cover shadow-lg"
                />

                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-sm text-white transition hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-[#111]">
              Gallery Images
            </label>

            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-4 transition hover:border-amber-500">
              <span className="font-medium text-gray-700">
                + Add gallery images
              </span>

              <input
                ref={otherImagesInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>

            {imagesFiles.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {imagesFiles.map((img, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Gallery ${index + 1}`}
                      className="h-32 w-full rounded-xl object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImageAtIndex(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-xs text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {validation && (
            <div className="border-l-4 border-amber-600 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {validation}
            </div>
          )}

          <div className="flex justify-end border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="min-w-[160px] rounded-xl bg-[#111] px-7 py-3.5 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
