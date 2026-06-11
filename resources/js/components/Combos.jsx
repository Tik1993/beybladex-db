import React, { useState } from "react";

const EMPTY_FORM = {
    name: "",
    type: "BX",
    blade_id: "",
    ratchet_id: "",
    bit_id: "",
    cx_lock_chip_id: "",
    cx_over_blade_id: "",
    cx_metal_blade_id: "",
    cx_auxiliary_blade_id: "",
    notes: "",
};

export default function Combos({ collection, combos, setCombos }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingNotes, setEditingNotes] = useState("");

    const isCX = form.type === "CX";

    // Extract part arrays from collection
    const blades =
        collection["blades"]?.map((r) => r.blade).filter(Boolean) ?? [];
    const ratchets =
        collection["ratchets"]?.map((r) => r.ratchet).filter(Boolean) ?? [];
    const bits = collection["bits"]?.map((r) => r.bit).filter(Boolean) ?? [];
    const lockChips =
        collection["cx-lock-chips"]
            ?.map((r) => r.cx_lock_chip)
            .filter(Boolean) ?? [];
    const overBlades =
        collection["cx-over-blades"]
            ?.map((r) => r.cx_over_blade)
            .filter(Boolean) ?? [];
    const metalBlades =
        collection["cx-metal-blades"]
            ?.map((r) => r.cx_metal_blade)
            .filter(Boolean) ?? [];
    const auxBlades =
        collection["cx-auxiliary-blades"]
            ?.map((r) => r.cx_auxiliary_blade)
            .filter(Boolean) ?? [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            // reset CX fields when switching type
            ...(name === "type"
                ? {
                      blade_id: "",
                      cx_lock_chip_id: "",
                      cx_over_blade_id: "",
                      cx_metal_blade_id: "",
                      cx_auxiliary_blade_id: "",
                  }
                : {}),
        }));
    };

    const handleSave = async () => {
        setError("");

        // Validate required fields
        if (!form.name.trim()) return setError("Name is required");
        if (!form.ratchet_id) return setError("Ratchet is required");
        if (!form.bit_id) return setError("Bit is required");
        if (!isCX && !form.blade_id) return setError("Blade is required");

        setSaving(true);

        try {
            await fetch("/sanctum/csrf-cookie", { credentials: "include" });

            const res = await fetch("/api/user/combinations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: form.name,
                    type: form.type,
                    blade_id: form.blade_id || null,
                    ratchet_id: form.ratchet_id,
                    bit_id: form.bit_id,
                    cx_lock_chip_id: form.cx_lock_chip_id || null,
                    cx_over_blade_id: form.cx_over_blade_id || null,
                    cx_metal_blade_id: form.cx_metal_blade_id || null,
                    cx_auxiliary_blade_id: form.cx_auxiliary_blade_id || null,
                    notes: form.notes || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to save");
                return;
            }

            setCombos((prev) => [data, ...prev]);
            setForm(EMPTY_FORM);
        } catch {
            setError("Network error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        await fetch("/sanctum/csrf-cookie", { credentials: "include" });
        await fetch(`/api/user/combinations/${id}`, {
            method: "DELETE",
            headers: { Accept: "application/json" },
            credentials: "include",
        });
        setCombos((prev) => prev.filter((c) => c.id !== id));
    };

    const handleEditSave = async (id) => {
        await fetch("/sanctum/csrf-cookie", { credentials: "include" });
        const res = await fetch(`/api/user/combinations/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ notes: editingNotes }),
        });
        const data = await res.json();
        setCombos((prev) => prev.map((c) => (c.id === id ? data : c)));
        setEditingId(null);
    };

    return (
        <div>
            {/* ── Form ── */}
            <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-6 text-lg font-semibold text-white">
                    New Combination
                </h2>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-slate-400">
                            Combo Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. My Attack Build"
                            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-slate-400">
                            Type
                        </label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                        >
                            <option value="BX">BX</option>
                            <option value="UX">UX</option>
                            <option value="CX">CX</option>
                        </select>
                    </div>

                    {/* Blade — BX/UX only */}
                    {!isCX && (
                        <PartSelect
                            label="Blade"
                            name="blade_id"
                            value={form.blade_id}
                            onChange={handleChange}
                            parts={blades}
                        />
                    )}

                    {/* CX Parts */}
                    {isCX && (
                        <>
                            <PartSelect
                                label="Lock Chip"
                                name="cx_lock_chip_id"
                                value={form.cx_lock_chip_id}
                                onChange={handleChange}
                                parts={lockChips}
                            />
                            <PartSelect
                                label="Over Blade"
                                name="cx_over_blade_id"
                                value={form.cx_over_blade_id}
                                onChange={handleChange}
                                parts={overBlades}
                            />
                            <PartSelect
                                label="Metal Blade"
                                name="cx_metal_blade_id"
                                value={form.cx_metal_blade_id}
                                onChange={handleChange}
                                parts={metalBlades}
                            />
                            <PartSelect
                                label="Auxiliary Blade"
                                name="cx_auxiliary_blade_id"
                                value={form.cx_auxiliary_blade_id}
                                onChange={handleChange}
                                parts={auxBlades}
                            />
                        </>
                    )}

                    {/* Ratchet */}
                    <PartSelect
                        label="Ratchet"
                        name="ratchet_id"
                        value={form.ratchet_id}
                        onChange={handleChange}
                        parts={ratchets}
                    />

                    {/* Bit */}
                    <PartSelect
                        label="Bit"
                        name="bit_id"
                        value={form.bit_id}
                        onChange={handleChange}
                        parts={bits}
                    />

                    {/* Notes */}
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-slate-400">
                            Notes
                        </label>
                        <input
                            name="notes"
                            type="text"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Optional notes..."
                            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-6 rounded-2xl bg-cyan-400 px-8 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Combo"}
                </button>
            </div>

            {/* ── Table ── */}
            {combos.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
                    No combos saved yet.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-800">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950 text-xs uppercase tracking-[0.15em] text-slate-400">
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Blade</th>
                                <th className="px-4 py-3 text-left">Ratchet</th>
                                <th className="px-4 py-3 text-left">Bit</th>
                                <th className="px-4 py-3 text-left">
                                    Lock Chip
                                </th>
                                <th className="px-4 py-3 text-left">
                                    Over Blade
                                </th>
                                <th className="px-4 py-3 text-left">
                                    Metal Blade
                                </th>
                                <th className="px-4 py-3 text-left">
                                    Aux Blade
                                </th>
                                <th className="px-4 py-3 text-left">Notes</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combos.map((combo) => (
                                <tr
                                    key={combo.id}
                                    className="border-b border-slate-800 bg-slate-900 transition hover:bg-slate-800"
                                >
                                    <td className="px-4 py-3 font-medium text-white">
                                        {combo.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                                            {combo.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {combo.blade?.short_name ||
                                            combo.blade?.name ||
                                            "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {combo.ratchet?.name || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {combo.bit?.short_name ||
                                            combo.bit?.name ||
                                            "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {combo.cx_lock_chip?.name || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {combo.cx_over_blade?.name || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {combo.cx_metal_blade?.name || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {combo.cx_auxiliary_blade?.short_name ||
                                            combo.cx_auxiliary_blade?.name ||
                                            "—"}
                                    </td>

                                    {/* Notes — inline edit */}
                                    <td className="px-4 py-3">
                                        {editingId === combo.id ? (
                                            <input
                                                type="text"
                                                value={editingNotes}
                                                onChange={(e) =>
                                                    setEditingNotes(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-cyan-400 bg-slate-950 px-2 py-1 text-slate-100 outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="text-slate-400">
                                                {combo.notes || "—"}
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {editingId === combo.id ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditSave(
                                                                combo.id,
                                                            )
                                                        }
                                                        className="rounded-lg bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingId(null)
                                                        }
                                                        className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-slate-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingId(
                                                                combo.id,
                                                            );
                                                            setEditingNotes(
                                                                combo.notes ||
                                                                    "",
                                                            );
                                                        }}
                                                        className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-slate-500"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                combo.id,
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/20"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function PartSelect({ label, name, value, onChange, parts }) {
    return (
        <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-slate-400">
                {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            >
                <option value="">Select {label}...</option>
                {parts.map((part) => (
                    <option key={part.id} value={part.id}>
                        {part.short_name || part.name}
                        {part.color ? ` (${part.color})` : ""}
                    </option>
                ))}
            </select>
        </div>
    );
}
