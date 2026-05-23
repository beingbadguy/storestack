"use client";
import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { CategorySkeleton } from "./CategorySkeleton";
import Image from "next/image";
import { STORE_MUTED_BG } from "@/config/storefront";

const Categories = () => {
  const { webSettings } = useAuthStore();
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      setIsCategoryLoading(true);
      const response = await axiosClient.get(API_ENDPOINTS.GET_CATEGORIES, {
        params: {
          tenantId: webSettings?.sellerId,
          isFeatured: true,
          limit: 10,
        },
      });
      console.log(response?.data);
      if (response?.data?.success) {
        setCategories(response?.data?.data);
      }
      setIsCategoryLoading(false);
    } catch (error) {
      console.log(error);
      setIsCategoryLoading(false);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (!webSettings) return;
    fetchCategories();
  }, [webSettings]);

  return (
    <div className="my-10 md:my-20 mx-4 md:px-8">
      <h2 className="text-3xl font-bold">Shop by Category</h2>

      <p className="mt-2 text-gray-500 my-10">
        Browse trending collections across every department.
      </p>
      {isCategoryLoading ? (
        <CategorySkeleton />
      ) : categories && categories?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category: any) => (
            <div
              key={category._id}
              className={`group cursor-pointer overflow-hidden ${STORE_MUTED_BG}`}
            >
              <div className="relative  h-[420px] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-contain transition  duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2 p-5">
                <p className="text-sm text-neutral-500">{category.name}</p>

                {/* <h3 className="text-xl font-semibold uppercase tracking-wide">
                  {category.description}
                </h3> */}

                <button className="pt-2 text-sm font-medium underline underline-offset-4 cursor-pointer">
                  Explore
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
            No Active Categories
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500 md:text-base">
            This store currently does not have any active categories available.
            Please check back later for new collections and product updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default Categories;
