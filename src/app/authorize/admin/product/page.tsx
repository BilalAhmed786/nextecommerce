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
  const { data } = useQuery<{ categories: prodCategory[] }>(get_category);
  const [createProduct] = useMutation(create_poroduct);
  const [validation, setValid] = useState("");

  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const otherImagesInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
    setImagesFiles([...imagesFiles, ...files]);
  };

  const removeImageAtIndex = (index: number) => {
    const newFiles = imagesFiles.filter((_, i) => i !== index);
    setImagesFiles(newFiles);
    if (otherImagesInputRef.current) {
      otherImagesInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !mainImageFile ||
      !imagesFiles.length ||
      !formValues.name ||
      formValues.price === 0 ||
      formValues.stock === 0 ||
      !formValues.description ||
      !formValues.categoryId
    ) {
      setValid("*All fields required");
      return;
    }

    try {
      // Upload main image
      let mainImage: { url: string; publicId: string } | null = null;
      if (mainImageFile) {
        const mainForm = new FormData();
        mainForm.append("image", mainImageFile);
        const { data } = await axios.post("/api/upload/main", mainForm);
        mainImage = data.image; 
      }

      // Upload gallery images
      let galleryImages: { url: string; publicId: string }[] = [];
      if (imagesFiles.length > 0) {
        const imagesForm = new FormData();
        imagesFiles.forEach((file) => imagesForm.append("images", file));
        const { data } = await axios.post("/api/upload/images", imagesForm);
        galleryImages = data.images; 
      }

      // Now send all to GraphQL
      const { data } = await createProduct({
        variables: {
          input: {
            ...formValues,
            image: mainImage?.url || "",
            imagePublicId: mainImage?.publicId || null,
            images: galleryImages.map((img) => ({
              url: img.url,
              publicId: img.publicId,
            })),
          },
        },
      });

      setValid(data.createProduct.message);
    } catch (err) {
      console.error(err);
      alert("Failed to create product.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 w-[80%] rounded mx-auto mt-20"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Create Product</h2>

      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formValues.price}
            onChange={handleInputChange}
            step="0.01"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={formValues.stock}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Category</label>
        <select
          name="categoryId"
          value={formValues.categoryId}
          onChange={handleInputChange}
          className="w-[40%] border px-1 py-2 rounded"
        >
          <option value="">Select a category</option>
          {data?.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleMainImageChange}
          className="block mt-1"
          ref={mainImageInputRef}
        />
        {mainImageFile && (
          <div className="mt-2 flex items-center gap-2">
            <img
              src={URL.createObjectURL(mainImageFile)}
              alt="Main Preview"
              className="h-24 w-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => {
                setMainImageFile(null);
                if (mainImageInputRef.current) {
                  mainImageInputRef.current.value = "";
                }
              }}
              className="text-red-500 hover:underline text-sm"
            >
              x
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block font-medium">Other Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="block mt-1"
          ref={otherImagesInputRef}
        />
        {imagesFiles.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {imagesFiles.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${idx}`}
                  className="h-20 w-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImageAtIndex(idx)}
                  className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {validation ? (
        <div className="text-red-500 text-center">{validation}</div>
      ) : (
        ""
      )}
      <button
        type="submit"
        className="block m-auto bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
      >
        Submit
      </button>
    </form>
  );
}
