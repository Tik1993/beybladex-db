export const TOP_TABS = [
    {
        key: "official-setups",
        label: "Official Setups",
        endpoint: "/api/official-setups",
    },
    { key: "blades", label: "Blade", endpoint: "/api/blades" },
    { key: "ratchets", label: "Ratchet", endpoint: "/api/ratchets" },
    { key: "bits", label: "Bit", endpoint: "/api/bits" },
    {
        key: "cx-lock-chips",
        label: "Lock Chip",
        endpoint: "/api/cx-lock-chips",
    },
    {
        key: "cx-over-blades",
        label: "Over Blade",
        endpoint: "/api/cx-over-blades",
    },
    {
        key: "cx-metal-blades",
        label: "Metal Blade",
        endpoint: "/api/cx-metal-blades",
    },
    {
        key: "cx-auxiliary-blades",
        label: "Auxiliary Blade",
        endpoint: "/api/cx-auxiliary-blades",
    },
];

export const PART_TABS = TOP_TABS.filter(
    (tab) => tab.key !== "official-setups",
);
export const LIBRARY_TABS = [
    ...PART_TABS,
    { key: "combinations", label: "My Combos" },
];

export const SETUP_SUBTAGS = ["All", "BX", "UX", "CX"];

export const PART_KEY_MAP = {
    blades: "blade_id",
    ratchets: "ratchet_id",
    bits: "bit_id",
    "cx-lock-chips": "cx_lock_chip_id",
    "cx-over-blades": "cx_over_blade_id",
    "cx-metal-blades": "cx_metal_blade_id",
    "cx-auxiliary-blades": "cx_auxiliary_blade_id",
};

export const OWNED_PART_RELATION_MAP = {
    blades: "blade",
    ratchets: "ratchet",
    bits: "bit",
    "cx-lock-chips": "cx_lock_chip",
    "cx-over-blades": "cx_over_blade",
    "cx-metal-blades": "cx_metal_blade",
    "cx-auxiliary-blades": "cx_auxiliary_blade",
};
