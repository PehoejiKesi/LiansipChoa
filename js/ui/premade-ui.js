/**
 * Premade UI Manager
 * Handles rendering and interaction for the premade section
 */
window.App = window.App || {};
window.App.UI = window.App.UI || {};

window.App.UI.Premade = (function () {
    const DOM = {
        grid: null,
        filterBar: null,
        tabs: null
    };

    let activeTag = 'all';

    function init() {
        console.log('Initializing Premade UI...');
        DOM.grid = document.getElementById('premadeGrid');
        DOM.filterBar = document.getElementById('tagFilterBar');

        if (!DOM.grid || !DOM.filterBar) {
            console.error('Premade UI elements not found');
            return;
        }

        renderFilters();
        renderGrid();
    }

    function renderFilters() {
        if (!window.App.Data.Premade) return;

        const tags = window.App.Data.Premade.getAllTags();
        DOM.filterBar.innerHTML = '';

        // "All" button
        const allBtn = createFilterBtn(window.App.Data.t('tagAll'), 'all', activeTag === 'all');
        DOM.filterBar.appendChild(allBtn);

        // Tag buttons
        tags.forEach(tag => {
            const btn = createFilterBtn(getTagTranslation(tag), tag, activeTag === tag);
            DOM.filterBar.appendChild(btn);
        });
    }

    function createFilterBtn(label, tag, isActive) {
        const btn = document.createElement('button');
        btn.className = `tag-btn ${isActive ? 'active' : ''}`;
        btn.textContent = label;
        btn.dataset.tag = tag;
        btn.addEventListener('click', () => {
            activeTag = tag;
            updateFilterState();
            renderGrid();
        });
        return btn;
    }

    function updateFilterState() {
        const btns = DOM.filterBar.querySelectorAll('.tag-btn');
        btns.forEach(btn => {
            if (btn.dataset.tag === activeTag) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function renderGrid() {
        if (!window.App.Data.Premade) return;

        DOM.grid.innerHTML = '';
        const items = window.App.Data.Premade.items;
        const currentLang = window.App.Data.currentLanguage || 'poj';

        const filteredItems = (activeTag === 'all'
            ? items
            : items.filter(item => item.tags.includes(activeTag)))
            .slice() // Create a copy to avoid mutating original
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

        if (filteredItems.length === 0) {
            DOM.grid.innerHTML = '<p class="no-items">No items found.</p>';
            return;
        }

        filteredItems.forEach(item => {
            const card = createCard(item, currentLang);
            DOM.grid.appendChild(card);
        });
    }

    function createCard(item, lang) {
        const card = document.createElement('div');
        card.className = 'premade-card';

        const description = item.description[lang] || item.description.poj;

        const formattedDate = new Date(item.date).toLocaleDateString();

        card.innerHTML = `
            <div class="card-image">
                <img src="${item.image}" alt="${description}" loading="lazy">
            </div>
            <div class="card-content">
                <p>${description}</p>
                <div class="card-tags">
                    ${item.tags.map(tag => `<span class="hashtag">#${getTagTranslation(tag)}</span>`).join('')}
                </div>
                <div class="card-date">${formattedDate}</div>
                <a href="${item.pdfUrl}" class="premade-btn" target="_blank">
                    ${window.App.Data.t('premadeButton')}
                </a>
            </div>
        `;

        return card;
    }

    function getTagTranslation(tag) {
        if (!window.App.Data.t) return tag;

        // Map raw tag to translation key
        // e.g. 'vowels' -> 'tagVowels', 'writing_system' -> 'tagWritingSystem'
        const camelCase = tag.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        const key = 'tag' + camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
        const translation = window.App.Data.t(key);
        return translation;
    }

    // Export public API
    return {
        init: init
    };
})();

// Helper alias for main.js calling convention if needed
window.App.Data.initPremadeUI = window.App.UI.Premade.init;
