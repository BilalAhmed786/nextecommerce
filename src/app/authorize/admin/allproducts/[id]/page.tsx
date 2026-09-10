"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  get_category,
  update_product,
  getsingle_product,
  deletegallery_image,
} from "@/app/graphql/product";
import axios from "axios";
import {
  FiArrowLeft,
  FiCheck,
  FiImage,
  FiPackage,
  FiTrash2,
  FiUploadCloud,
  FiX,
  FiDollarSign,
  FiLayers,
  FiBox,
} from "react-icons/fi";

interface dataImages {
  id: string;
  url: string;
}

export default function EditProductForm() {
  const param = useParams();
  const id = param?.id;
  const router = useRouter();

  const {
    data: productData,
    loading,
    refetch,
  } = useQuery(getsingle_product, {
    variables: { id },
  });

  const { data: categoryData } = useQuery(get_category);

  const [updateProduct] = useMutation(update_product);
  const [deletgalleryimg] = useMutation(deletegallery_image);

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: 1,
    stock: 1,
    image: "",
    categoryId: "",
    imagePublicId: "",
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imagesFiles, setImagesFiles] = useState<(File | dataImages)[]>([]);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const otherImagesRef = useRef<HTMLInputElement>(null);
  const [valdiation, setValid] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (productData?.getSingleproduct) {
      const {
        name,
        description,
        price,
        stock,
        category,
        image,
        images,
        imagePublicId,
      } = productData.getSingleproduct;

      setFormValues({
        name,
        description,
        price,
        stock,
        image,
        imagePublicId,
        categoryId: category.id,
      });

      setImagesFiles(images);
    }
  }, [productData]);

  function getImagePreview(image: File | dataImages) {
    return image instanceof File ? URL.createObjectURL(image) : image.url;
  }

  const handleRemoveImage = async (
    index: number,
    imageId: string | null
  ) => {
    setImagesFiles((prev) => prev.filter((_, i) => i !== index));

    if (imageId) {
      try {
        await deletgalleryimg({
          variables: { id: imageId },
        });
      } catch (error) {
        console.error("Failed to delete gallery image", error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: ["price", "stock"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleMainImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMainImageFile(file);
    setValid("");
  };

  const handleOtherImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    setImagesFiles((prev) => [...prev, ...files]);
    setValid("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (!mainImageFile && !formValues.image) ||
      !formValues.name ||
      formValues.price === 0 ||
      !formValues.description ||
      !formValues.categoryId
    ) {
      setValid("* Please complete all required fields.");
      return;
    }

    try {
      setUpdating(true);
      setValid("");

      let mainImage = {
        url: formValues.image,
        publicId: formValues.imagePublicId || "",
      };

      if (mainImageFile) {
        const form = new FormData();
        form.append("image", mainImageFile);

        const { data } = await axios.post("/api/upload/main", form);

        mainImage = {
          url: data.image.url,
          publicId: data.image.publicId,
        };
      }

      const newFiles = imagesFiles.filter(
        (img) => img instanceof File
      ) as File[];

      let uploadedGalleryImages:
        | { url: string; publicId: string }[]
        | undefined;

      if (newFiles.length > 0) {
        const form = new FormData();

        newFiles.forEach((file) => {
          form.append("images", file);
        });

        const { data } = await axios.post(
          "/api/upload/images",
          form
        );

        uploadedGalleryImages = data.images;
      }

      const { data } = await updateProduct({
        variables: {
          input: {
            id,
            name: formValues.name,
            description: formValues.description,
            price: formValues.price,
            stock: formValues.stock,
            categoryId: formValues.categoryId,
            image: mainImage.url,
            imagePublicId: mainImage.publicId,
            ...(uploadedGalleryImages && {
              images: uploadedGalleryImages,
            }),
          },
        },
      });

      if (data.updateProduct.message) {
        await refetch();
        router.push("/authorize/admin/allproducts");
      }
    } catch (err) {
      console.error("Update failed", err);
      setValid("Something went wrong while updating the product.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  const currentProduct = productData?.getSingleproduct;

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-4 mt-34 lg:mt-24 md:mt-34">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              router.push("/authorize/admin/allproducts")
            }
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-950 transition mb-5"
          >
            <FiArrowLeft size={16} />
            Back to Products
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <FiPackage
                    className="text-white"
                    size={18}
                  />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                  Product Management
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950">
                Edit Product
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Update product information, pricing, inventory and
                images.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-gray-600">
                Product Active
              </span>
            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

            {/* LEFT */}
            <div className="space-y-6">

              {/* BASIC INFORMATION */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center">
                      <FiLayers
                        className="text-amber-400"
                        size={18}
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-950">
                        Basic Information
                      </h2>

                      <p className="text-xs text-gray-400 mt-0.5">
                        Product details and classification
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">

                  {/* NAME */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formValues.description}
                      onChange={handleChange}
                      placeholder="Describe your product..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none resize-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    />
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Category
                    </label>

                    <select
                      name="categoryId"
                      value={formValues.categoryId}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none cursor-pointer transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    >
                      <option value="">
                        Select category
                      </option>

                      {categoryData?.categories.map(
                        (cat: any) => (
                          <option
                            key={cat.id}
                            value={cat.id}
                          >
                            {cat.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                </div>
              </div>

              {/* PRICING / INVENTORY */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <FiDollarSign
                        className="text-amber-600"
                        size={19}
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-950">
                        Pricing & Inventory
                      </h2>

                      <p className="text-xs text-gray-400 mt-0.5">
                        Manage price and available stock
                      </p>
                    </div>

                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* PRICE */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                        $
                      </span>

                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={formValues.price}
                        onChange={handleChange}
                        className="w-full h-12 pl-9 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                      />
                    </div>
                  </div>

                  {/* STOCK */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Stock Quantity
                    </label>

                    <div className="relative">
                      <FiBox
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={17}
                      />

                      <input
                        type="number"
                        name="stock"
                        min="0"
                        value={formValues.stock}
                        onChange={handleChange}
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* GALLERY */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-100">

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center">
                        <FiImage
                          className="text-amber-400"
                          size={18}
                        />
                      </div>

                      <div>
                        <h2 className="font-bold text-gray-950">
                          Product Gallery
                        </h2>

                        <p className="text-xs text-gray-400 mt-0.5">
                          Manage product images
                        </p>
                      </div>

                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {imagesFiles.length} Images
                    </span>

                  </div>
                </div>

                <div className="p-6">

                  {/* MAIN IMAGE */}
                  <div className="mb-7">

                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-gray-800">
                        Main Image
                      </label>

                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600">
                        Featured
                      </span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 aspect-[16/8] sm:aspect-[16/7]">

                      <img
                        src={
                          mainImageFile
                            ? URL.createObjectURL(mainImageFile)
                            : formValues.image
                        }
                        alt={formValues.name || "Product"}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">

                        <div className="flex items-end justify-between">

                          <div>
                            <p className="text-white font-bold text-sm">
                              {mainImageFile
                                ? "New image selected"
                                : "Current product image"}
                            </p>

                            <p className="text-white/60 text-xs mt-1">
                              Main product thumbnail
                            </p>
                          </div>

                          {mainImageFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setMainImageFile(null);

                                if (mainImageRef.current) {
                                  mainImageRef.current.value = "";
                                }
                              }}
                              className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur text-white flex items-center justify-center hover:bg-red-500 transition"
                            >
                              <FiX size={17} />
                            </button>
                          )}

                        </div>
                      </div>

                    </div>

                    <input
                      ref={mainImageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        mainImageRef.current?.click()
                      }
                      className="mt-3 w-full h-11 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm font-semibold text-gray-600 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition flex items-center justify-center gap-2"
                    >
                      <FiUploadCloud size={17} />
                      {mainImageFile
                        ? "Change Main Image"
                        : "Replace Main Image"}
                    </button>

                  </div>

                  {/* GALLERY UPLOAD */}
                  <div>

                    <div className="flex items-center justify-between mb-3">

                      <label className="text-sm font-bold text-gray-800">
                        Gallery Images
                      </label>

                      <span className="text-xs text-gray-400">
                        Multiple images
                      </span>

                    </div>

                    <input
                      ref={otherImagesRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleOtherImagesChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        otherImagesRef.current?.click()
                      }
                      className="w-full min-h-[120px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-amber-400 hover:bg-amber-50/50 transition flex flex-col items-center justify-center"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-3">
                        <FiUploadCloud
                          className="text-amber-500"
                          size={21}
                        />
                      </div>

                      <p className="text-sm font-bold text-gray-700">
                        Add gallery images
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Click to select multiple images
                      </p>
                    </button>

                    {/* IMAGE GRID */}
                    {imagesFiles.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">

                        {imagesFiles.map((img, idx) => (

                          <div
                            key={
                              "id" in img
                                ? img.id
                                : `${idx}-${getImagePreview(img)}`
                            }
                            className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group"
                          >

                            <img
                              src={getImagePreview(img)}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage(
                                  idx,
                                  "id" in img
                                    ? img.id
                                    : null
                                )
                              }
                              className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
                            >
                              <FiTrash2 size={14} />
                            </button>

                            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] font-bold text-white">
                              {idx + 1}
                            </div>

                          </div>

                        ))}

                      </div>
                    )}

                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">

              {/* PREVIEW CARD */}
              <div className="bg-gray-950 rounded-3xl overflow-hidden shadow-xl shadow-gray-950/10">

                <div className="p-6">

                  <div className="flex items-center justify-between mb-5">

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400">
                        Live Preview
                      </p>

                      <h3 className="text-lg font-bold text-white mt-1">
                        Product Card
                      </h3>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <FiPackage
                        className="text-amber-400"
                        size={17}
                      />
                    </div>

                  </div>

                  <div className="rounded-2xl overflow-hidden bg-white">

                    <div className="aspect-square bg-gray-100 overflow-hidden">

                      <img
                        src={
                          mainImageFile
                            ? URL.createObjectURL(mainImageFile)
                            : formValues.image
                        }
                        alt={formValues.name || "Product"}
                        className="w-full h-full object-cover"
                      />

                    </div>

                    <div className="p-5">

                      <p className="text-[10px] uppercase tracking-wider font-bold text-amber-600">
                        {currentProduct?.category?.name ||
                          "Product"}
                      </p>

                      <h4 className="font-bold text-gray-950 mt-1 line-clamp-2">
                        {formValues.name || "Product Name"}
                      </h4>

                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                        {formValues.description ||
                          "Product description will appear here."}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">

                        <span className="text-xl font-black text-gray-950">
                          ${Number(formValues.price).toFixed(2)}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            Number(formValues.stock) > 0
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {Number(formValues.stock) > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>

                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* PRODUCT STATUS */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

                <h3 className="font-bold text-gray-950">
                  Product Summary
                </h3>

                <div className="mt-5 space-y-4">

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Price
                    </span>

                    <span className="font-bold text-gray-900">
                      ${Number(formValues.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Stock
                    </span>

                    <span className="font-bold text-gray-900">
                      {formValues.stock} units
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Gallery
                    </span>

                    <span className="font-bold text-gray-900">
                      {imagesFiles.length} images
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center gap-2">

                    <FiCheck
                      className="text-emerald-500"
                      size={16}
                    />

                    <span className="text-xs font-medium text-gray-500">
                      Product information is ready
                    </span>

                  </div>

                </div>
              </div>

              {/* UPDATE CARD */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

                {valdiation && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600">
                    {valdiation}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full h-13 rounded-xl bg-gray-950 text-white font-bold text-sm hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-gray-950/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <FiCheck size={17} />
                      Update Product
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/authorize/admin/allproducts")
                  }
                  className="w-full mt-3 h-11 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <div className="flex items-center justify-center gap-2 mt-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    Changes are saved securely
                  </p>
                </div>

              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
