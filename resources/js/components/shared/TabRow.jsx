export default function TabRow({ tabs, activeTab, onChange }) {
    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    type="button"
                    onClick={() => onChange(tab.key)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        activeTab === tab.key
                            ? "bg-cyan-400 text-slate-950"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
