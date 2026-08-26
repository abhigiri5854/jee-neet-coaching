export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-lavender" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-64 animate-pulse rounded-2xl bg-lavender" />
        ))}
      </div>
    </div>
  );
}
