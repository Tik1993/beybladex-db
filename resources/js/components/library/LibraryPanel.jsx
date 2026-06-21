export default function LibraryPanel({ activeTab, user, items, onRemove }) {
    if (!user) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
                Please login to view your library.
            </div>
        );
    }

    return (
        <>
            <p className="mb-6 text-sm text-slate-400">
                Showing {items.length} saved item{items.length !== 1 ? "s" : ""}
            </p>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
                    No saved items yet.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {items.map(({ ownedRecord, part }) => (
                        <PartCard
                            key={ownedRecord.id}
                            item={part}
                            user={user}
                            ownedRecord={ownedRecord}
                            onAdd={() => {}}
                            onRemove={(ownedId) => onRemove(activeTab, ownedId)}
                            isLibrary={true}
                            activeTab={activeTab}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
