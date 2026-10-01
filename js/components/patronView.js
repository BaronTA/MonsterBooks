// Patron Incubator & Mystery Egg Hatch Sequence UI
import { Storage } from '../storage.js';

export function renderPatronView(container) {
    function draw() {
        const currentFarmerId = Storage.getActiveFarmerId();
        const patron = currentFarmerId ? Storage.getPatron(currentFarmerId) : null;

        container.innerHTML = `
            <div class="space-y-6">
                <!-- Login Box -->
                <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h2 class="text-lg font-bold text-amber-400 mb-2">Patron Incubator Portal</h2>
                    <p class="text-sm text-slate-400 mb-4">Enter your Monster Farmer ID card number to check your waiting mystery eggs.</p>
                    
                    <div class="flex flex-col sm:flex-row gap-3">
                        <input id="login-farmer-id" type="text" placeholder="Enter your Farmer ID (e.g., FARMER-101)" value="${currentFarmerId}"
                            class="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500">
                        <button id="login-btn" class="bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition shadow">
                            Load Account
                        </button>
                    </div>
                </div>

                ${!patron ? `
                    <div class="text-center py-12 bg-slate-800/40 rounded-xl border border-slate-700 text-slate-400">
                        Please enter your Farmer ID above to view your incubator bay.
                    </div>
                ` : `
                    <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-md font-bold text-slate-200">Account: <span class="text-amber-400">${patron.farmerId}</span></h3>
                            <span class="text-xs font-mono bg-slate-900 px-3 py-1 rounded text-slate-300">
                                Total Collection: ${Object.keys(patron.binder).length} / 30
                            </span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${patron.incubator.length === 0 ? `
                                <div class="col-span-full text-center py-10 bg-slate-900/50 rounded-lg border border-dashed border-slate-700 text-slate-500">
                                    No mystery eggs in your incubator bay. Check out library books to find eggs!
                                </div>
                            ` : patron.incubator.map((egg, index) => {
                                const isCleared = egg.cleared;
                                return `
                                    <div class="bg-slate-900 border ${isCleared ? 'border-emerald-500 shadow-lg shadow-emerald-950/30' : 'border-slate-700'} rounded-xl p-5 flex flex-col justify-between shadow-md">
                                        <div>
                                            <div class="flex justify-between items-start mb-3">
                                                <span class="text-3xl">${isCleared ? '🥚✨' : '🥚'}</span>
                                                <span class="text-xs font-mono px-2 py-0.5 rounded ${isCleared ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'}">
                                                    ${isCleared ? 'Ready to Hatch!' : 'Locked in Archives'}
                                                </span>
                                            </div>
                                            <h4 class="font-bold text-slate-100">Mystery Specimen</h4>
                                            <p class="text-xs text-slate-400 mt-1">Source Barcode: ${egg.barcode}</p>
                                        </div>
                                        
                                        <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                                            <span class="text-xs text-slate-400">
                                                ${isCleared ? 'Return processed by staff!' : 'Return book to unlock'}
                                            </span>
                                            <button data-index="${index}" ${isCleared ? '' : 'disabled'} 
                                                class="hatch-btn px-4 py-2 rounded-lg text-xs font-bold transition shadow ${isCleared ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}">
                                                Hatch Egg!
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `}
            </div>
        `;

        // Login handler
        const loginBtn = container.querySelector('#login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const idVal = container.querySelector('#login-farmer-id').value.trim().toUpperCase();
                if (idVal) {
                    Storage.setActiveFarmerId(idVal);
                    draw();
                }
            });
        }

        // Hatch handler reveals the monster into the binder
        container.querySelectorAll('.hatch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                hatchPatronEgg(currentFarmerId, idx);
            });
        });
    }

    function hatchPatronEgg(farmerId, index) {
        const patron = Storage.getPatron(farmerId);
        const egg = patron.incubator[index];

        if (!egg || !egg.cleared) return;

        // Remove from incubator
        patron.incubator.splice(index, 1);

        // Add revealed monster to binder slot
        for (let i = 0; i < 30; i++) {
            if (!patron.binder[i]) {
                patron.binder[i] = egg; // Revealed here!
                break;
            }
        }

        Storage.updatePatron(patron);
        draw();
    }

    draw();
}