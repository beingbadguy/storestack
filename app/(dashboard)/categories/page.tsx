"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [categories, setCategories] = useState<Category[]>([
    {
      _id: "1",
      name: "Electronics",
      slug: "electronics",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      parentCategory: "-",
      productCount: 124,
      isFeatured: true,
      isActive: true,
      createdAt: "16 Jul 2026",
    },
    {
      _id: "2",
      name: "Smart Phones",
      slug: "smart-phones",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
      parentCategory: "Electronics",
      productCount: 54,
      isFeatured: false,
      isActive: true,
      createdAt: "14 Jul 2026",
    },
    {
      _id: "3",
      name: "Fashion",
      slug: "fashion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      parentCategory: "-",
      productCount: 82,
      isFeatured: true,
      isActive: false,
      createdAt: "10 Jul 2026",
    },
    {
      _id: "4",
      name: "Home Decor",
      slug: "home-decor",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      parentCategory: "-",
      productCount: 37,
      isFeatured: false,
      isActive: true,
      createdAt: "08 Jul 2026",
    },
  ]);

  // Toggle Status
  const toggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category._id === id
          ? {
              ...category,
              isActive: !category.isActive,
            }
          : category,
      ),
    );
  };

  // Toggle Featured
  const toggleFeatured = (id: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category._id === id
          ? {
              ...category,
              isFeatured: !category.isFeatured,
            }
          : category,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      {/* Header */}
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
                {categories.length}
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
                {categories.filter((category) => category.isActive).length}
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
                {categories.filter((category) => !category.isActive).length}
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
                {categories.filter((category) => category.isFeatured).length}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
              <FiStar className="size-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        {/* Table Top */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search categories..."
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          {/* Filter */}
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50">
            <FiFilter className="size-4" />
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Slug
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Parent
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
                        <h2 className="font-semibold text-gray-900">
                          {category.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Product Category
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                      /{category.slug}
                    </span>
                  </td>

                  {/* Parent */}
                  <td className="px-6 py-5 text-sm font-medium text-gray-700">
                    {category.parentCategory}
                  </td>

                  {/* Products */}
                  <td className="px-6 py-5">
                    <span className="font-semibold text-gray-900">
                      {category.productCount}
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleFeatured(category._id)}
                        className="group transition"
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
                        className={`relative h-7 w-14 rounded-full transition-all duration-300 ${
                          category.isActive ? "bg-teal-500" : "bg-gray-300"
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
                    {category.createdAt}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit */}
                      <Link
                        href={`/dashboard/categories/edit/${category._id}`}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                      >
                        <FiEdit2 className="size-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenDeleteModal(true);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
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
            Showing 1 - {categories.length} of {categories.length} categories
          </p>

          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-medium text-white">
              1
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              2
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              3
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiAlertTriangle className="size-7" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Delete Category
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedCategory?.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => setOpenDeleteModal(false)}
                className="h-12 flex-1 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button className="h-12 flex-1 rounded-2xl bg-red-500 text-sm font-medium text-white transition hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
