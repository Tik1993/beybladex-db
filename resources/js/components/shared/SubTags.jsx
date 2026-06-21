import { SETUP_SUBTAGS } from "../../constants/tabs";
export default function SubTags({ activeSubTag, onChange }) {
    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {SETUP_SUBTAGS.map((tag) => (
                <button
                    key={tag}
                    type="button"
                    onClick={() => onChange(tag)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        activeSubTag === tag
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
}
