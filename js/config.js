// Season 1 Constants and Rarity Rules

export const SEASON_CONFIG = {
    seasonId: "S1",
    name: "Archives & Abominations",
    totalSlots: 30
};

export const RARITY_RULES = {
    COMMON: { name: "Common", weight: 60, color: "border-slate-500 bg-slate-800 text-slate-300" },
    UNCOMMON: { name: "Uncommon", weight: 25, color: "border-emerald-500 bg-emerald-950/40 text-emerald-300" },
    RARE: { name: "Rare", weight: 12, color: "border-blue-500 bg-blue-950/40 text-blue-300" },
    MYTHIC: { name: "Mythic", weight: 3, color: "border-purple-500 bg-purple-950/40 text-purple-300" }
};

export const SAMPLE_MONSTER_NAMES = [
    "Tome-Crawler", "ISBN Imp", "Dewey Decimal Drake", "Foliage Phantom",
    "Papercut Pixie", "Archivist Arachnid", "Gilded Glossary", "Microfilm Mimic",
    "Card-Catalog Chimera", "Binding Beast", "Paragraph Phantom", "Lexicon Lycan"
];