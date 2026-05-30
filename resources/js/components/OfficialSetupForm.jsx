import React, { useState } from "react";

export default function OfficialSetupForm() {
    const [form, setForm] = useState({
        name: "",
        manufacturer: "Hasbro",
        type: "BX",
        blade: {
            name: "",
            img_url: "",
            color: "",
        },
        ratchet: {
            name: "",
            img_url: "",
            color: "",
        },
        bit: {
            name: "",
            img_url: "",
            color: "",
        },
        cx_lock_chip: {
            name: "",
            img_url: "",
            color: "",
        },
        cx_over_blade: {
            name: "",
            img_url: "",
            color: "",
        },
        cx_metal_blade: {
            name: "",
            img_url: "",
            color: "",
        },
        cx_auxiliary_blade: {
            name: "",
            img_url: "",
            color: "",
        },
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [group, field] = name.split(".");
            setForm((prev) => ({
                ...prev,
                [group]: {
                    ...prev[group],
                    [field]: value,
                },
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setForm((prev) => ({
            ...prev,
            type,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("Saving...");

        try {
            const res = await fetch("/api/official-setups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`Saved: ${data.name}`);
                setForm({
                    name: "",
                    manufacturer: "Hasbro",
                    type: "BX",
                    blade: { name: "", img_url: "", color: "" },
                    ratchet: { name: "", img_url: "", color: "" },
                    bit: { name: "", img_url: "", color: "" },
                    cx_lock_chip: { name: "", img_url: "", color: "" },
                    cx_over_blade: { name: "", img_url: "", color: "" },
                    cx_metal_blade: { name: "", img_url: "", color: "" },
                    cx_auxiliary_blade: { name: "", img_url: "", color: "" },
                });
            } else {
                setMessage(JSON.stringify(data));
            }
        } catch (error) {
            setMessage("Failed to save official setup.");
        } finally {
            setLoading(false);
        }
    };

    const isCX = form.type === "CX";

    return (
        <div className="min-h-screen bg-slate-100 px-6 py-10">
            <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
                <h1 className="mb-8 text-3xl font-bold text-slate-900">
                    New Official Setup
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Field label="Name">
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                            />
                        </Field>

                        <Field label="Manufacturer">
                            <select
                                name="manufacturer"
                                value={form.manufacturer}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                            >
                                <option value="Hasbro">Hasbro</option>
                                <option value="Takara Tomy">Takara Tomy</option>
                            </select>
                        </Field>

                        <Field label="Type">
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleTypeChange}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                            >
                                <option value="BX">BX</option>
                                <option value="UX">UX</option>
                                <option value="CX">CX</option>
                            </select>
                        </Field>
                    </div>

                    {!isCX && (
                        <>
                            <Section title="Blade">
                                <Field label="Name">
                                    <input
                                        name="blade.name"
                                        value={form.blade.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Image URL">
                                    <input
                                        name="blade.img_url"
                                        value={form.blade.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Color">
                                    <input
                                        name="blade.color"
                                        value={form.blade.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                            </Section>

                            <Section title="Ratchet">
                                <Field label="Name">
                                    <input
                                        name="ratchet.name"
                                        value={form.ratchet.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Image URL">
                                    <input
                                        name="ratchet.img_url"
                                        value={form.ratchet.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Color">
                                    <input
                                        name="ratchet.color"
                                        value={form.ratchet.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                            </Section>

                            <Section title="Bit">
                                <Field label="Name">
                                    <input
                                        name="bit.name"
                                        value={form.bit.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Image URL">
                                    <input
                                        name="bit.img_url"
                                        value={form.bit.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Color">
                                    <input
                                        name="bit.color"
                                        value={form.bit.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                            </Section>
                        </>
                    )}

                    {isCX && (
                        <>
                            <Section title="CX Lock Chip">
                                <Field label="Name">
                                    <input
                                        name="cx_lock_chip.name"
                                        value={form.cx_lock_chip.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Image URL">
                                    <input
                                        name="cx_lock_chip.img_url"
                                        value={form.cx_lock_chip.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Color">
                                    <input
                                        name="cx_lock_chip.color"
                                        value={form.cx_lock_chip.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                            </Section>

                            <Section title="CX Over Blade">
                                <Field label="Name">
                                    <input
                                        name="cx_over_blade.name"
                                        value={form.cx_over_blade.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Image URL">
                                    <input
                                        name="cx_over_blade.img_url"
                                        value={form.cx_over_blade.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Color">
                                    <input
                                        name="cx_over_blade.color"
                                        value={form.cx_over_blade.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                            </Section>

                            <Section title="CX Metal Blade">
                                <Field label="Name">
                                    <input
                                        name="cx_metal_blade.name"
                                        value={form.cx_metal_blade.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Image URL">
                                    <input
                                        name="cx_metal_blade.img_url"
                                        value={form.cx_metal_blade.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Color">
                                    <input
                                        name="cx_metal_blade.color"
                                        value={form.cx_metal_blade.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                            </Section>

                            <Section title="CX Auxiliary Blade">
                                <Field label="Name">
                                    <input
                                        name="cx_auxiliary_blade.name"
                                        value={form.cx_auxiliary_blade.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Image URL">
                                    <input
                                        name="cx_auxiliary_blade.img_url"
                                        value={form.cx_auxiliary_blade.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                                <Field label="Color">
                                    <input
                                        name="cx_auxiliary_blade.color"
                                        value={form.cx_auxiliary_blade.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                            </Section>

                            <Section title="Core Setup">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:col-span-2">
                                    CX setups use the four CX parts above
                                    instead of a whole blade.
                                </div>

                                <Field label="Ratchet">
                                    <input
                                        name="ratchet.name"
                                        value={form.ratchet.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>

                                <Field label="Ratchet Image URL">
                                    <input
                                        name="ratchet.img_url"
                                        value={form.ratchet.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>

                                <Field label="Ratchet Color">
                                    <input
                                        name="ratchet.color"
                                        value={form.ratchet.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>

                                <Field label="Bit">
                                    <input
                                        name="bit.name"
                                        value={form.bit.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>

                                <Field label="Bit Image URL">
                                    <input
                                        name="bit.img_url"
                                        value={form.bit.img_url}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>

                                <Field label="Bit Color">
                                    <input
                                        name="bit.color"
                                        value={form.bit.color}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                </Field>
                            </Section>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save Official Setup"}
                    </button>
                </form>

                {message && (
                    <p className="mt-6 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                {title}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">{children}</div>
        </section>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>
            {children}
        </div>
    );
}
