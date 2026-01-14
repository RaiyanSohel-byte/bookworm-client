export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex items-center gap-4">
      <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">
          {label}
        </p>
        <p className="text-2xl font-serif text-stone-900">{value}</p>
      </div>
    </div>
  );
}
