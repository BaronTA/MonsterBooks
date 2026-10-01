// Deterministic Barcode / String Converter for Monster Stats Generation
import { RARITY_RULES, SAMPLE_MONSTER_NAMES } from './config.js';

export const HashEngine = {
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    },

    generateMonster(barcodeInput) {
        const cleanInput = barcodeInput.trim() ? barcodeInput.trim() : "DEFAULT_BARCODE_" + Math.random();
        const hash = this.hashCode(cleanInput);

        // Determine Rarity using modulo and weight distributions
        const rarityRoll = hash % 100;
        let cumulative = 0;
        let selectedRarity = "COMMON";
        
        for (const [key, rule] of Object.entries(RARITY_RULES)) {
            cumulative += rule.weight;
            if (rarityRoll < cumulative) {
                selectedRarity = key;
                break;
            }
        }

        // Generate attributes
        const nameIdx = hash % SAMPLE_MONSTER_NAMES.length;
        const baseName = SAMPLE_MONSTER_NAMES[nameIdx];
        const idNumber = (hash % 900 + 100);
        
        return {
            id: `MON-${hash}`,
            barcode: cleanInput,
            name: `${baseName} #${idNumber}`,
            rarity: selectedRarity,
            attack: (hash % 50) + 10,
            defense: ((hash >> 3) % 50) + 10,
            lore: `Generated securely from source signature: ${cleanInput}`,
            discoveredAt: new Date().toISOString()
        };
    }
};