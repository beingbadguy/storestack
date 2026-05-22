"use client";

import { singleMediaUpload } from "@/common/singleMediaUpload";
import Loader from "@/components/Loader";
import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiUpload, BiX } from "react-icons/bi";
import { FiArrowLeft, FiImage, FiSave, FiStar, FiTrash2 } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

type CategoryForm = {
  name: string;
  description: string;
  isFeatured: boolean;
  image: string;
  isActive: boolean;
};

export default function AddCategoryPage() {
  const { webSettings } = useAuthStore();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
    description: "",
    isFeatured: false,
    image: "",
    isActive: true,
  });

  const generateDescription = async () => {
    try {
      if (!formData.name) {
        toast.error("Please enter category name to generate description.");
        return;
      }

      setGenerating(true);

      const response = await axiosClient.post(
        API_ENDPOINTS.GENERATE_DESCRIPTION,
        {
          categoryName: formData.name,
        },
      );

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,

          description: response.data.description,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setGenerating(false);
    }
  };

  // Handle Image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
    uploadImage(file);
  };

  const uploadImage = async (file: File | null) => {
    if (!file) {
      toast.error("No file selected for upload.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }
    setLoading(true);
    try {
      const categoryPhotoLink = await singleMediaUpload(file);
      console.log("Uploaded image URL:", categoryPhotoLink);
      setFormData((prev) => ({ ...prev, image: categoryPhotoLink }));
      setLoading(false);
    } catch (error) {
      toast.error("Failed to upload image.");
      console.log(error);
      setLoading(false);
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.image) {
      toast.error("Please fill all required fields and upload an image.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        image: formData.image,
        tenantId: webSettings?.tenantId,
      };

      const res = await axiosClient.post(API_ENDPOINTS.ADD_CATEGORY, payload);
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message || "Category created successfully!");
        setFormData({
          name: "",
          description: "",
          isFeatured: false,
          image: "",
          isActive: true,
        });
        setImagePreview("");
        setImageFile(null);
        router.push("/categories");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  md:p-6">
      {/* Top */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-teal-600"
          >
            <FiArrowLeft className="size-4 transition group-hover:-translate-x-1" />
            Back to Categories
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Add Category
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new category for your store products.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {/* Left */}
        <div className="space-y-6 xl:col-span-2">
          {/* Basic Info */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your category details.
              </p>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm uppercase font-medium text-gray-500">
                  Category Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter category name"
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-2 block uppercase text-sm font-medium text-gray-500">
                    Description
                  </label>

                  {/* <button
                    type="button"
                    onClick={generateDescription}
                    disabled={generating}
                    className="rounded-xl bg-teal-500 hover:bg-teal-600 px-4 py-2 text-sm font-medium text-white transition my-2 cursor-pointer"
                  >
                    {generating ? "Generating..." : "✨ Generate With AI"}
                  </button> */}
                </div>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Write category description..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Upload */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Category Image
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload category thumbnail.
              </p>
            </div>

            {!imagePreview ? (
              <label className="group flex h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-300 hover:border-teal-400 hover:bg-teal-50/50">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm transition-all group-hover:scale-110">
                  <FiImage className="size-8 text-gray-400 group-hover:text-teal-500" />
                </div>

                <p className="mt-5 text-sm font-semibold text-gray-700">
                  Upload Category Image
                </p>

                <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP</p>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div>
                <div className="relative  rounded-3xl border border-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={500}
                    height={500}
                    className="h-64 w-full object-contain rounded-xl bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                      setFormData((prev) => ({ ...prev, image: "" }));
                    }}
                    className="absolute -right-3 -top-3 rounded-full bg-red-500 p-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-red-600 cursor-pointer"
                  >
                    <FiTrash2 className="size-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure category visibility.
              </p>
            </div>

            <div className="space-y-5">
              {/* Featured */}
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
                      isFeatured: !prev.isFeatured,
                    }))
                  }
                  className="transition cursor-pointer"
                >
                  <FiStar
                    className={`size-6 transition-all ${
                      formData.isFeatured
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              </div>

              {/* Active */}
              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div>
                  <h3 className="font-medium text-gray-900">Active Status</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Visible in store.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }))
                  }
                  className={`relative h-7 w-14 rounded-full transition-all duration-300 cursor-pointer ${
                    formData.isActive ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                      formData.isActive ? "left-8" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          <Loader isLoading={loading} />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 text-md font-medium text-white shadow-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-xl cursor-pointer"
          >
            <FiSave className="size-4 transition group-hover:scale-110" />

            {loading ? "Saving Category..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
