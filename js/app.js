// Main ES6 Application Bootstrapper
import { renderAdminView } from './components/adminView.js';
import { renderPatronView } from './components/patronView.js';
import { renderBinderView } from './components/binderView.js';
import { renderTradeView } from './components/tradeView.js';
import { Storage } from './storage.js';

class App {
    constructor() {
        this.currentTab = 'admin';
        this.container = document.getElementById('view-container');
        this.initNav();
        this.renderActiveView();
    }

    initNav() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                tabButtons.forEach(b => {
                    b.classList.remove('bg-amber-600', 'text-white', 'shadow');
                    b.classList.add('text-slate-300', 'hover:text-white', 'hover:bg-slate-800');
                });
                e.target.classList.remove('text-slate-300', 'hover:text-white', 'hover:bg-slate-800');
                e.target.classList.add('bg-amber-600', 'text-white', 'shadow');

                this.currentTab = e.target.getAttribute('data-tab');
                this.renderActiveView();
            });
        });
    }

    renderActiveView() {
        // Clear previous view contents cleanly
        this.container.innerHTML = '';

        const notifyStateChange = () => {
            // Optional cross-view notification hook if required
        };

        switch (this.currentTab) {
            case 'admin':
                renderAdminView(this.container, notifyStateChange);
                break;
            case 'patron':
                renderPatronView(this.container, notifyStateChange);
                break;
            case 'binder':
                renderBinderView(this.container);
                break;
            case 'trade':
                renderTradeView(this.container, notifyStateChange);
                break;
            default:
                renderAdminView(this.container, notifyStateChange);
        }
    }
}

// Boot application on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new App();
});