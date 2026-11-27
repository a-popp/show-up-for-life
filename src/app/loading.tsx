export default function LoadingPage() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg border border-slate-200 bg-white p-6"
    >
      <span className="text-slate-700">Loading…</span>
    </div>
  );
}
