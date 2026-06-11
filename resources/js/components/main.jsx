import React, {
    useEffect,
    useMemo,
    useState,
    useDeferredValue,
    useRef,
} from "react";
import Login from "./login";
import Combos from "./Combos";

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

const PART_TABS = TOP_TABS.filter((tab) => tab.key !== "official-setups");
const LIBRARY_TABS = [
    ...PART_TABS,
    { key: "combinations", label: "My Combos" },
];

const SETUP_SUBTAGS = ["All", "BX", "UX", "CX"];

const PART_KEY_MAP = {
    blades: "blade_id",
    ratchets: "ratchet_id",
    bits: "bit_id",
    "cx-lock-chips": "cx_lock_chip_id",
    "cx-over-blades": "cx_over_blade_id",
    "cx-metal-blades": "cx_metal_blade_id",
    "cx-auxiliary-blades": "cx_auxiliary_blade_id",
};

const OWNED_PART_RELATION_MAP = {
    blades: "blade",
    ratchets: "ratchet",
    bits: "bit",
    "cx-lock-chips": "cx_lock_chip",
    "cx-over-blades": "cx_over_blade",
    "cx-metal-blades": "cx_metal_blade",
    "cx-auxiliary-blades": "cx_auxiliary_blade",
};

function createEmptyCollection() {
    return {
        blades: [],
        ratchets: [],
        bits: [],
        "cx-lock-chips": [],
        "cx-over-blades": [],
        "cx-metal-blades": [],
        "cx-auxiliary-blades": [],
    };
}

function getOwnedPart(record, tabKey) {
    const relationKey = OWNED_PART_RELATION_MAP[tabKey];

    if (relationKey && record?.[relationKey]) {
        return record[relationKey];
    }

    return (
        Object.values(record || {}).find(
            (value) =>
                value &&
                typeof value === "object" &&
                !Array.isArray(value) &&
                value.id &&
                (value.name || value.short_name),
        ) ?? null
    );
}

function buildSearchableText(values) {
    return values.filter(Boolean).join(" ").toLowerCase();
}

export default function Main({ user, setUser }) {
    const [showLogin, setShowLogin] = useState(false);
    const [mainTab, setMainTab] = useState("catalog");

    const [catalogTab, setCatalogTab] = useState("official-setups");
    const [libraryTab, setLibraryTab] = useState("blades");

    const activeTab = mainTab === "catalog" ? catalogTab : libraryTab;
    const activeTabs = mainTab === "catalog" ? TOP_TABS : LIBRARY_TABS;

    const [activeSubTag, setActiveSubTag] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearch = useDeferredValue(searchTerm);

    const [data, setData] = useState({});
    const [loading, setLoading] = useState({});
    const [error, setError] = useState({});
    const fetchedTabs = useRef(new Set());

    const [collection, setCollection] = useState(createEmptyCollection());
    const [combos, setCombos] = useState([]);

    useEffect(() => {
        if (!user) {
            setCollection(createEmptyCollection());
            return;
        }

        const endpoints = PART_TABS.map((tab) => ({
            key: tab.key,
            url: `/api/user/${tab.key}`,
        }));

        Promise.all(
            endpoints.map((entry) =>
                fetch(entry.url, {
                    headers: { Accept: "application/json" },
                    credentials: "include",
                })
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error(`Failed to fetch ${entry.key}`);
                        }
                        return res.json();
                    })
                    .then((json) => ({ key: entry.key, data: json })),
            ),
        )
            .then((results) => {
                const nextCollection = createEmptyCollection();

                results.forEach(({ key, data }) => {
                    nextCollection[key] = data;
                });

                setCollection(nextCollection);
            })
            .catch(() => {
                setCollection(createEmptyCollection());
            });

        // fetch combos
        fetch("/api/user/combinations", {
            headers: { Accept: "application/json" },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setCombos(data));
    }, [user]);

    useEffect(() => {
        if (mainTab !== "catalog") return;

        const tab = TOP_TABS.find((t) => t.key === activeTab);
        if (!tab || fetchedTabs.current.has(activeTab)) return;

        setLoading((prev) => ({ ...prev, [activeTab]: true }));

        fetch(tab.endpoint, { headers: { Accept: "application/json" } })
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
    }, [mainTab, activeTab]);

    const handleMainTabChange = (nextTab) => {
        setMainTab(nextTab);
        setSearchTerm("");
        setActiveSubTag("All");
    };

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            headers: { Accept: "application/json" },
            credentials: "include",
        });

        setUser(null);
    };

    const handleAdd = async (tabKey, itemId) => {
        await fetch("/sanctum/csrf-cookie", { credentials: "include" });

        const res = await fetch(`/api/user/${tabKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ [PART_KEY_MAP[tabKey]]: itemId }),
        });

        const record = await res.json();

        setCollection((prev) => ({
            ...prev,
            [tabKey]: [...(prev[tabKey] ?? []), record],
        }));
    };

    const handleRemove = async (tabKey, ownedId) => {
        await fetch("/sanctum/csrf-cookie", { credentials: "include" });

        await fetch(`/api/user/${tabKey}/${ownedId}`, {
            method: "DELETE",
            headers: { Accept: "application/json" },
            credentials: "include",
        });

        setCollection((prev) => ({
            ...prev,
            [tabKey]: (prev[tabKey] ?? []).filter(
                (record) => record.id !== ownedId,
            ),
        }));
    };

    const filteredCatalog = useMemo(() => {
        if (mainTab !== "catalog") return [];

        const term = deferredSearch.trim().toLowerCase();
        const rawData = data[activeTab] ?? [];

        return rawData.filter((item) => {
            if (activeTab === "official-setups" && activeSubTag !== "All") {
                if (item.type !== activeSubTag) return false;
            }

            if (!term) return true;

            const searchableText = buildSearchableText([
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
            ]);

            return searchableText.includes(term);
        });
    }, [mainTab, activeTab, activeSubTag, data, deferredSearch]);

    const filteredLibrary = useMemo(() => {
        if (mainTab !== "library") return [];

        const term = deferredSearch.trim().toLowerCase();
        const records = collection[activeTab] ?? [];

        return records
            .map((record) => {
                const part = getOwnedPart(record, activeTab);
                return { ownedRecord: record, part };
            })
            .filter(({ part }) => part)
            .filter(({ ownedRecord, part }) => {
                if (!term) return true;

                const searchableText = buildSearchableText([
                    part.name,
                    part.short_name,
                    part.color,
                    ownedRecord.notes,
                    String(ownedRecord.quantity ?? ""),
                ]);

                return searchableText.includes(term);
            });
    }, [mainTab, activeTab, collection, deferredSearch]);

    if (showLogin && !user) {
        return (
            <Login
                setUser={(nextUser) => {
                    setUser(nextUser);
                    setShowLogin(false);
                }}
                onBack={() => setShowLogin(false)}
            />
        );
    }

    const activeTabLabel =
        activeTabs.find((tab) => tab.key === activeTab)?.label ?? "";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Navbar
                user={user}
                onLogin={() => setShowLogin(true)}
                onLogout={handleLogout}
            />

            <div className="mx-auto max-w-7xl px-6 py-10">
                <ModeTabs
                    mainTab={mainTab}
                    onChange={handleMainTabChange}
                    user={user}
                />

                <TabRow
                    tabs={activeTabs}
                    activeTab={activeTab}
                    onChange={(key) => {
                        if (mainTab === "catalog") setCatalogTab(key);
                        else setLibraryTab(key);
                    }}
                />

                {mainTab === "catalog" && activeTab === "official-setups" && (
                    <SubTags
                        activeSubTag={activeSubTag}
                        onChange={setActiveSubTag}
                    />
                )}

                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder={`Search ${activeTabLabel}...`}
                />

                {mainTab === "catalog" ? (
                    <CatalogPanel
                        activeTab={activeTab}
                        loading={loading[activeTab]}
                        error={error[activeTab]}
                        items={filteredCatalog}
                        user={user}
                        collectionForTab={collection[activeTab] ?? []}
                        onAdd={handleAdd}
                        onRemove={handleRemove}
                    />
                ) : (
                    mainTab === "library" &&
                    (activeTab === "combinations" ? (
                        <Combos
                            collection={collection}
                            combos={combos}
                            setCombos={setCombos}
                        />
                    ) : (
                        <LibraryPanel
                            activeTab={activeTab}
                            user={user}
                            items={filteredLibrary}
                            onRemove={handleRemove}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function Navbar({ user, onLogin, onLogout }) {
    return (
        <nav className="border-b border-slate-800 bg-slate-950 px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                    Beyblade DB
                </p>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-300">
                            {user.name}
                        </span>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="rounded-full border border-slate-700 px-4 py-1.5 text-sm text-slate-400 transition hover:border-slate-500"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={onLogin}
                        className="rounded-full border border-slate-700 px-4 py-1.5 text-sm text-slate-400 transition hover:border-slate-500"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

function ModeTabs({ mainTab, onChange, user }) {
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

function TabRow({ tabs, activeTab, onChange }) {
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

function SubTags({ activeSubTag, onChange }) {
    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {SETUP_SUBTAGS.map((tag) => (
                <button
                    key={tag}
                    type="button"
                    onClick={() => onChange(tag)}
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
    );
}

function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="mb-6">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 lg:max-w-xl"
            />
        </div>
    );
}

function CatalogPanel({
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

function LibraryPanel({ activeTab, user, items, onRemove }) {
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

            <div className="space-y-2 p-5">
                <SectionTitle title={isCX ? "CX Parts" : "Blade"} />
                <div className="grid gap-2 sm:grid-cols-2">
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

function PartCard({ item, user, ownedRecord, onAdd, onRemove, isLibrary }) {
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

                {item?.color && (
                    <p className="mt-1 text-sm text-slate-400">
                        Color: {item.color}
                    </p>
                )}

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

function PartSlot({ title, item }) {
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
                    {item?.color && (
                        <p className="text-xs text-slate-500">{item.color}</p>
                    )}
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

function SectionTitle({ title }) {
    return (
        <div className="pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                {title}
            </h3>
        </div>
    );
}
