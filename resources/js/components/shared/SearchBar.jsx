export default function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="mb-6">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-1 md:py-3 text-slate-100 outline-none transition focus:border-cyan-400 lg:max-w-xl"
            />
        </div>
    );
}
