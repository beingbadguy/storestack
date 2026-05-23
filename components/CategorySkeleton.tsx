export function CategorySkeleton() {
  return (
    <section className="w-full px-6 py-16 md:px-12">
      <div className="mb-10 space-y-3">
        <div className="h-10 w-72 animate-pulse rounded bg-neutral-200" />

        <div className="h-4 w-[500px] animate-pulse rounded bg-neutral-200" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="overflow-hidden rounded-3xl bg-neutral-100">
            <div className="h-[420px] animate-pulse bg-neutral-200" />

            <div className="space-y-3 p-5">
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />

              <div className="h-6 w-56 animate-pulse rounded bg-neutral-200" />

              <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
