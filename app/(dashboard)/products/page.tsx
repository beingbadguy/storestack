"use client";

import Loader from "@/components/Loader";
import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiCheckCircle,
  FiAlertTriangle,
  FiStar,
  FiBox,
} from "react-icons/fi";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type Product = {
  _id: string;

  title: string;

  description?: string;

  category: {
    _id: string;
    name: string;
  };

  brand?: string;

  price: number;

  compareAtPrice?: number;

  stock: number;

  status: "draft" | "active" | "inactive";

  featured: boolean;

  thumbnail?: string;

  averageRating: number;

  reviewCount: number;

  salesCount: number;

  createdAt: string;
};

export default function ProductsPage() {
  const { webSettings } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [showFilter, setShowFilter] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "draft"
  >("all");

  const [featuredFilter, setFeaturedFilter] = useState(false);

  const [stockFilter, setStockFilter] = useState<
    "all" | "inStock" | "lowStock" | "outOfStock"
  >("all");

  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    featuredProducts: 0,
  });

  const fetchProducts = async (page: number = 1) => {
    setLoading(true);

    try {
      const res = await axiosClient.get(API_ENDPOINTS.GET_PRODUCTS, {
        params: {
          tenantId: webSettings?.tenantId,
          page,
          limit: 10,
          search,
          status: statusFilter,
          featured: featuredFilter,
          stock: stockFilter,
          sortBy,
        },
      });
      console.log(res.data);

      if (res.data.success) {
        console.log(res.data.data);
        setProducts(res.data.data);

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
    if (!webSettings?.tenantId) return;
    fetchProducts(page);
  }, [
    search,
    statusFilter,
    featuredFilter,
    stockFilter,
    sortBy,
    page,
    webSettings?.tenantId,
  ]);

  const toggleFeatured = async (id: string) => {
    try {
      await axiosClient.patch(API_ENDPOINTS.UPDATE_PRODUCT(id), {
        featured: !products.find((product) => product._id === id)?.featured,
        tenantId: webSettings?.tenantId,
      });

      fetchProducts(page);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      await axiosClient.patch(API_ENDPOINTS.UPDATE_PRODUCT(id), {
        status: currentStatus === "active" ? "inactive" : "active",
        tenantId: webSettings?.tenantId,
      });

      fetchProducts(page);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await axiosClient.delete(
        API_ENDPOINTS.DELETE_PRODUCT(selectedProduct!._id),
      );

      setOpenDeleteModal(false);

      fetchProducts(page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountPercentage = (price: number, compareAtPrice?: number) => {
    if (!compareAtPrice) return 0;

    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      <Loader isLoading={loading} />

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your products, inventory and pricing.
          </p>
        </div>

        <Link
          href="/dashboard/products/add"
          className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal-700"
        >
          <FiPlus className="size-4" />
          Add Product
        </Link>
      </div>

      {/* STATS */}

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalProducts}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <FiPackage className="size-7" />
            </div>
          </div>
        </div>

        {/* ACTIVE */}

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-teal-600">
                {stats.activeProducts}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <FiCheckCircle className="size-7" />
            </div>
          </div>
        </div>

        {/* OUT OF STOCK */}

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Out Of Stock</p>

              <h2 className="mt-2 text-3xl font-bold text-red-500">
                {stats.outOfStockProducts}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiAlertTriangle className="size-7" />
            </div>
          </div>
        </div>

        {/* FEATURED */}

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Featured Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-500">
                {stats.featuredProducts}
              </h2>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
              <FiStar className="size-7" />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="relative rounded-3xl border border-gray-100 bg-white shadow-sm">
        {/* TOP */}

        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}

          <div className="relative w-full md:max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          {/* FILTER */}

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
          >
            <FiFilter className="size-4" />
          </button>
        </div>

        {/* FILTER MODAL */}

        {showFilter && (
          <div className="absolute right-5 top-20 z-20 w-[340px] rounded-3xl border border-gray-100 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

              <button
                onClick={() => {
                  setStatusFilter("all");

                  setFeaturedFilter(false);

                  setStockFilter("all");

                  setSortBy("latest");
                }}
                className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
              >
                Reset
              </button>
            </div>

            {/* STATUS */}

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-gray-500">Status</p>

              <div className="space-y-3">
                {["active", "inactive", "draft"].map((item) => (
                  <label key={item} className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={statusFilter === item}
                      onChange={() => setStatusFilter(item as any)}
                      className="size-4 accent-teal-600"
                    />

                    <span className="capitalize text-sm text-gray-700">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* STOCK */}

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-gray-500">Stock</p>

              <div className="space-y-3">
                {[
                  {
                    label: "In Stock",
                    value: "inStock",
                  },
                  {
                    label: "Low Stock",
                    value: "lowStock",
                  },
                  {
                    label: "Out Of Stock",
                    value: "outOfStock",
                  },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={stockFilter === item.value}
                      onChange={() => setStockFilter(item.value as any)}
                      className="size-4 accent-teal-600"
                    />

                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* FEATURED */}

            <div className="mt-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featuredFilter}
                  onChange={() => setFeaturedFilter(!featuredFilter)}
                  className="size-4 accent-teal-600"
                />

                <span className="text-sm text-gray-700">Featured Products</span>
              </label>
            </div>

            {/* SORT */}

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
                    onClick={() => setSortBy(item.value as any)}
                    className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                      sortBy === item.value
                        ? "border-teal-500 bg-teal-50 text-teal-600"
                        : "border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}

        {products && products.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Featured
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Rating
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Sales
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-50 hover:bg-gray-50/60"
                    >
                      {/* PRODUCT */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
                            {product.thumbnail ? (
                              <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <FiBox className="text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div>
                            <h2 className="font-semibold text-gray-900">
                              {product.title}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                              {product.brand || "No Brand"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-5">
                        <span className="rounded-xl bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                          {product.category?.name}
                        </span>
                      </td>

                      {/* PRICE */}

                      <td className="px-6 py-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              ₹{product.price}
                            </span>

                            {product.compareAtPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{product.compareAtPrice}
                              </span>
                            )}
                          </div>

                          {product.compareAtPrice &&
                            product.compareAtPrice > product.price && (
                              <div className="mt-1 inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-600">
                                {getDiscountPercentage(
                                  product.price,
                                  product.compareAtPrice,
                                )}
                                % OFF
                              </div>
                            )}
                        </div>
                      </td>

                      {/* STOCK */}

                      <td className="px-6 py-5">
                        {product.stock === 0 ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                            Out Of Stock
                          </span>
                        ) : product.stock < 5 ? (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-600">
                            Low Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-600">
                            In Stock ({product.stock})
                          </span>
                        )}
                      </td>

                      {/* FEATURED */}

                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleFeatured(product._id)}
                            className="cursor-pointer"
                          >
                            <FiStar
                              className={`size-5 ${
                                product.featured
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              toggleStatus(product._id, product.status)
                            }
                            className={`relative h-7 w-14 rounded-full transition ${
                              product.status === "active"
                                ? "bg-teal-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                                product.status === "active"
                                  ? "left-8"
                                  : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* RATING */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1">
                          <FiStar className="fill-yellow-400 text-yellow-400" />

                          <span className="font-medium text-gray-800">
                            {product.averageRating}
                          </span>

                          <span className="text-sm text-gray-500">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </td>

                      {/* SALES */}

                      <td className="px-6 py-5">
                        <span className="font-medium text-gray-700">
                          {product.salesCount}
                        </span>
                      </td>

                      {/* CREATED */}

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {format(new Date(product.createdAt), "dd MMM yyyy")}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/products/edit/${product._id}`}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                          >
                            <FiEdit2 className="size-4" />
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedProduct(product);

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

            <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 10 + 1} -{" "}
                {(page - 1) * 10 + products.length} of {total} products
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <MdChevronLeft />
                  Prev
                </button>

                {Array.from(
                  {
                    length: Math.ceil(total / 10),
                  },
                  (_, i) => i + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium ${
                      page === pageNumber
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  disabled={page === Math.ceil(total / 10)}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Next
                  <MdChevronRight />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            {/* ICON */}

            <div className="flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
              <FiPackage className="size-10 text-gray-400" />
            </div>

            {/* TITLE */}

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              No Products Found
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
              You don&apos;t have any products yet. Start building your
              inventory by creating your first product.
            </p>

            {/* ACTIONS */}

            <div className="mt-8 flex items-center gap-3">
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Clear Search
                </button>
              )}

              <Link
                href="/dashboard/products/add"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                <FiPlus className="size-4" />
                Add Product
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}

      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiAlertTriangle className="size-7" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Delete Product
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedProduct?.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => setOpenDeleteModal(false)}
                className="h-12 flex-1 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="h-12 flex-1 rounded-2xl bg-red-500 text-sm font-medium text-white hover:bg-red-600"
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
