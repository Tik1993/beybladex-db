import React, {
    useEffect,
    useMemo,
    useState,
    useDeferredValue,
    useRef,
} from "react";
import Login from "./auth/login";
import {
    TOP_TABS,
    PART_TABS,
    LIBRARY_TABS,
    PART_KEY_MAP,
} from "../constants/tabs";
import {
    createEmptyCollection,
    getOwnedPart,
    buildSearchableText,
} from "../utils/collection";
import Navbar from "./shared/Navbar";
import ModeTabs from "./shared/ModeTabs";
import TabRow from "./shared/TabRow";
import SubTags from "./shared/SubTags";
import SearchBar from "./shared/SearchBar";
import CatalogPanel from "./catalog/CatalogPanel";
import LibraryPanel from "./library/LibraryPanel";
import Combos from "./library/Combos";
import Footer from "./shared/Footer";

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

        fetchedTabs.current.add(activeTab);

        setLoading((prev) => ({ ...prev, [activeTab]: true }));

        fetch(tab.endpoint, { headers: { Accept: "application/json" } })
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch ${tab.label}`);
                return res.json();
            })
            .then((json) => {
                setData((prev) => ({ ...prev, [activeTab]: json }));
            })

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

            const searchableText = item.short_name
                ? buildSearchableText([item.short_name])
                : buildSearchableText([item.name]);

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
            <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur">
                <Navbar
                    user={user}
                    onLogin={() => setShowLogin(true)}
                    onLogout={handleLogout}
                />
                <div className="mx-auto max-w-7xl px-6 pt-3">
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

                    {mainTab === "catalog" &&
                        activeTab === "official-setups" && (
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
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-1">
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
            <Footer />
        </div>
    );
}
