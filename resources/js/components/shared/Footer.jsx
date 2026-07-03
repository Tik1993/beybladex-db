export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-10">
            <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    © {new Date().getFullYear()} Beyblade X Cat — Unofficial
                    Beyblade X database.
                </p>
                <p className="text-xs text-slate-600">
                    Not affiliated with Takara Tomy or Hasbro
                </p>
            </div>
        </footer>
    );
}
