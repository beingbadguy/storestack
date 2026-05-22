"use client";

import Loader from "@/components/Loader";
import { singlePhotoUpload } from "@/common/singlePhotoUpload";
import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  FiArrowLeft,
  FiBox,
  FiDollarSign,
  FiImage,
  FiPlus,
  FiSave,
  FiStar,
  FiTrash2,
} from "react-icons/fi";

type Category = {
  _id: string;
  name: string;
};

type ProductForm = {
  title: string;

  description: string;

  brand: string;

  category: string;

  price: number;

  compareAtPrice: number;

  costPrice: number;

  stock: number;

  sku: string;

  featured: boolean;

  status: "draft" | "active" | "inactive";

  images: string[];

  thumbnail: string;

  metaTitle: string;

  metaDescription: string;
};

export default function AddProductPage() {
  const router = useRouter();

  const { webSettings } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [uploading, setUploading] = useState(false);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<ProductForm>({
    title: "",

    description: "",

    brand: "",

    category: "",

    price: 0,

    compareAtPrice: 0,

    costPrice: 0,

    stock: 0,

    sku: "",

    featured: false,

    status: "draft",

    images: [],

    thumbnail: "",

    metaTitle: "",

    metaDescription: "",
  });

  const fetchCategories = async () => {
    console.log("Fetching categories for tenant:", webSettings?.tenantId);
    try {
      const res = await axiosClient.get(API_ENDPOINTS.GET_CATEGORIES, {
        params: {
          tenantId: webSettings?.tenantId,
        },
      });

      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!webSettings?.tenantId) return;
    fetchCategories();
  }, [webSettings?.tenantId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    try {
      setUploading(true);

      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const uploaded = await singlePhotoUpload(file);
        uploadedUrls.push(uploaded);
      }

      setFormData((prev) => ({
        ...prev,

        images: [...prev.images, ...uploadedUrls],

        thumbnail: prev.thumbnail || uploadedUrls[0],
      }));

      setImagePreviews((prev) => [...prev, ...uploadedUrls]);

      toast.success("Images uploaded successfully");
    } catch (error) {
      console.log(error);

      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,

      images: updatedImages,

      thumbnail:
        prev.thumbnail === prev.images[index]
          ? updatedImages[0] || ""
          : prev.thumbnail,
    }));

    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.price ||
      !formData.thumbnail
    ) {
      toast.error("Please fill required fields");

      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,

        tenantId: webSettings?.tenantId,
      };

      const res = await axiosClient.post(API_ENDPOINTS.ADD_PRODUCT, payload);

      if (res.data.success) {
        toast.success("Product added successfully");

        router.push("/products");
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      <Loader isLoading={loading || uploading} />

      {/* TOP */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-teal-600"
          >
            <FiArrowLeft className="size-4 transition group-hover:-translate-x-1" />
            Back to Products
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">Add Product</h1>

          <p className="mt-2 text-sm text-gray-500">
            Create and publish a new product.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {/* LEFT */}

        <div className="space-y-6 xl:col-span-2">
          {/* BASIC */}

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter product details.
              </p>
            </div>

            <div className="space-y-5">
              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
                  Product Title
                </label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,

                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter product title"
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
                  Description
                </label>

                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,

                      description: e.target.value,
                    }))
                  }
                  placeholder="Write product description..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              {/* CATEGORY + BRAND */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
                    Category
                  </label>

                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,

                        category: e.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
                    Brand
                  </label>

                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,

                        brand: e.target.value,
                      }))
                    }
                    placeholder="Nike"
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PRICING */}

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Pricing & Inventory
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                {
                  label: "Price",
                  key: "price",
                },
                {
                  label: "Compare At Price",
                  key: "compareAtPrice",
                },
                {
                  label: "Cost Price",
                  key: "costPrice",
                },
                {
                  label: "Stock",
                  key: "stock",
                },
              ].map((item) => (
                <div key={item.key}>
                  <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
                    {item.label}
                  </label>

                  <input
                    type="number"
                    value={formData[item.key as keyof ProductForm] as number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,

                        [item.key]: Number(e.target.value),
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              ))}
            </div>

            {/* SKU */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
                SKU
              </label>

              <input
                type="text"
                value={formData.sku}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,

                    sku: e.target.value,
                  }))
                }
                placeholder="SKU-12345"
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* SEO */}

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Meta Title"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,

                    metaTitle: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-teal-500"
              />

              <textarea
                rows={4}
                placeholder="Meta Description"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,

                    metaDescription: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="space-y-6">
          {/* MEDIA */}

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Images
              </h2>
            </div>

            <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/50">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                <FiImage className="size-8 text-gray-400" />
              </div>

              <p className="mt-5 text-sm font-semibold text-gray-700">
                Upload Product Images
              </p>

              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            {/* PREVIEW */}

            {imagePreviews.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {imagePreviews.map((image, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-2xl border border-gray-100"
                  >
                    <Image
                      src={image}
                      alt="Preview"
                      width={300}
                      height={300}
                      className="h-32 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SETTINGS */}

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="space-y-5">
              {/* FEATURED */}

              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div>
                  <h3 className="font-medium text-gray-900">Featured</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Show on homepage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,

                      featured: !prev.featured,
                    }))
                  }
                >
                  <FiStar
                    className={`size-6 ${
                      formData.featured
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,

                      status: e.target.value as any,
                    }))
                  }
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-teal-500"
                >
                  <option value="draft">Draft</option>

                  <option value="active">Active</option>

                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <FiSave className="size-4" />

            {loading ? "Saving Product..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
