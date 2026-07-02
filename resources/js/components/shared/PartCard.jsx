import { useState } from "react";

export default function PartCard({
    item,
    user,
    ownedRecord,
    onAdd,
    onRemove,
    isLibrary,
}) {
    const [adding, setAdding] = useState(false);

    const handleAdd = async () => {
        setAdding(true);
        await onAdd();
        setAdding(false);
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg">
            <div className="overflow-hidden bg-slate-950">
                {item?.img_url ? (
                    <img
                        src={item.img_url}
                        alt={item.name}
                        className="h-44 w-full object-contain p-4"
                    />
                ) : (
                    <div className="flex h-44 items-center justify-center text-sm text-slate-500">
                        No image
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {item?.short_name || item?.name}
                        </h2>

                        {item?.short_name && (
                            <p className="text-xs text-slate-500">
                                {item.name}
                            </p>
                        )}
                    </div>

                    {ownedRecord && (
                        <span className="shrink-0 rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                            x{ownedRecord.quantity}
                        </span>
                    )}
                </div>

                {/* {item?.color && (
                    <p className="mt-1 text-sm text-slate-400">
                        Color: {item.color}
                    </p>
                )} */}

                {user && (
                    <div className="mt-4">
                        {ownedRecord ? (
                            isLibrary ? (
                                <button
                                    type="button"
                                    onClick={() => onRemove(ownedRecord.id)}
                                    className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
                                >
                                    Remove
                                </button>
                            ) : (
                                <div className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2 text-center text-sm text-cyan-300">
                                    ✓ In library
                                </div>
                            )
                        ) : (
                            !isLibrary && (
                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    disabled={adding}
                                    className="w-full rounded-xl border border-slate-700 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                                >
                                    {adding ? "Adding..." : "+ Add to library"}
                                </button>
                            )
                        )}
                    </div>
                )}

                {Array.isArray(item?.official_setups) &&
                    item.official_setups.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                                Appears in
                            </p>
                            <div className="flex flex-col gap-1">
                                {item.official_setups.map((setup, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
                                    >
                                        <p className="text-sm font-medium text-cyan-300">
                                            {setup.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {setup.manufacturer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}
