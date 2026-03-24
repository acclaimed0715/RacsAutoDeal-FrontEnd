// ─── Car Data ─────────────────────────────────────────────────────────────────
const carData = {
    escape2012: {
        title: 'Ford Escape XLs 2012',
        image: 'assets/suv_silver.png',
        name: 'Ford Escape',
        model: '2012',
        fuel: 'Gasoline',
        price: 'Starts at P750,000',
        brand: 'Ford',
        transmission: '5-Speed Manual / 6-Speed Automatic (varies by unit)',
        drivetrain: 'Front-Wheel Drive (FWD)',
        features: 'AM/FM Radio, CD Player, AUX Input',
        comfort: 'Air Conditioning, Power Windows, Power Door Locks',
        isFavorited: false,
    },
    escape2012_titanium: {
        title: 'Ford Escape Titanium 2012',
        image: 'assets/suv_gray.png',
        name: 'Ford Escape Titanium',
        model: '2012',
        fuel: 'Gasoline',
        price: 'Starts at P800,000',
        brand: 'Ford',
        transmission: '6-Speed Automatic',
        drivetrain: 'Front-Wheel Drive (FWD) / Optional AWD',
        features: 'Bluetooth, Premium Audio, Keyless Entry',
        comfort: 'Dual-zone Climate Control, Leather Seats, Power Liftgate',
        isFavorited: false,
    },
    livina2023: {
        title: 'Nissan Livina VL 2023',
        image: 'assets/suv_white.png',
        name: 'Nissan Livina',
        model: '2023',
        fuel: 'Gasoline',
        price: 'Starts at P1,100,000',
        brand: 'Nissan',
        transmission: '4-Speed Automatic',
        drivetrain: 'Front-Wheel Drive (FWD)',
        features: '7-inch Touchscreen Display, Apple CarPlay, Android Auto',
        comfort: 'Rear AC Vents, Leather Upholstery, Push Button Start',
        isFavorited: false,
    },
    civic_rs: {
        title: 'Honda Civic RS 2024',
        image: 'assets/sedan_black.png',
        name: 'Honda Civic RS',
        model: '2024',
        fuel: 'Gasoline',
        price: 'Starts at P1,775,000',
        brand: 'Honda',
        transmission: 'CVT',
        drivetrain: 'Front-Wheel Drive',
        features: 'Honda SENSING, 9-inch Display Audio, Bose Sound',
        comfort: 'Dual Zone AC, Leather Seats, Smart Key',
        isFavorited: false,
    },
    mazda3_sport: {
        title: 'Mazda 3 Sport 2023',
        image: 'assets/hatchback_red.png',
        name: 'Mazda 3',
        model: '2023',
        fuel: 'Mild Hybrid',
        price: 'Starts at P1,500,000',
        brand: 'Mazda',
        transmission: '6-Speed Automatic',
        drivetrain: 'Front-Wheel Drive',
        features: '360° View Monitor, Signature KODO Design, HUD',
        comfort: 'Burgundy Leather, Premium Bose Audio',
        isFavorited: false,
    },
    innova_v: {
        title: 'Toyota Innova V 2022',
        image: 'assets/suv_gray.png',
        name: 'Toyota Innova',
        model: '2022',
        fuel: 'Diesel',
        price: 'Starts at P1,750,000',
        brand: 'Toyota',
        transmission: '6-Speed Automatic',
        drivetrain: 'Rear-Wheel Drive',
        features: 'Captain Seats, Ambient Lighting, Touchscreen',
        comfort: 'Spacious Cabin, Rear AC, Push Start',
        isFavorited: false,
    },
    mustang_gt: {
        title: 'Ford Mustang GT 2024',
        image: 'assets/sedan_black.png',
        name: 'Ford Mustang',
        model: '2024',
        fuel: 'Gasoline (V8)',
        price: 'Starts at P3,500,000',
        brand: 'Ford',
        transmission: '10-Speed Automatic',
        drivetrain: 'Rear-Wheel Drive (RWD)',
        features: 'Track Apps, MagneRide Damping, SYNC 4',
        comfort: 'Recaro Leather Seats, Dual-Zone AC',
        isFavorited: false,
    },
};
// ─── Badge helper ─────────────────────────────────────────────────────────────
function getBadgeHtml(carId) {
    if (carId === 'escape2012')
        return `<span class="car-badge badge-best-deal"><i class="fa-regular fa-star"></i> Best Deal</span>`;
    if (carId === 'escape2012_titanium')
        return `<span class="car-badge badge-most-clicked"><i class="fa-solid fa-hand-pointer"></i> Most Clicked</span>`;
    if (carId === 'livina2023')
        return `<span class="car-badge badge-new"><i class="fa-solid fa-arrow-trend-up"></i> New</span>`;
    return '';
}
// ─── DOM Ready ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    // ── Scroll button ──────────────────────────────────────────────────────────
    const scrollBtn = document.getElementById('scrollBtn');
    scrollBtn === null || scrollBtn === void 0 ? void 0 : scrollBtn.addEventListener('click', () => {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    });
    // ── Filter Sidebar Toggle ──────────────────────────────────────────────────
    const filterBtn = document.querySelector('.filter-btn');
    const filterSidebar = document.getElementById('filterSidebar');
    const filterOverlay = document.getElementById('filterOverlay');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const openFilter = () => { filterSidebar === null || filterSidebar === void 0 ? void 0 : filterSidebar.classList.add('active'); filterOverlay === null || filterOverlay === void 0 ? void 0 : filterOverlay.classList.add('active'); };
    const closeFilter = () => { filterSidebar === null || filterSidebar === void 0 ? void 0 : filterSidebar.classList.remove('active'); filterOverlay === null || filterOverlay === void 0 ? void 0 : filterOverlay.classList.remove('active'); };
    filterBtn === null || filterBtn === void 0 ? void 0 : filterBtn.addEventListener('click', openFilter);
    closeFilterBtn === null || closeFilterBtn === void 0 ? void 0 : closeFilterBtn.addEventListener('click', closeFilter);
    filterOverlay === null || filterOverlay === void 0 ? void 0 : filterOverlay.addEventListener('click', closeFilter);
    applyFilterBtn === null || applyFilterBtn === void 0 ? void 0 : applyFilterBtn.addEventListener('click', closeFilter);
    // ── Show All Vehicles Toggle ───────────────────────────────────────────────
    const showAllBtn = document.getElementById('showAllBtn');
    const hiddenVehicles = document.getElementById('hiddenVehicles');
    if (showAllBtn && hiddenVehicles) {
        showAllBtn.addEventListener('click', () => {
            const isHidden = hiddenVehicles.style.display === 'none';
            hiddenVehicles.style.display = isHidden ? 'grid' : 'none';
            showAllBtn.innerHTML = isHidden
                ? '<i class="fa-regular fa-eye-slash"></i> <span>Hide vehicles</span>'
                : '<i class="fa-regular fa-images"></i> <span>Show all vehicles</span>';
        });
    }
    // ── Favorites UI ──────────────────────────────────────────────────────────
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesGrid = document.getElementById('favoritesGrid');
    function updateFavoritesUI() {
        if (!favoritesGrid || !favoritesSection)
            return;
        favoritesGrid.innerHTML = '';
        let hasFavorites = false;
        for (const carId in carData) {
            const entry = carData[carId];
            if (!entry.isFavorited)
                continue;
            hasFavorites = true;
            const card = document.createElement('div');
            card.className = 'car-card';
            card.innerHTML = `
                <div class="car-image-wrapper">
                    ${getBadgeHtml(carId)}
                    <img src="${entry.image}" alt="${entry.title}" class="car-image">
                </div>
                <h3 class="car-title">${entry.title}</h3>
                <button class="preview-btn" onclick="openPreview('${carId}')">
                    <i class="fa-regular fa-eye"></i> Preview
                </button>
            `;
            favoritesGrid.appendChild(card);
        }
        favoritesSection.style.display = hasFavorites ? 'block' : 'none';
    }
    updateFavoritesUI();
    // ── Preview Modal ─────────────────────────────────────────────────────────
    const previewModal = document.getElementById('previewModal');
    const previewOverlay = document.getElementById('previewOverlay');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const favoriteIcon = document.getElementById('favoriteIcon');
    let currentCarId = null;
    window.openPreview = (carId) => {
        currentCarId = carId;
        const entry = carData[carId];
        if (!entry || !previewModal || !previewOverlay)
            return;
        const eleImg = document.getElementById('carImg');
        const eleTitle = document.getElementById('carTitle');
        const eleName = document.getElementById('carName');
        const eleModel = document.getElementById('carModel');
        const eleFuel = document.getElementById('carFuel');
        const elePrice = document.getElementById('carPrice');
        const eleBrand = document.getElementById('carBrand');
        const eleTrans = document.getElementById('carTransmission');
        const eleDrive = document.getElementById('carDrivetrain');
        const eleFeat = document.getElementById('carFeatures');
        const eleComf = document.getElementById('carComfort');
        if (eleImg)
            eleImg.src = entry.image;
        if (eleTitle)
            eleTitle.textContent = entry.title;
        if (eleName)
            eleName.innerHTML = `<strong>Car Name:</strong> ${entry.name}`;
        if (eleModel)
            eleModel.innerHTML = `<strong>Car Model:</strong> ${entry.model}`;
        if (eleFuel)
            eleFuel.innerHTML = `<strong>Fuel Type:</strong> ${entry.fuel}`;
        if (elePrice)
            elePrice.innerHTML = `<strong>Price:</strong> ${entry.price}`;
        if (eleBrand)
            eleBrand.innerHTML = `<strong>Brand:</strong> ${entry.brand}`;
        if (eleTrans)
            eleTrans.innerHTML = `<strong>Transmission:</strong> ${entry.transmission}`;
        if (eleDrive) {
            if (entry.drivetrain) {
                eleDrive.innerHTML = `<strong>Drivetrain:</strong> ${entry.drivetrain}`;
                eleDrive.style.display = 'list-item';
            }
            else
                eleDrive.style.display = 'none';
        }
        if (eleFeat) {
            if (entry.features) {
                eleFeat.innerHTML = `<strong>Features:</strong> ${entry.features}`;
                eleFeat.style.display = 'list-item';
            }
            else
                eleFeat.style.display = 'none';
        }
        if (eleComf) {
            if (entry.comfort) {
                eleComf.innerHTML = `<strong>Comfort:</strong> ${entry.comfort}`;
                eleComf.style.display = 'list-item';
            }
            else
                eleComf.style.display = 'none';
        }
        // Sync favorite button state
        if (favoriteBtn && favoriteIcon) {
            favoriteBtn.classList.toggle('favorited', entry.isFavorited);
            favoriteIcon.classList.toggle('fa-solid', entry.isFavorited);
            favoriteIcon.classList.toggle('fa-regular', !entry.isFavorited);
        }
        previewModal.classList.add('active');
        previewOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    function closePreviewModal() {
        previewModal === null || previewModal === void 0 ? void 0 : previewModal.classList.remove('active');
        previewOverlay === null || previewOverlay === void 0 ? void 0 : previewOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    closePreviewBtn === null || closePreviewBtn === void 0 ? void 0 : closePreviewBtn.addEventListener('click', closePreviewModal);
    previewOverlay === null || previewOverlay === void 0 ? void 0 : previewOverlay.addEventListener('click', closePreviewModal);
    // ── Favorite button toggle ────────────────────────────────────────────────
    if (favoriteBtn && favoriteIcon) {
        favoriteBtn.addEventListener('click', () => {
            if (!currentCarId)
                return;
            const entry = carData[currentCarId];
            entry.isFavorited = !entry.isFavorited;
            favoriteBtn.classList.toggle('favorited', entry.isFavorited);
            favoriteIcon.classList.toggle('fa-solid', entry.isFavorited);
            favoriteIcon.classList.toggle('fa-regular', !entry.isFavorited);
            updateFavoritesUI();
        });
    }
    // ── Filtering (Multi-Select) ──────────────────────────────────────────────
    const carCards = document.querySelectorAll('.car-card');
    // Auto-assign data-category from title text if missing
    carCards.forEach(card => {
        var _a, _b, _c;
        if (card.getAttribute('data-category'))
            return;
        const title = (_c = (_b = (_a = card.querySelector('.car-title')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : '';
        if (title.includes('escape') || title.includes('innova') || title.includes('livina'))
            card.setAttribute('data-category', 'suv');
        else if (title.includes('civic'))
            card.setAttribute('data-category', 'sedan');
        else if (title.includes('mazda'))
            card.setAttribute('data-category', 'hatchback');
        else if (title.includes('mustang'))
            card.setAttribute('data-category', 'coupe');
    });
    const filterLists = document.querySelectorAll('.filter-list');
    function applyFilters() {
        const activeVehicleTypes = [];
        const activeCategories = [];
        filterLists.forEach(list => {
            var _a, _b, _c;
            const groupHeader = (_a = list.closest('.filter-group')) === null || _a === void 0 ? void 0 : _a.querySelector('.filter-group-title');
            if (!groupHeader)
                return;
            const groupTitle = (_c = (_b = groupHeader.textContent) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== null && _c !== void 0 ? _c : '';
            list.querySelectorAll('li.active').forEach(li => {
                var _a, _b;
                const text = (_b = (_a = li.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : '';
                if (text === 'all')
                    return;
                if (groupTitle.includes('VEHICLE TYPE'))
                    activeVehicleTypes.push(text);
                else if (groupTitle.includes('CATEGORY'))
                    activeCategories.push(text);
            });
        });
        // Dynamic grid title
        const gridTitle = document.getElementById('dynamicCategoryTitle');
        if (gridTitle) {
            gridTitle.textContent = activeVehicleTypes.length === 0
                ? 'All Vehicles'
                : activeVehicleTypes.map(t => t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(', ');
        }
        const showAllContainer = document.querySelector('.show-all-container');
        // Show/hide cards
        carCards.forEach(card => {
            var _a;
            let showType = true;
            let showCat = true;
            if (activeVehicleTypes.length > 0) {
                const cat = (_a = card.getAttribute('data-category')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                showType = !!(cat && activeVehicleTypes.includes(cat));
            }
            if (activeCategories.length > 0) {
                showCat = ((activeCategories.includes('new') && !!card.querySelector('.badge-new')) ||
                    (activeCategories.includes('best deal') && !!card.querySelector('.badge-best-deal')) ||
                    (activeCategories.includes('most clicked') && !!card.querySelector('.badge-most-clicked')));
            }
            card.style.display = showType && showCat ? 'flex' : 'none';
        });
        // Smart hidden-vehicles toggle
        if (hiddenVehicles) {
            const filtersActive = activeVehicleTypes.length > 0 || activeCategories.length > 0;
            hiddenVehicles.style.display = filtersActive ? 'grid' : 'none';
            if (showAllContainer)
                showAllContainer.style.display = filtersActive ? 'none' : 'flex';
        }
    }
    filterLists.forEach(list => {
        list.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', function () {
                var _a, _b, _c, _d;
                const filterText = (_b = (_a = this.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : '';
                if (filterText === 'all') {
                    list.querySelectorAll('li').forEach(el => el.classList.remove('active'));
                    this.classList.add('active');
                }
                else {
                    this.classList.toggle('active');
                    // Deselect "All" when a specific item is chosen
                    if (this.classList.contains('active')) {
                        (_c = Array.from(list.querySelectorAll('li')).find(el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === 'all'; })) === null || _c === void 0 ? void 0 : _c.classList.remove('active');
                    }
                    // Re-activate "All" if nothing is selected
                    if (!list.querySelector('li.active')) {
                        (_d = Array.from(list.querySelectorAll('li')).find(el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === 'all'; })) === null || _d === void 0 ? void 0 : _d.classList.add('active');
                    }
                }
                applyFilters();
            });
        });
    });
    // Reset filter button
    (_a = document.querySelector('.filter-reset-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        filterLists.forEach(list => {
            var _a;
            list.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            (_a = Array.from(list.querySelectorAll('li')).find(el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === 'all'; })) === null || _a === void 0 ? void 0 : _a.classList.add('active');
        });
        applyFilters();
    });
    // ── Fixed Navbar (always visible, style changes on scroll) ──────────────
    const smartNav = document.querySelector('.smart-nav');
    if (smartNav) {
        window.addEventListener('scroll', () => {
            smartNav.classList.toggle('scrolled', window.scrollY > 80);
        });
    }
});
export {};
