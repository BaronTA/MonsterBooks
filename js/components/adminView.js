// Staff ILS Circulation Workflow UI (Checkout & Return Scan)
import { Storage } from '../storage.js';
import { HashEngine } from '../hashEngine.js';

export function renderAdminView(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <!-- Checkout Section -->
            <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h2 class="text-lg font-bold text-amber-400 mb-2">ILS Circulation: Book Checkout</h2>
                <p class="text-sm text-slate-400 mb-4">Scan the Patron's Farmer ID card, then scan the book being checked out to tie a locked monster egg to that specific volume.</p>
                
                <div class="space-y-3">
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Patron Farmer ID</label>
                        <input id="checkout-farmer-id" type="text" placeholder="e.g., FARMER-101" 
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Book Barcode / ISBN</label>
                        <input id="checkout-barcode" type="text" placeholder="e.g., 978-3-16-148410-0" 
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500">
                    </div>
                    <button id="checkout-btn" class="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 rounded-lg text-sm transition shadow">
                        Complete Checkout & Issue Tied Egg
                    </button>
                </div>
                <div id="checkout-feedback" class="mt-3 text-sm font-medium"></div>
            </div>

            <!-- Return & Scan Section -->
            <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 class="text-md font-bold text-slate-200 mb-2">ILS Circulation: Book Return & Egg Unlock</h3>
                <p class="text-sm text-slate-400 mb-4">When a book is returned, scan its barcode here. The system will look up who checked it out and instantly unlock their egg!</p>
                
                <div class="flex flex-col sm:flex-row gap-3">
                    <input id="return-barcode" type="text" placeholder="Scan Returned Book Barcode..." 
                        class="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500">
                    <button id="return-btn" class="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition shadow">
                        Process Return & Unlock Egg
                    </button>
                </div>
                <div id="return-feedback" class="mt-3 text-sm font-medium"></div>
            </div>
        </div>
    `;

    const checkoutFarmerInput = container.querySelector('#checkout-farmer-id');
    const checkoutBarcodeInput = container.querySelector('#checkout-barcode');
    const checkoutBtn = container.querySelector('#checkout-btn');
    const checkoutFeedback = container.querySelector('#checkout-feedback');

    const returnBarcodeInput = container.querySelector('#return-barcode');
    const returnBtn = container.querySelector('#return-btn');
    const returnFeedback = container.querySelector('#return-feedback');

    // Handle Checkout Action
    checkoutBtn.addEventListener('click', () => {
        const farmerId = checkoutFarmerInput.value.trim().toUpperCase();
        const barcode = checkoutBarcodeInput.value.trim();

        if (!farmerId || !barcode) {
            checkoutFeedback.textContent = "Error: Both Farmer ID and Book Barcode are required.";
            checkoutFeedback.className = "mt-3 text-sm font-medium text-rose-400";
            return;
        }

        const activeLoans = Storage.getActiveLoans();
        if (activeLoans[barcode]) {
            checkoutFeedback.textContent = `Error: Book ${barcode} is already checked out!`;
            checkoutFeedback.className = "mt-3 text-sm font-medium text-rose-400";
            return;
        }

        // Generate monster tied to this specific barcode
        const monster = HashEngine.generateMonster(barcode);
        const patron = Storage.getPatron(farmerId);

        // Add locked egg to patron incubator
        patron.incubator.push({
            ...monster,
            cleared: false
        });
        Storage.updatePatron(patron);

        // Record active loan map: barcode -> farmerId
        activeLoans[barcode] = farmerId;
        Storage.saveActiveLoans(activeLoans);

        checkoutFeedback.textContent = `Success! Book checked out to ${farmerId}. Locked egg "${monster.name}" generated.`;
        checkoutFeedback.className = "mt-3 text-sm font-medium text-emerald-400";
        checkoutBarcodeInput.value = "";
    });

    // Handle Return Scan Action
    returnBtn.addEventListener('click', () => {
        const barcode = returnBarcodeInput.value.trim();
        if (!barcode) {
            returnFeedback.textContent = "Error: Please scan or enter a returned book barcode.";
            returnFeedback.className = "mt-3 text-sm font-medium text-rose-400";
            return;
        }

        const activeLoans = Storage.getActiveLoans();
        const farmerId = activeLoans[barcode];

        if (!farmerId) {
            returnFeedback.textContent = `Return Error: No active loan found for barcode '${barcode}'.`;
            returnFeedback.className = "mt-3 text-sm font-medium text-rose-400";
            return;
        }

        const patron = Storage.getPatron(farmerId);
        let targetEggFound = false;

        // Find the specific egg tied to this barcode and clear it
        patron.incubator.forEach(egg => {
            if (egg.barcode === barcode && !egg.cleared) {
                egg.cleared = true;
                targetEggFound = true;
            }
        });

        if (targetEggFound) {
            Storage.updatePatron(patron);
            // Remove active loan record
            delete activeLoans[barcode];
            Storage.saveActiveLoans(activeLoans);

            returnFeedback.textContent = `Book Return Processed! Found loan for ${farmerId}. Their egg for this book is now UNLOCKED!`;
            returnFeedback.className = "mt-3 text-sm font-medium text-emerald-400";
        } else {
            returnFeedback.textContent = `Warning: Book returned, but no matching uncleared egg was found for patron ${farmerId}.`;
            returnFeedback.className = "mt-3 text-sm font-medium text-amber-400";
        }

        returnBarcodeInput.value = "";
    });
}