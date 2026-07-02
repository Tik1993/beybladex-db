export default function Navbar({ user, onLogin, onLogout }) {
    return (
        <nav className="border-b border-slate-800 bg-slate-950 px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src="/images/logo.png"
                        alt="BeybladeX Cat logo"
                        className="h-8 w-8 object-contain"
                    />
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                        BeybladeX Cat
                    </p>
                </div>

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
