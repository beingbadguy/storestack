"use client";

import Loader from "@/components/Loader";
import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiLeftArrow } from "react-icons/bi";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiGrid,
  FiCheckCircle,
  FiAlertTriangle,
  FiStar,
} from "react-icons/fi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  parentCategory?: string;
  productCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function CategoriesPage() {
  const { webSettings } = useAuthStore();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [featuredFilter, setFeaturedFilter] = useState(false);

  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");

  const [stats, setStats] = useState({
    totalCategories: 0,
    totalActiveCategories: 0,
    totalInactiveCategories: 0,
    totalFeaturedCategories: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  // Toggle Status
  const toggleStatus = async (id: string) => {
    try {
      const response = await axiosClient.patch(
        API_ENDPOINTS.UPDATE_CATEGORY(id),
        {
          isActive: !categories.find((category) => category._id === id)
            ?.isActive,
        },
      );

      console.log(response.data);
      fetchCategories(page);
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle Featured
  const toggleFeatured = async (id: string) => {
    try {
      const response = await axiosClient.patch(
        API_ENDPOINTS.UPDATE_CATEGORY(id),
        {
          isFeatured: !categories.find((category) => category._id === id)
            ?.isFeatured,
        },
      );

      console.log(response.data);
      fetchCategories(page);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async (page: number = 1) => {
    const tenantId = webSettings?.tenantId;
    console.log("Fetching categories for tenantId:", tenantId);
    setLoading(true);
    try {
      const res = await axiosClient.get(API_ENDPOINTS.GET_CATEGORIES, {
        params: {
          tenantId: webSettings?.tenantId,
          page,
          limit: 10,
          search: search.trim() ? search.trim() : undefined,
          status: statusFilter,
          isFeatured: featuredFilter,
          sortBy,
        },
      });
      console.log(res.data);
      if (res.data.success) {
        setCategories(res.data.data);
        setTotal(res.data.total);
        setStats(res.data.stats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page, webSettings?.tenantId]);

  const handleCategoryDelete = async () => {
    console.log("Deleting category with ID:", selectedCategory?._id);
    setLoading(true);
    try {
      const res = await axiosClient.delete(
        API_ENDPOINTS.DELETE_CATEGORY(selectedCategory!._id),
      );
      console.log(res.data);
      if (res.data.success) {
        setOpenDeleteModal(false);
        fetchCategories(page);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      {/* Header */}
      <Loader isLoading={loading} />
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your product categories and hierarchy.
          </p>
        </div>

        <Link
          href="/dashboard/categories/add"
          className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal-700"
        >
          <FiPlus className="size-4" />
          Add Category
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.totalCategories}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <FiGrid className="size-7" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-teal-600">
                {stats?.totalActiveCategories}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <FiCheckCircle className="size-7" />
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Inactive Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-500">
                {stats?.totalInactiveCategories}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiAlertTriangle className="size-7" />
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Featured Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-500">
                {stats?.totalFeaturedCategories}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
              <FiStar className="size-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className=" rounded-3xl border border-gray-100 bg-white shadow-sm relative">
        {/* Table Top */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          {/* Filter */}
          <button
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white cursor-pointer text-gray-600 transition hover:bg-gray-50"
            onClick={() => {
              setShowFilter(!showFilter);
            }}
          >
            <FiFilter className="size-4" />
          </button>
        </div>
        {showFilter && (
          <div className="absolute right-5 top-20 z-20 w-[320px] rounded-3xl border border-gray-100 bg-white p-5 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

              <button
                onClick={() => {
                  setStatusFilter("all");
                  setFeaturedFilter(false);
                  setSortBy("latest");
                }}
                className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
              >
                Reset all
              </button>
            </div>

            {/* Status */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-gray-500">Status</p>

              <div className="space-y-3">
                {[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ].map((item) => (
                  <label
                    key={item.value}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === item.value}
                      onChange={() =>
                        setStatusFilter(item.value as "active" | "inactive")
                      }
                      className="size-4 accent-teal-600"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-gray-500">Options</p>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={featuredFilter}
                  onChange={() => setFeaturedFilter(!featuredFilter)}
                  className="size-4  accent-teal-500 "
                />

                <span className="text-sm font-medium text-gray-700">
                  Featured Categories
                </span>
              </label>
            </div>

            {/* Sort */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-gray-500">Sort By</p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Latest",
                    value: "latest",
                  },
                  {
                    label: "Oldest",
                    value: "oldest",
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSortBy(item.value as "latest" | "oldest")}
                    className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                      sortBy === item.value
                        ? "border-teal-500 bg-teal-50 text-teal-600"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div
                className=" mt-3 text-center bg-teal-500 text-white p-2 rounded-3xl border-gray-100 w-full cursor-pointer hover:bg-teal-600 transition-all"
                onClick={() => {
                  fetchCategories(page);
                  setShowFilter(false);
                }}
              >
                Apply
              </div>
            </div>
          </div>
        )}

        {categories.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Products
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Featured
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-gray-50 transition hover:bg-gray-50/60"
                    >
                      {/* Category */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <h2 className="font-semibold text-gray-500">
                              {category.name}
                            </h2>

                            {/* <p className="mt-1 text-sm text-gray-500">
                          Product Category
                        </p> */}
                          </div>
                        </div>
                      </td>

                      {/* Slug */}

                      {/* Products */}
                      <td className="px-6 py-5">
                        <span className="font-medium text-gray-500">
                          {category.productCount}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleFeatured(category._id)}
                            className="group transition cursor-pointer"
                          >
                            <FiStar
                              className={`size-5 transition-all duration-200 ${
                                category.isFeatured
                                  ? "fill-yellow-400 text-yellow-400 scale-110"
                                  : "text-gray-300 hover:text-yellow-400"
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleStatus(category._id)}
                            className={`relative h-7 w-14 cursor-pointer rounded-full transition-all duration-300 ${
                              category.isActive ? "bg-teal-500" : "bg-gray-300 "
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                                category.isActive ? "left-8" : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {format(
                          new Date(category.createdAt),
                          "dd MMM yyyy • hh:mm a",
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          <Link
                            href={`/dashboard/categories/edit/${category._id}`}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 cursor-pointer"
                          >
                            <FiEdit2 className="size-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setSelectedCategory(category);
                              setOpenDeleteModal(true);
                            }}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 cursor-pointer"
                          >
                            <FiTrash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 10 + 1} -{" "}
                {(page - 1) * 10 + categories.length} of {total} categories
              </p>

              <div className="flex items-center gap-2">
                {/* <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-medium text-white">
              1
            </button>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              onClick={() => {
                setPage(2);
                fetchCategories(2);
              }}
            >
              2
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              3
            </button> */}
                {
                  <button
                    disabled={page === 1}
                    className={`mr-2  flex items-center justify-ceter px-4 py-2 rounded-xl text-sm font-medium text-gray-600 transition
                      ${page === 1 ? "hover:bg-gray-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
                      
                      `}
                    onClick={() => setPage(page - 1)}
                  >
                    <MdChevronLeft />
                    Prev
                  </button>
                }
                {Array.from(
                  { length: Math.ceil(total / 10) },
                  (_, i) => i + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200  text-sm font-medium  transition  cursor-pointer ${
                      pageNumber === page
                        ? "bg-teal-600 text-white"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* {page < Math.ceil(total / 10) && (
                  <button
                    className="flex h-10 w-14 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition hover:bg-gray-50 cursor-pointer"
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                )} */}

                {/* {page < Math.ceil(total / 10) && (
                  <button
                    className="flex h-10 w-14 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition hover:bg-gray-50 cursor-pointer"
                    onClick={() => setPage(Math.ceil(total / 10))}
                  >
                    Last
                  </button>
                )} */}

                {
                  <button
                    disabled={page === Math.ceil(total / 10)}
                    className={`mr-2  flex items-center justify-ceter px-4 py-2 rounded-xl text-sm font-medium text-gray-600 transition
                      ${page === Math.ceil(total / 10) ? "hover:bg-gray-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
                      
                      `}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                    <MdChevronRight />
                  </button>
                }
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
              {/* Icon */}
              <div className="flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                <FiSearch className="size-10 text-gray-400" />
              </div>

              {/* Title */}
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                No Categories Found
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                We couldn’t find any categories matching your current search.
                Try using different keywords or create a new category to get
                started.
              </p>

              {/* Actions */}
              <div className="mt-8 flex items-center gap-3">
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}

                <Link
                  href="/dashboard/categories/add"
                  className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                  <FiPlus className="size-4" />
                  Add Category
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex size-10 md:size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiAlertTriangle className="size-4 md:size-7" />
            </div>

            <h2 className="mt-5 md:text-2xl font-bold text-gray-900">
              Delete Category
            </h2>

            <p className="mt-1 md:mt-3 text-xs md:text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedCategory?.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => setOpenDeleteModal(false)}
                className=" h-8 md:h-12 flex-1 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                className=" h-8 md:h-12 flex-1 rounded-2xl bg-red-500 text-sm font-medium text-white transition hover:bg-red-600 cursor-pointer"
                onClick={handleCategoryDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
