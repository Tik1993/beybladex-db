export default function ModeTabs({ mainTab, onChange, user }) {
    return (
        <div className="mb-8 flex gap-2 border-b border-slate-800 pb-4">
            <button
                type="button"
                onClick={() => onChange("catalog")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    mainTab === "catalog"
                        ? "bg-cyan-400 text-slate-950"
                        : "text-slate-400 hover:text-white"
                }`}
            >
                BeybladeX Catalog
            </button>

            {user && (
                <button
                    type="button"
                    onClick={() => onChange("library")}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                        mainTab === "library"
                            ? "bg-cyan-400 text-slate-950"
                            : "text-slate-400 hover:text-white"
                    }`}
                >
                    Your Library
                </button>
            )}
        </div>
    );
}
