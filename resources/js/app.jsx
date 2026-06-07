import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Main from "./components/main";

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

    if (checking) return null;

    return <Main user={user} setUser={setUser} />;
}

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
