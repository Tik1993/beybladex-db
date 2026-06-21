export default function SectionTitle({ title }) {
    return (
        <div className="pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                {title}
            </h3>
        </div>
    );
}
