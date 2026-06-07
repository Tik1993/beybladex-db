import React, { useEffect, useMemo, useState, useDeferredValue } from "react";

const TOP_TABS = [
    {
        key: "official-setups",
        label: "Official Setups",
        endpoint: "/api/official-setups",
    },
    { key: "blades", label: "Blade", endpoint: "/api/blades" },
    { key: "ratchets", label: "Ratchet", endpoint: "/api/ratchets" },
    { key: "bits", label: "Bit", endpoint: "/api/bits" },
    {
        key: "cx-lock-chips",
        label: "Lock Chip",
        endpoint: "/api/cx-lock-chips",
    },
    {
        key: "cx-over-blades",
        label: "Over Blade",
        endpoint: "/api/cx-over-blades",
    },
    {
        key: "cx-metal-blades",
        label: "Metal Blade",
        endpoint: "/api/cx-metal-blades",
    },
    {
        key: "cx-auxiliary-blades",
        label: "Auxiliary Blade",
        endpoint: "/api/cx-auxiliary-blades",
    },
];

const SETUP_SUBTAGS = ["All", "BX", "UX", "CX"];

export default function Main() {
    const [activeTab, setActiveTab] = useState("official-setups");
    const [activeSubTag, setActiveSubTag] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState({});
    const [loading, setLoading] = useState({});
    const [error, setError] = useState({});

    const deferredSearch = useDeferredValue(searchTerm);

    useEffect(() => {
        const tab = TOP_TABS.find((t) => t.key === activeTab);
        if (!tab || data[activeTab] !== undefined) return;

        setLoading((prev) => ({ ...prev, [activeTab]: true }));

        fetch(tab.endpoint, {
            headers: { Accept: "application/json" },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch ${tab.label}`);
                return res.json();
            })
            .then((json) => setData((prev) => ({ ...prev, [activeTab]: json })))
            .catch((err) =>
                setError((prev) => ({ ...prev, [activeTab]: err.message })),
            )
            .finally(() =>
                setLoading((prev) => ({ ...prev, [activeTab]: false })),
            );
    }, [activeTab, data]);

    const handleTabChange = (key) => {
        setActiveTab(key);
        setSearchTerm("");
        setActiveSubTag("All");
    };

    const isLoading = loading[activeTab];
    const hasError = error[activeTab];
    const rawData = data[activeTab] ?? [];

    const filtered = useMemo(() => {
        const term = deferredSearch.trim().toLowerCase();

        return rawData.filter((item) => {
            if (activeTab === "official-setups" && activeSubTag !== "All") {
                if (item.type !== activeSubTag) return false;
            }

            if (!term) return true;

            const searchableText = [
                item.name,
                item.short_name,
                item.manufacturer,
                item.type,
                item.color,
                item.blade?.name,
                item.ratchet?.name,
                item.bit?.name,
                item.cx_lock_chip?.name,
                item.cx_over_blade?.name,
                item.cx_metal_blade?.name,
                item.cx_auxiliary_blade?.name,
                ...(item.official_setups?.map((s) => s.name) ?? []),
                ...(item.official_setups?.map((s) => s.manufacturer) ?? []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(term);
        });
    }, [rawData, deferredSearch, activeTab, activeSubTag]);

    const activeTabLabel =
        TOP_TABS.find((t) => t.key === activeTab)?.label ?? "";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <header className="mb-8">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                        Beyblade DB
                    </p>
                    <h1 className="mt-2 text-4xl font-bold text-white">
                        Parts &amp; Setups
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-300">
                        Search official setups and part catalogs by type, name,
                        and related components.
                    </p>
                </header>

                <div className="mb-6 flex flex-wrap gap-2">
                    {TOP_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => handleTabChange(tab.key)}
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

                {activeTab === "official-setups" && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {SETUP_SUBTAGS.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setActiveSubTag(tag)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                    activeSubTag === tag
                                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                                        : "border-slate-700 text-slate-400 hover:border-slate-500"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search ${activeTabLabel}...`}
                        className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 lg:max-w-xl"
                    />
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-slate-400">Loading...</p>
                    </div>
                )}

                {hasError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                        <p className="text-red-300">{hasError}</p>
                    </div>
                )}

                {!isLoading && !hasError && (
                    <>
                        <p className="mb-6 text-sm text-slate-400">
                            Showing {filtered.length} result
                            {filtered.length !== 1 ? "s" : ""}
                        </p>

                        {filtered.length === 0 ? (
                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
                                No results found.
                            </div>
                        ) : activeTab === "official-setups" ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {filtered.map((setup) => (
                                    <OfficialSetupCard
                                        key={setup.id}
                                        setup={setup}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {filtered.map((item) => (
                                    <PartCard key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function OfficialSetupCard({ setup }) {
    const isCX = setup.type === "CX";

    const components = isCX
        ? [
              { label: "Lock Chip", item: setup.cx_lock_chip },
              { label: "Over Blade", item: setup.cx_over_blade },
              { label: "Metal Blade", item: setup.cx_metal_blade },
              { label: "Auxiliary Blade", item: setup.cx_auxiliary_blade },
          ]
        : [{ label: "Blade", item: setup.blade }];

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg">
            <div className="border-b border-slate-800 bg-slate-950 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                            Official Setup
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                            {setup.name}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">
                            Manufacturer: {setup.manufacturer}
                        </p>
                    </div>

                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                        {setup.type}
                    </span>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl bg-slate-800">
                    {setup.image_url ? (
                        <img
                            src={setup.image_url}
                            alt={setup.name}
                            className="h-56 w-full object-contain"
                        />
                    ) : (
                        <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                            No official setup image
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 p-5">
                <SectionTitle title={isCX ? "CX Parts" : "Blade"} />
                <div className="grid gap-4 sm:grid-cols-2">
                    {components.map(({ label, item }) => (
                        <PartSlot key={label} title={label} item={item} />
                    ))}
                </div>

                <SectionTitle title="Ratchet" />
                <PartSlot title="Ratchet" item={setup.ratchet} />

                <SectionTitle title="Bit" />
                <PartSlot title="Bit" item={setup.bit} />
            </div>
        </div>
    );
}

function PartCard({ item }) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg">
            <div className="overflow-hidden bg-slate-950">
                {item.img_url ? (
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
                <h2 className="text-lg font-semibold text-white">
                    {item.name}
                </h2>

                {item.short_name && (
                    <p className="mt-1 text-sm text-slate-400">
                        Short name: {item.short_name}
                    </p>
                )}

                {item.color && (
                    <p className="mt-1 text-sm text-slate-400">
                        Color: {item.color}
                    </p>
                )}

                {Array.isArray(item.official_setups) &&
                    item.official_setups.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                                Appears in
                            </p>
                            <div className="flex flex-col gap-1">
                                {item.official_setups.map((s, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
                                    >
                                        <p className="text-sm font-medium text-cyan-300">
                                            {s.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {s.manufacturer}
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

function PartSlot({ title, item }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950">
            {/* Always visible row — name first, tap to expand image */}
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
                    {item?.color && (
                        <p className="text-xs text-slate-500">{item.color}</p>
                    )}
                </div>

                {/* Thumbnail + chevron */}
                <div className="flex shrink-0 items-center gap-2">
                    {item?.img_url && (
                        <img
                            src={item.img_url}
                            alt={item.name || title}
                            className="h-10 w-10 rounded-lg object-contain"
                        />
                    )}
                    <span
                        className={`text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    >
                        ▾
                    </span>
                </div>
            </button>

            {/* Expanded image — shown on tap */}
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

function SectionTitle({ title }) {
    return (
        <div className="pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                {title}
            </h3>
        </div>
    );
}
