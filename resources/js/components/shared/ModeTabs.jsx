export default function ModeTabs({ mainTab, onChange, user }) {
    return (
        <div className="mb-2 md:mb-5 flex gap-2 border-b border-slate-800 pb-2 md:pb-4">
            <button
                type="button"
                onClick={() => onChange("catalog")}
                className={`rounded-full px-3 md:px-5 py-1 md:py-2 text-xs md:text-sm font-medium transition ${
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
                    className={`rounded-full px-3 md:px-5 py-1 md:py-2 text-xs md:text-sm font-medium transition ${
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
