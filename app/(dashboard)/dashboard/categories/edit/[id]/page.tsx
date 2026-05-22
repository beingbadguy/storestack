"use client";

import { singleMediaUpload } from "@/common/singleMediaUpload";
import Loader from "@/components/Loader";
import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiImage, FiSave, FiStar, FiTrash2 } from "react-icons/fi";

type CategoryForm = {
  name: string;
  description: string;
  isFeatured: boolean;
  image: string;
  isActive: boolean;
};

export default function EditCategoryPage() {
  const { webSettings } = useAuthStore();
  const router = useRouter();

  const params = useParams();

  const categoryId = params.id as string;

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  const [generating, setGenerating] = useState(false);

  const [imagePreview, setImagePreview] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
    description: "",
    isFeatured: false,
    image: "",
    isActive: true,
  });

  // FETCH CATEGORY
  const fetchCategory = async () => {
    try {
      setFetching(true);

      const response = await axiosClient.get(`/api/category/${categoryId}`);

      if (response.data.success) {
        const category = response.data.data;

        setFormData({
          name: category.name || "",

          description: category.description || "",

          image: category.image || "",

          isFeatured: category.isFeatured,

          isActive: category.isActive,
        });

        setImagePreview(category.image);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch category");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  // AI DESCRIPTION
  const generateDescription = async () => {
    try {
      if (!formData.name) {
        toast.error("Please enter category name first");

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

      toast.error("Failed to generate description");
    } finally {
      setGenerating(false);
    }
  };

  // IMAGE CHANGE
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));

    await uploadImage(file);
  };

  // IMAGE UPLOAD
  const uploadImage = async (file: File) => {
    try {
      const imageUrl = await singleMediaUpload(file);

      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (error) {
      console.log(error);

      toast.error("Failed to upload image");
    }
  };

  // UPDATE CATEGORY
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.image) {
      toast.error("Please fill all required fields");

      return;
    }

    try {
      setLoading(true);

      const response = await axiosClient.patch(
        API_ENDPOINTS.UPDATE_CATEGORY(categoryId),
        {
          ...formData,
          tenantId: webSettings?.tenantId,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Category updated successfully");

        router.push("/categories");
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader isLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      {/* HEADER */}
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
            Edit Category
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your category information.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {/* LEFT */}
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update category details.
              </p>
            </div>

            <div className="space-y-5">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
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

              {/* DESCRIPTION */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-2 block text-sm font-medium uppercase text-gray-500">
                    Description
                  </label>

                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={generating}
                    className="my-2 cursor-pointer rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
                  >
                    {generating ? "Generating..." : "✨ Generate With AI"}
                  </button>
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

        {/* RIGHT */}
        <div className="space-y-6">
          {/* IMAGE */}
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
              <div className="relative rounded-3xl border border-gray-100">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={500}
                  height={500}
                  className="h-64 w-full rounded-xl bg-gray-50 object-contain"
                />

                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");

                    setImageFile(null);

                    setFormData((prev) => ({
                      ...prev,
                      image: "",
                    }));
                  }}
                  className="absolute -right-3 -top-3 cursor-pointer rounded-full bg-red-500 p-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-red-600"
                >
                  <FiTrash2 className="size-5" />
                </button>
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure category visibility.
              </p>
            </div>

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
                      isFeatured: !prev.isFeatured,
                    }))
                  }
                  className="cursor-pointer transition"
                >
                  <FiStar
                    className={`size-6 transition-all ${
                      formData.isFeatured
                        ? "scale-110 fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              </div>

              {/* ACTIVE */}
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
                  className={`relative h-7 w-14 cursor-pointer rounded-full transition-all duration-300 ${
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

          <Loader isLoading={loading || generating} />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="group flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-teal-500 text-md font-medium text-white shadow-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-xl"
          >
            <FiSave className="size-4 transition group-hover:scale-110" />

            {loading ? "Updating Category..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
