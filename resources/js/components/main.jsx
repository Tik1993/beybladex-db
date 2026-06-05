import React, { useEffect, useMemo, useState, useDeferredValue } from "react";

const TAGS = ["All", "BX", "UX", "CX", "Blade", "Ratchet", "Bit", "CX Parts"];

export default function Main() {
    const [officialSetups, setOfficialSetups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTag, setActiveTag] = useState("All");

    const deferredSearchTerm = useDeferredValue(searchTerm);

    useEffect(() => {
        const fetchOfficialSetups = async () => {
            try {
                const res = await fetch("/api/official-setups", {
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch official setups");
                }

                const data = await res.json();
                setOfficialSetups(data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchOfficialSetups();
    }, []);

    const filteredSetups = useMemo(() => {
        const term = deferredSearchTerm.trim().toLowerCase();

        return officialSetups.filter((setup) => {
            const isTypeMatch =
                activeTag === "All" ||
                setup.type === activeTag ||
                (activeTag === "Blade" && setup.type !== "CX") ||
                (activeTag === "CX Parts" && setup.type === "CX");

            if (!isTypeMatch) {
                return false;
            }

            if (!term) {
                return true;
            }

            const searchableText = [
                setup.name,
                setup.manufacturer,
                setup.type,
                setup.blade?.name,
                setup.ratchet?.name,
                setup.bit?.name,
                setup.cx_lock_chip?.name,
                setup.cx_over_blade?.name,
                setup.cx_metal_blade?.name,
                setup.cx_auxiliary_blade?.name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(term);
        });
    }, [officialSetups, deferredSearchTerm, activeTag]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <p className="text-lg">Loading official setups...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
                <div className="max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                    <h1 className="text-2xl font-bold text-red-300">Error</h1>
                    <p className="mt-2 text-red-100">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <header className="mb-8">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                        Beyblade DB
                    </p>
                    <h1 className="mt-3 text-4xl font-bold text-white">
                        Official Setups
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-300">
                        Search and browse official Beyblade setups, including CX
                        part-based builds.
                    </p>
                </header>

                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="w-full lg:max-w-xl">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by setup name, part name, manufacturer..."
                            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {TAGS.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setActiveTag(tag)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    activeTag === tag
                                        ? "bg-cyan-400 text-slate-950"
                                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6 text-sm text-slate-400">
                    Showing {filteredSetups.length} result
                    {filteredSetups.length !== 1 ? "s" : ""}
                </div>

                {filteredSetups.length === 0 ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
                        No official setups found.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredSetups.map((setup) => (
                            <OfficialSetupCard key={setup.id} setup={setup} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function OfficialSetupCard({ setup }) {
    const isCX = setup.type === "CX";

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
                            className="h-56 w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                            No official setup image
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 p-5">
                {isCX ? (
                    <>
                        <SectionTitle title="CX Parts" />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <PartCard
                                title="CX Lock Chip"
                                item={setup.cx_lock_chip}
                            />
                            <PartCard
                                title="CX Over Blade"
                                item={setup.cx_over_blade}
                            />
                            <PartCard
                                title="CX Metal Blade"
                                item={setup.cx_metal_blade}
                            />
                            <PartCard
                                title="CX Auxiliary Blade"
                                item={setup.cx_auxiliary_blade}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <SectionTitle title="Blade" />
                        <PartCard title="Blade" item={setup.blade} />
                    </>
                )}

                <SectionTitle title="Ratchet" />
                <PartCard title="Ratchet" item={setup.ratchet} />

                <SectionTitle title="Bit" />
                <PartCard title="Bit" item={setup.bit} />
            </div>
        </div>
    );
}

function PartCard({ title, item }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {title}
            </p>

            <div className="mt-3 overflow-hidden rounded-xl bg-slate-900">
                {item?.img_url ? (
                    <img
                        src={item.img_url}
                        alt={item.name || title}
                        className="h-36 w-full object-contain p-3"
                    />
                ) : (
                    <div className="flex h-36 items-center justify-center text-sm text-slate-500">
                        No image
                    </div>
                )}
            </div>

            <div className="mt-3">
                <p className="font-semibold text-white">
                    {item?.name || "Not set"}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                    Color: {item?.color || "N/A"}
                </p>
            </div>
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
