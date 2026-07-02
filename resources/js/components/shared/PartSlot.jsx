import { useState } from "react";
export default function PartSlot({ title, item }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {title}
                    </p>
                    <p className="mt-0.5 font-semibold text-white">
                        {item?.short_name || item?.name || "Not set"}
                    </p>
                    {/* {item?.color && (
                        <p className="text-xs text-slate-500">{item.color}</p>
                    )} */}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {item?.img_url && (
                        <img
                            src={item.img_url}
                            alt={item.name || title}
                            className="h-10 w-10 rounded-lg object-contain"
                        />
                    )}
                    <span
                        className={`text-slate-500 transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                        }`}
                    >
                        ▾
                    </span>
                </div>
            </button>

            {open && (
                <div className="border-t border-slate-800 bg-slate-900 px-4 pb-4 pt-3">
                    {item?.img_url ? (
                        <img
                            src={item.img_url}
                            alt={item.name || title}
                            className="h-36 w-full rounded-xl object-contain"
                        />
                    ) : (
                        <div className="flex h-36 items-center justify-center text-sm text-slate-500">
                            No image
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
