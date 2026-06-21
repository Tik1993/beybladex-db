import React, { useState } from "react";

export default function Login({ setUser, onBack }) {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const endpoint = mode === "login" ? "/api/login" : "/api/register";
        const body =
            mode === "login"
                ? { email: form.email, password: form.password }
                : form;

        try {
            // Sanctum requires CSRF token first
            await fetch("/sanctum/csrf-cookie", { credentials: "include" });

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
                return;
            }

            setUser(data);
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Back button */}
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-6 text-sm text-slate-400 hover:text-white transition"
                >
                    ← Back to catalog
                </button>
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                        Beyblade DB
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-white">
                        {mode === "login" ? "Welcome back" : "Create account"}
                    </h1>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 space-y-4">
                    {error && (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    {/* {mode === "register" && (
                        <input
                            name="name"
                            type="text"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                        />
                    )} */}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                    />

                    {mode === "register" && (
                        <input
                            name="password_confirmation"
                            type="password"
                            placeholder="Confirm password"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                        />
                    )}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full rounded-2xl bg-cyan-400 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                    >
                        {loading
                            ? "..."
                            : mode === "login"
                              ? "Login"
                              : "Register"}
                    </button>

                    {/* <p className="text-center text-sm text-slate-400">
                        {mode === "login" ? "No account?" : "Already have one?"}{" "}
                        <button
                            type="button"
                            onClick={() =>
                                setMode(mode === "login" ? "register" : "login")
                            }
                            className="text-cyan-300 hover:underline"
                        >
                            {mode === "login" ? "Register" : "Login"}
                        </button>
                    </p> */}
                </div>
            </div>
        </div>
    );
}
