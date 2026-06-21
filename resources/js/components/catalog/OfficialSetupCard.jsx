import PartSlot from "../shared/PartSlot";
import SectionTitle from "../shared/SectionTitle";

export default function OfficialSetupCard({ setup }) {
    const isCX = setup.type === "CX";

    const components = isCX
        ? [
              { label: "Lock Chip", item: setup.cx_lock_chip },
              { label: "Over Blade", item: setup.cx_over_blade },
              { label: "Metal Blade", item: setup.cx_metal_blade },
              { label: "Auxiliary Blade", item: setup.cx_auxiliary_blade },
          ]
        : [{ label: "Blade", item: setup.blade }];

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg">
            <div className="border-b border-slate-800 bg-slate-950 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                            Official Setup
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                            {setup.name}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">
                            Manufacturer: {setup.manufacturer}
                        </p>
                    </div>

                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                        {setup.type}
                    </span>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl bg-slate-800">
                    {setup.image_url ? (
                        <img
                            src={setup.image_url}
                            alt={setup.name}
                            className="h-56 w-full object-contain"
                        />
                    ) : (
                        <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                            No official setup image
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2 p-5">
                <SectionTitle title={isCX ? "CX Parts" : "Blade"} />
                <div className="grid gap-2 sm:grid-cols-2">
                    {components.map(({ label, item }) => (
                        <PartSlot key={label} title={label} item={item} />
                    ))}
                </div>

                <SectionTitle title="Ratchet" />
                <PartSlot title="Ratchet" item={setup.ratchet} />

                <SectionTitle title="Bit" />
                <PartSlot title="Bit" item={setup.bit} />
            </div>
        </div>
    );
}
