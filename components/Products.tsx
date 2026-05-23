"use client";

import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductSkeleton } from "./ProductsSkeleton";
import { STORE_MUTED_BG } from "@/config/storefront";

const Products = () => {
  const { webSettings } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsProductLoading(true);

      const response = await axiosClient.get(API_ENDPOINTS.GET_PRODUCTS, {
        params: {
          tenantId: webSettings?.sellerId,
          limit: 8,
          isFeatured: true,
        },
      });

      if (response?.data?.success) {
        setProducts(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
    }
  };

  useEffect(() => {
    if (!webSettings) return;

    fetchProducts();
  }, [webSettings]);

  return (
    <section className="my-10 md:my-20 mx-4 md:px-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold">Featured Products</h2>

        <p className="mt-2 text-gray-500">
          Discover premium products curated for modern lifestyles.
        </p>
      </div>

      {isProductLoading ? (
        <ProductSkeleton />
      ) : products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: any) => (
            <div
              key={product._id}
              className={`group overflow-hidden ${STORE_MUTED_BG}`}
            >
              <div className="relative h-[320px] overflow-hidden">
                <Image
                  src={product?.thumbnail}
                  alt={product?.title}
                  fill
                  className="object-contain transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-3 p-5">
                <div>
                  <p className="text-sm text-neutral-500">
                    {product?.category?.name}
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    {product?.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">₹{product?.price}</p>

                  {product?.compareAtPrice && (
                    <p className="text-sm text-neutral-400 line-through">
                      ₹{product?.compareAtPrice}
                    </p>
                  )}
                </div>

                <button className="cursor-pointer pt-2 text-sm font-medium underline underline-offset-4">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`flex min-h-[350px] flex-col items-center justify-center rounded-3xl ${STORE_MUTED_BG} px-6 text-center`}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            No Active Products
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500 md:text-base">
            This store currently does not have any active products available.
            Please check back later for new arrivals and featured collections.
          </p>
        </div>
      )}
    </section>
  );
};

export default Products;
