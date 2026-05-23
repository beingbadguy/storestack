export const ProductSkeleton = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="overflow-hidden bg-neutral-100">
          <div className="h-[320px] animate-pulse bg-neutral-200" />

          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />

              <div className="h-5 w-40 animate-pulse rounded bg-neutral-200" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-5 w-16 animate-pulse rounded bg-neutral-200" />

              <div className="h-4 w-12 animate-pulse rounded bg-neutral-200" />
            </div>

            <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
};
