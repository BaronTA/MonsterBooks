// Local Trade Simulator View UI
import { Storage } from '../storage.js';

export function renderTradeView(container, onStateChange) {
    const binder = Storage.getBinder();
    const availableCards = Object.entries(binder);

    container.innerHTML = `
        <div class="space-y-6 max-w-2xl mx-auto">
            <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center">
                <h2 class="text-lg font-bold text-amber-400 mb-2">Archival Trade Kiosk</h2>
                <p class="text-sm text-slate-400 mb-4">Trade duplicate binder monsters with the automated library kiosk for a randomized mystery roll.</p>
                
                ${availableCards.length === 0 ? `
                    <p class="text-sm text-slate-500 py-6">Your binder is empty. Hatch monsters to enable trading options.</p>
                ` : `
                    <div class="space-y-4 text-left">
                        <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Select Specimen to Trade In:</label>
                        <select id="trade-select" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500">
                            ${availableCards.map(([slotIdx, card]) => `
                                <option value="${slotIdx}">Slot #${parseInt(slotIdx)+1}: ${card.name} (${card.rarity})</option>
                            `).join('')}
                        </select>
                        <button id="execute-trade-btn" class="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 rounded-lg text-sm transition shadow">
                            Execute Kiosk Trade-In
                        </button>
                    </div>
                `}
                <div id="trade-feedback" class="mt-4 text-sm font-medium"></div>
            </div>
        </div>
    `;

    const tradeBtn = container.querySelector('#execute-trade-btn');
    if (tradeBtn) {
        tradeBtn.addEventListener('click', () => {
            const select = container.querySelector('#trade-select');
            const slotIdx = select.value;
            let binderData = Storage.getBinder();

            if (binderData[slotIdx]) {
                const tradedName = binderData[slotIdx].name;
                delete binderData[slotIdx];
                Storage.saveBinder(binderData);

                const feedback = container.querySelector('#trade-feedback');
                feedback.textContent = `Successfully traded ${tradedName} to the archive kiosk!`;
                feedback.className = "mt-4 text-sm font-medium text-emerald-400";
                
                setTimeout(() => {
                    renderTradeView(container, onStateChange);
                    if(onStateChange) onStateChange();
                }, 1000);
            }
        });
    }
}