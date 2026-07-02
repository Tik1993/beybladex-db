import { useState } from "react";
import OfficialSetupCard from "./OfficialSetupCard";
import CatalogPartCard from "./CatalogPartCard";
import { getOwnedPart } from "../../utils/collection";

export default function CatalogPanel({
    activeTab,
    loading,
    error,
    items,
    user,
    collectionForTab,
    onAdd,
    onRemove,
}) {
    const [gridSize, setGridSize] = useState(3);

    const gridClass = {
        1: "grid gap-4 grid-cols-1",
        3: "grid gap-4 grid-cols-2 md:grid-cols-3",
        6: "grid gap-4 grid-cols-3 md:grid-cols-6",
    }[gridSize];

    const [selectedSetup, setSelectedSetup] = useState(null);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-slate-400">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                <p className="text-red-300">{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-400">
                    Showing {items.length} result{items.length !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-1">
                    {[
                        { size: 1, label: "▢" },
                        { size: 3, label: "☷" },
                        { size: 6, label: "▦" },
                    ].map(({ size, label }) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setGridSize(size)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                                gridSize === size
                                    ? "bg-cyan-400 text-slate-950"
                                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
                    No results found.
                </div>
            ) : activeTab === "official-setups" ? (
                <div className={gridClass}>
                    {items.map((setup) => (
                        <OfficialSetupCard
                            key={setup.id}
                            setup={setup}
                            compact={true}
                            onClick={() => setSelectedSetup(setup)}
                        />
                    ))}
                </div>
            ) : (
                <div className={gridClass}>
                    {items.map((item) => (
                        <CatalogPartCard
                            key={item.id}
                            item={item}
                            user={user}
                            ownedRecord={collectionForTab.find((record) => {
                                const part = getOwnedPart(record, activeTab);
                                return part?.id === item.id;
                            })}
                            onAdd={() => onAdd(activeTab, item.id)}
                            onRemove={(ownedId) => onRemove(activeTab, ownedId)}
                            isLibrary={false}
                            activeTab={activeTab}
                            compact={true}
                            onClick={() => setSelectedSetup(item)}
                        />
                    ))}
                </div>
            )}
            {selectedSetup && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
                    onClick={() => setSelectedSetup(null)}
                >
                    <div
                        className="w-full max-w-md overflow-y-auto max-h-[90vh] rounded-3xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {" "}
                        {/* Close button */}
                        <div className="flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={() => setSelectedSetup(null)}
                                className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-400 hover:text-white transition"
                            >
                                ✕ Close
                            </button>
                        </div>
                        {activeTab === "official-setups" ? (
                            <OfficialSetupCard
                                setup={selectedSetup}
                                compact={false}
                            />
                        ) : (
                            <CatalogPartCard
                                item={selectedSetup}
                                user={user}
                                ownedRecord={collectionForTab.find((record) => {
                                    const part = getOwnedPart(
                                        record,
                                        activeTab,
                                    );
                                    return part?.id === item.id;
                                })}
                                onAdd={() => onAdd(activeTab, item.id)}
                                onRemove={(ownedId) =>
                                    onRemove(activeTab, ownedId)
                                }
                                isLibrary={false}
                                activeTab={activeTab}
                                onClick={() => setSelectedSetup(setup)}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
