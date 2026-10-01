// Local Storage Database Abstraction Layer (Mystery Egg Ready)
const STORAGE_KEYS = {
    PATRONS: 'lib_monster_patrons',
    ACTIVE_PATRON: 'lib_monster_active_patron',
    ACTIVE_LOANS: 'lib_monster_active_loans'
};

export const Storage = {
    getPatrons() {
        const data = localStorage.getItem(STORAGE_KEYS.PATRONS);
        return data ? JSON.parse(data) : {};
    },
    savePatrons(patrons) {
        localStorage.setItem(STORAGE_KEYS.PATRONS, JSON.stringify(patrons));
    },
    getPatron(farmerId) {
        if (!farmerId) return null;
        const patrons = this.getPatrons();
        if (!patrons[farmerId]) {
            patrons[farmerId] = { farmerId, incubator: [], binder: {} };
            this.savePatrons(patrons);
        }
        return patrons[farmerId];
    },
    updatePatron(patron) {
        const patrons = this.getPatrons();
        patrons[patron.farmerId] = patron;
        this.savePatrons(patrons);
    },
    getActiveFarmerId() {
        return localStorage.getItem(STORAGE_KEYS.ACTIVE_PATRON) || '';
    },
    setActiveFarmerId(farmerId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PATRON, farmerId);
    },
    getActiveLoans() {
        const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_LOANS);
        return data ? JSON.parse(data) : {};
    },
    saveActiveLoans(loans) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_LOANS, JSON.stringify(loans));
    }
};