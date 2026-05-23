import { ShieldCheck, Truck, Headphones, RefreshCcw } from "lucide-react";
import { STORE_SURFACE_BG } from "@/config/storefront";

const trustItems = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On all orders over ₹999",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% protected checkout",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    subtitle: "7-day hassle-free returns",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Dedicated customer assistance",
  },
];

export default function TrustStrip() {
  return (
    <section className={`border-y border-neutral-200 ${STORE_SURFACE_BG}`}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-neutral-200 md:grid-cols-4 md:divide-x md:divide-y-0">
        {trustItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-4 px-6 py-8 transition hover:bg-neutral-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                <Icon className="h-5 w-5 text-neutral-700" />
              </div>

              <div>
                <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-neutral-500">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
