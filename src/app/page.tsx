export default function HomePage() {
  return (
    <section aria-labelledby="foundation-heading" className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
          Application foundation
        </p>
        <h1
          id="foundation-heading"
          className="text-3xl font-bold tracking-tight"
        >
          Show Up For Life
        </h1>
        <p className="max-w-2xl text-lg text-slate-700">
          Show Up For Life is being built to help people plan in-person
          gatherings without pressure. Accounts and event planning are not open
          yet.
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Current status</h2>
        <p className="mt-2 text-slate-700">
          This early version is not open yet. Privacy, safety, accessibility,
          and gathering features are still being built.
        </p>
      </div>
    </section>
  );
}
