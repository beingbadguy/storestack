"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { STORE_SURFACE_BG } from "@/config/storefront";

const testimonials = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Verified Customer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    review:
      "The quality exceeded my expectations. Everything from packaging to delivery felt premium.",
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Happy Shopper",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    review:
      "Beautiful experience from start to finish. The products feel thoughtfully curated and premium.",
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Returning Customer",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
    review:
      "Fast delivery, excellent support, and amazing product quality. Definitely ordering again.",
  },
];

export default function Testimonials() {
  return (
    <section className={`py-16 px-4 md:my-24 md:px-8 ${STORE_SURFACE_BG}`}>
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-5xl">Loved by Customers</h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-500 md:text-base">
          Hear what customers are saying about their experience with our store
          and products.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-3xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-black text-black" />
              ))}
            </div>

            <p className="text-sm leading-7 text-neutral-600 md:text-base">
              "{testimonial.review}"
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900">
                  {testimonial.name}
                </h3>

                <p className="text-sm text-neutral-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
