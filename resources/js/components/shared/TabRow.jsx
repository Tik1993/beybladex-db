export default function TabRow({ tabs, activeTab, onChange }) {
    return (
        <div className="mb-2 flex flex-nowrap overflow-x-auto gap-2 pb-2 no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    type="button"
                    onClick={() => onChange(tab.key)}
                    className={`rounded-full px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium transition ${
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
