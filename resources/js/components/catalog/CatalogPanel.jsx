import OfficialSetupCard from "./OfficialSetupCard";
import PartCard from "../shared/PartCard";
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
            <p className="mb-6 text-sm text-slate-400">
                Showing {items.length} result{items.length !== 1 ? "s" : ""}
            </p>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
                    No results found.
                </div>
            ) : activeTab === "official-setups" ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((setup) => (
                        <OfficialSetupCard key={setup.id} setup={setup} />
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {items.map((item) => (
                        <PartCard
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
                        />
                    ))}
                </div>
            )}
        </>
    );
}
