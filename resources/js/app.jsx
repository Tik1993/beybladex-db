import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/main";
import About from "./components/About";

function App() {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        fetch("/api/me", {
            headers: { Accept: "application/json" },
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) return null;
                return res.json();
            })
            .then((data) => setUser(data))
            .finally(() => setChecking(false));
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
                <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 px-8 py-7 shadow-2xl backdrop-blur">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>
                    <p className="text-base font-semibold tracking-wide text-slate-200">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Main user={user} setUser={setUser} />}
                />
                <Route path="/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
