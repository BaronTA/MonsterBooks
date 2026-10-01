// 30-Card Collection Grid Display for Active Patron
import { Storage } from '../storage.js';

export function renderBinderView(container) {
    const currentFarmerId = Storage.getActiveFarmerId();
    const patron = currentFarmerId ? Storage.getPatron(currentFarmerId) : null;
    const binder = patron ? patron.binder : {};
    const totalSlots = 30;
    const filledCount = Object.keys(binder).length;

    container.innerHTML = `
        <div class="space-y-6">
            <!-- Account Banner -->
            <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 class="text-lg font-bold text-amber-400 mb-1">Patron Collection Binder</h2>
                    <p class="text-sm text-slate-400">Viewing binder collection for: <span class="text-slate-100 font-semibold">${currentFarmerId || 'No Account Selected'}</span></p>
                </div>
                <div class="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    Binder Filled: <span class="text-amber-400">${filledCount} / ${totalSlots}</span>
                </div>
            </div>

            ${!currentFarmerId ? `
                <div class="text-center py-12 bg-slate-800/40 rounded-xl border border-slate-700 text-slate-400">
                    Please log into your Farmer Account via the Patron Incubator tab to see your binder grid.
                </div>
            ` : `
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    ${Array.from({ length: totalSlots }).map((_, index) => {
                        const card = binder[index];
                        if (card) {
                            return `
                                <div class="bg-slate-800 border ${getCardBorder(card.rarity)} rounded-xl p-3 flex flex-col justify-between shadow-md h-48">
                                    <div>
                                        <div class="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-mono">
                                            <span>#${index + 1}</span>
                                            <span class="uppercase">${card.rarity}</span>
                                        </div>
                                        <h3 class="font-bold text-xs text-slate-100 line-clamp-2">${card.name}</h3>
                                    </div>
                                    <div class="my-auto text-center text-3xl">
                                        👾
                                    </div>
                                    <div class="text-[10px] text-slate-400 pt-2 border-t border-slate-700/50 flex justify-between">
                                        <span>ATK: ${card.attack}</span>
                                        <span>DEF: ${card.defense}</span>
                                    </div>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center h-48">
                                    <span class="text-slate-600 font-mono text-xs mb-1">Slot #${index + 1}</span>
                                    <span class="text-xs text-slate-500 italic">Empty Pocket</span>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
            `}
        </div>
    `;

    function getCardBorder(rarity) {
        switch(rarity) {
            case 'MYTHIC': return 'border-purple-500 bg-purple-950/20';
            case 'RARE': return 'border-blue-500 bg-blue-950/20';
            case 'UNCOMMON': return 'border-emerald-500 bg-emerald-950/20';
            default: return 'border-slate-600 bg-slate-800';
        }
    }
}