import { ShieldCheck, Truck, Headphones, RefreshCcw } from "lucide-react";
import { STORE_SURFACE_BG } from "@/config/storefront";
import { TRUST_STRIP_ICONS } from "@/common/config";

export default function TrustStrip(settings: any) {
  console.log(settings, "is the truststrips settings");

  console.log(settings?.settings?.trustStrips, "is the truststrips");
  return (
    <section className={`border-y border-neutral-200 ${STORE_SURFACE_BG}`}>
      <div className="mx-auto flex items-center justify-center max-w-7xl  divide-y divide-neutral-200 md:divide-x md:divide-y-0">
        {settings?.settings?.trustStrips &&
          settings?.settings?.trustStrips.map((item: any, index: number) => {
            const Icon = item.icon;

            const SelectedIcon =
              TRUST_STRIP_ICONS[item.icon as keyof typeof TRUST_STRIP_ICONS];

            return (
              <div
                key={index}
                className="flex items-center gap-4 px-6 py-8 transition hover:bg-neutral-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                  <SelectedIcon className="h-5 w-5 text-neutral-700" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
