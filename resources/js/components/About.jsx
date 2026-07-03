import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./shared/Footer";

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <nav className="border-b border-slate-800 bg-slate-950 px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-sm uppercase tracking-[0.3em] text-cyan-300"
                    >
                        Beyblade X Cat
                    </button>
                </div>
            </nav>

            <div className="mx-auto max-w-3xl px-6 py-16">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-3">
                    About
                </p>
                <h1 className="text-4xl font-bold text-white mb-6">
                    Beyblade X Cat
                </h1>
                <p className="text-slate-300 leading-relaxed mb-4">
                    An unofficial Beyblade X database built for the community.
                    Browse official setups, explore parts, and build your own
                    custom combinations.
                </p>
                <p className="text-slate-300 leading-relaxed mb-3">
                    Built by a Beyblade X fan, for Beyblade X fans.
                </p>
                <p className="text-slate-500 text-sm mb-3">
                    Not affiliated with Takara Tomy or Hasbro.
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Have feedback or suggestions? Reach out at{" "}
                    <a
                        href="mailto:beybladexcat@gmail.com"
                        className="text-cyan-300 hover:underline"
                    >
                        beybladexcat@gmail.com
                    </a>
                </p>
            </div>

            <Footer />
        </div>
    );
}
