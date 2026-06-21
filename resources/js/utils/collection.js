import { OWNED_PART_RELATION_MAP } from "../constants/tabs";

export function createEmptyCollection() {
    return {
        blades: [],
        ratchets: [],
        bits: [],
        "cx-lock-chips": [],
        "cx-over-blades": [],
        "cx-metal-blades": [],
        "cx-auxiliary-blades": [],
    };
}

export function getOwnedPart(record, tabKey) {
    const relationKey = OWNED_PART_RELATION_MAP[tabKey];

    if (relationKey && record?.[relationKey]) {
        return record[relationKey];
    }

    return (
        Object.values(record || {}).find(
            (value) =>
                value &&
                typeof value === "object" &&
                !Array.isArray(value) &&
                value.id &&
                (value.name || value.short_name),
        ) ?? null
    );
}

export function buildSearchableText(values) {
    return values.filter(Boolean).join(" ").toLowerCase();
}
