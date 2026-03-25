// ─── Car Data ─────────────────────────────────────────────────────────────────
const carData = {
    escape2012: {
        title: 'Ford Escape XLs 2012',
        images: ['assets/suv_silver.png', 'assets/suv_gray.png', 'assets/suv_white.png'],
        name: 'Ford Escape',
        model: '2012',
        fuel: 'Gasoline',
        price: 'Starts at P750,000',
        brand: 'Ford',
        transmission: '5-Speed Manual / 6-Speed Automatic (varies by unit)',
        description: 'Front-Wheel Drive (FWD). AM/FM Radio, CD Player, AUX Input. Air Conditioning, Power Windows, Power Door Locks.',
        isFavorited: false,
        mileage: '45,000 KM',
        engine: '2.5L I4',
        hp: '171 hp @ 6000 rpm',
        torque: '171 lb-ft @ 4500 rpm',
        safety: 'Front Airbags, ABS, ESC',
        seating: '5 Seater',
    },
    escape2012_titanium: {
        title: 'Ford Escape Titanium 2012',
        images: ['assets/suv_gray.png', 'assets/suv_silver.png', 'assets/suv_white.png'],
        name: 'Ford Escape Titanium',
        model: '2012',
        fuel: 'Gasoline',
        price: 'Starts at P800,000',
        brand: 'Ford',
        transmission: '6-Speed Automatic',
        description: 'Front-Wheel Drive (FWD) / Optional AWD. Bluetooth, Premium Audio, Keyless Entry. Dual-zone Climate Control, Leather Seats, Power Liftgate.',
        isFavorited: false,
        mileage: '38,000 KM',
        engine: '2.0L I4',
        hp: '240 hp @ 5500 rpm',
        torque: '270 lb-ft @ 3000 rpm',
        safety: 'Front/Side Airbags, ABS, Blind Spot Monitor',
        seating: '5 Seater',
    },
    livina2023: {
        title: 'Nissan Livina VL 2023',
        images: ['assets/suv_white.png', 'assets/suv_silver.png', 'assets/suv_gray.png'],
        name: 'Nissan Livina',
        model: '2023',
        fuel: 'Gasoline',
        price: 'Starts at P1,100,000',
        brand: 'Nissan',
        transmission: '4-Speed Automatic',
        description: 'Front-Wheel Drive (FWD). 7-inch Touchscreen Display, Apple CarPlay, Android Auto. Rear AC Vents, Leather Upholstery, Push Button Start.',
        isFavorited: false,
        mileage: '15,000 KM',
        engine: '1.5L I4',
        hp: '103 hp @ 6000 rpm',
        torque: '141 Nm @ 4000 rpm',
        safety: 'Dual Airbags, ABS with EBD',
        seating: '7 Seater',
    },
    civic_rs: {
        title: 'Honda Civic RS 2024',
        images: ['assets/sedan_black.png', 'assets/hatchback_red.png'],
        name: 'Honda Civic RS',
        model: '2024',
        fuel: 'Gasoline',
        price: 'Starts at P1,775,000',
        brand: 'Honda',
        transmission: 'CVT',
        description: 'Front-Wheel Drive. Honda SENSING, 9-inch Display Audio, Bose Sound. Dual Zone AC, Leather Seats, Smart Key.',
        isFavorited: false,
        mileage: '5,000 KM',
        engine: '1.5L VTEC Turbo',
        hp: '178 hp @ 6000 rpm',
        torque: '240 Nm @ 1700-4500 rpm',
        safety: 'Honda SENSING, 6 Airbags, ABS',
        seating: '5 Seater',
    },
    mazda3_sport: {
        title: 'Mazda 3 Sport 2023',
        images: ['assets/hatchback_red.png', 'assets/sedan_black.png'],
        name: 'Mazda 3',
        model: '2023',
        fuel: 'Mild Hybrid',
        price: 'Starts at P1,500,000',
        brand: 'Mazda',
        transmission: '6-Speed Automatic',
        description: 'Front-Wheel Drive. 360° View Monitor, Signature KODO Design, HUD. Burgundy Leather, Premium Bose Audio.',
        isFavorited: false,
        mileage: '12,000 KM',
        engine: '2.0L e-SKYACTIV-G (Mild Hybrid)',
        hp: '153 hp @ 6000 rpm',
        torque: '200 Nm @ 4000 rpm',
        safety: 'i-ACTIVSENSE, 7 Airbags, ABS',
        seating: '5 Seater',
    },
    innova_v: {
        title: 'Toyota Innova V 2022',
        images: ['assets/suv_gray.png', 'assets/suv_silver.png'],
        name: 'Toyota Innova',
        model: '2022',
        fuel: 'Diesel',
        price: 'Starts at P1,750,000',
        brand: 'Toyota',
        transmission: '6-Speed Automatic',
        description: 'Rear-Wheel Drive. Captain Seats, Ambient Lighting, Touchscreen. Spacious Cabin, Rear AC, Push Start.',
        isFavorited: false,
        mileage: '28,000 KM',
        engine: '2.8L 1GD-FTV Turbo Diesel',
        hp: '174 hp @ 3400 rpm',
        torque: '360 Nm @ 1200-3400 rpm',
        safety: 'Dual Airbags, ABS, VSC',
        seating: '7 Seater',
    },
    mustang_gt: {
        title: 'Ford Mustang GT 2024',
        images: ['assets/sedan_black.png', 'assets/hatchback_red.png'],
        name: 'Ford Mustang',
        model: '2024',
        fuel: 'Gasoline (V8)',
        price: 'Starts at P3,500,000',
        brand: 'Ford',
        transmission: '10-Speed Automatic',
        description: 'Rear-Wheel Drive (RWD). Track Apps, MagneRide Damping, SYNC 4. Recaro Leather Seats, Dual-Zone AC.',
        isFavorited: false,
        mileage: '2,000 KM',
        engine: '5.0L Ti-VCT V8',
        hp: '480 hp @ 7150 rpm',
        torque: '560 Nm @ 4900 rpm',
        safety: 'Ford Co-Pilot360, 8 Airbags, ABS',
        seating: '4 Seater',
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
// ─── Global State & Functions ──────────────────────────────────────────────────
window.currentCarId = null;
window.openPreview = (carId) => {
    var _a, _b, _c, _d, _e;
    window.currentCarId = carId;
    const entry = carData[carId];
    if (!entry)
        return;
    const previewModal = document.getElementById('previewModal');
    const previewOverlay = document.getElementById('previewOverlay');
    const carouselDots = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevImgBtn');
    const nextBtn = document.getElementById('nextImgBtn');
    if (!previewModal || !previewOverlay)
        return;
    let currentImgIdx = 0;
    const images = entry.images;
    const updateCarousel = () => {
        if (eleImg) {
            eleImg.style.opacity = '0.5';
            setTimeout(() => {
                eleImg.src = images[currentImgIdx];
                eleImg.style.opacity = '1';
            }, 150);
        }
        // Update dots
        if (carouselDots) {
            carouselDots.innerHTML = '';
            images.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.className = `dot ${idx === currentImgIdx ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    currentImgIdx = idx;
                    updateCarousel();
                });
                carouselDots.appendChild(dot);
            });
        }
        if (prevBtn)
            prevBtn.disabled = currentImgIdx === 0;
        if (nextBtn)
            nextBtn.disabled = currentImgIdx === images.length - 1;
    };
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentImgIdx > 0) {
                currentImgIdx--;
                updateCarousel();
            }
        };
    }
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentImgIdx < images.length - 1) {
                currentImgIdx++;
                updateCarousel();
            }
        };
    }
    const eleImg = document.getElementById('carImg');
    const eleTitle = document.getElementById('carTitle');
    const eleName = document.getElementById('carName');
    const eleModel = document.getElementById('carModel');
    const eleFuel = document.getElementById('carFuel');
    const elePrice = document.getElementById('carPrice');
    const eleBrand = document.getElementById('carBrand');
    const eleTrans = document.getElementById('carTransmission');
    const eleDesc = document.getElementById('carDescription');
    // Feature Blocks
    const featModel = document.getElementById('featModel');
    const featMileage = document.getElementById('featMileage');
    const featTrans = document.getElementById('featTrans');
    const featFuel = document.getElementById('featFuel');
    // Other Features Tab
    const featEngine = (_a = document.getElementById('featEngine')) === null || _a === void 0 ? void 0 : _a.querySelector('span');
    const featHP = (_b = document.getElementById('featHP')) === null || _b === void 0 ? void 0 : _b.querySelector('span');
    const featTorque = (_c = document.getElementById('featTorque')) === null || _c === void 0 ? void 0 : _c.querySelector('span');
    const featSafety = (_d = document.getElementById('featSafety')) === null || _d === void 0 ? void 0 : _d.querySelector('span');
    const featSeating = (_e = document.getElementById('featSeating')) === null || _e === void 0 ? void 0 : _e.querySelector('span');
    updateCarousel();
    if (eleTitle)
        eleTitle.textContent = entry.title;
    // Description Tab Populating
    if (eleName)
        eleName.innerHTML = `<strong>Car Name:</strong> <span>${entry.name}</span>`;
    if (eleModel)
        eleModel.innerHTML = `<strong>Car Model:</strong> <span>${entry.model}</span>`;
    if (eleFuel)
        eleFuel.innerHTML = `<strong>Fuel Type:</strong> <span>${entry.fuel}</span>`;
    if (elePrice)
        elePrice.innerHTML = `<strong>Price:</strong> <span>${entry.price}</span>`;
    if (eleBrand)
        eleBrand.innerHTML = `<strong>Brand:</strong> <span>${entry.brand}</span>`;
    if (eleTrans)
        eleTrans.innerHTML = `<strong>Transmission:</strong> <span>${entry.transmission}</span>`;
    if (eleDesc)
        eleDesc.innerHTML = `<strong>Description:</strong> <span>${entry.description}</span>`;
    // Feature Blocks Populating
    if (featModel)
        featModel.textContent = `${entry.model} Model`;
    if (featMileage)
        featMileage.textContent = entry.mileage || 'N/A';
    if (featTrans) {
        const t = entry.transmission.toLowerCase();
        featTrans.textContent = t.includes('automatic') || t.includes('cvt') ? 'Automatic' : 'Manual';
    }
    if (featFuel)
        featFuel.textContent = entry.fuel;
    // Other Features Tab Populating
    if (featEngine)
        featEngine.textContent = entry.engine || 'Standard';
    if (featHP)
        featHP.textContent = entry.hp || 'Standard';
    if (featTorque)
        featTorque.textContent = entry.torque || 'Standard';
    if (featSafety)
        featSafety.textContent = entry.safety || 'Standard';
    if (featSeating)
        featSeating.textContent = entry.seating || 'Standard';
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    // Reset to Description tab whenever opened
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    tabs[0].classList.add('active');
    tabContents[0].classList.add('active');
    tabs.forEach(tab => {
        tab.onclick = () => {
            var _a, _b;
            const target = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            if (target === 'description') {
                (_a = document.getElementById('description-tab')) === null || _a === void 0 ? void 0 : _a.classList.add('active');
            }
            else {
                (_b = document.getElementById('other-features-tab')) === null || _b === void 0 ? void 0 : _b.classList.add('active');
            }
        };
    });
    // Sync favorite button state
    const favoriteBtn = document.getElementById('favoriteBtn');
    const favoriteIcon = document.getElementById('favoriteIcon');
    if (favoriteBtn && favoriteIcon) {
        favoriteBtn.classList.toggle('favorited', entry.isFavorited);
    }
    previewModal.classList.add('active');
    previewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};
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
    // ── Favorites Logic ───────────────────────────────────────────
    const navFavBtn = document.getElementById('navFavBtn');
    const favCount = document.getElementById('favCount');
    const favModal = document.getElementById('favModal');
    const favOverlay = document.getElementById('favOverlay');
    const closeFavBtn = document.getElementById('closeFavBtn');
    const favModalBody = document.getElementById('favModalBody');
    function updateFavoritesUI() {
        if (!favModalBody || !favCount)
            return;
        favModalBody.innerHTML = '';
        let count = 0;
        for (const carId in carData) {
            const entry = carData[carId];
            if (!entry || !entry.isFavorited)
                continue;
            count++;
            const item = document.createElement('div');
            item.className = 'fav-item';
            // Safe price extraction
            const priceParts = entry.price.split(' ');
            const displayPrice = priceParts.length > 2 ? priceParts[2] : entry.price;
            item.innerHTML = `
                <div class="fav-item-img">
                    <img src="${entry.images[0]}" alt="${entry.title}">
                </div>
                <div class="fav-item-info">
                    <span class="fav-item-title">${entry.title}</span>
                    <span class="fav-item-price">${displayPrice}</span>
                </div>
                <i class="fa-solid fa-trash remove-fav-btn" data-id="${carId}" title="Remove from Favorites"></i>
            `;
            item.addEventListener('click', (e) => {
                const target = e.target;
                if (!target.classList.contains('remove-fav-btn')) {
                    closeFavorites();
                    window.openPreview(carId);
                }
            });
            favModalBody.appendChild(item);
        }
        favCount.textContent = count.toString();
        favCount.classList.toggle('active', count > 0);
        if (count === 0) {
            favModalBody.innerHTML = '<div class="empty-fav-message">You haven\'t favorited any cars yet.</div>';
        }
        const removeBtns = favModalBody.querySelectorAll('.remove-fav-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const carId = btn.getAttribute('data-id');
                if (carData[carId]) {
                    carData[carId].isFavorited = false;
                    updateFavoritesUI();
                    if (window.currentCarId === carId) {
                        const favoriteBtn = document.getElementById('favoriteBtn');
                        const favoriteIcon = document.getElementById('favoriteIcon');
                        if (favoriteBtn && favoriteIcon) {
                            favoriteBtn.classList.remove('favorited');
                        }
                    }
                }
            });
        });
    }
    const openFavorites = () => {
        favModal === null || favModal === void 0 ? void 0 : favModal.classList.add('active');
        favOverlay === null || favOverlay === void 0 ? void 0 : favOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const closeFavorites = () => {
        favModal === null || favModal === void 0 ? void 0 : favModal.classList.remove('active');
        favOverlay === null || favOverlay === void 0 ? void 0 : favOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    navFavBtn === null || navFavBtn === void 0 ? void 0 : navFavBtn.addEventListener('click', openFavorites);
    closeFavBtn === null || closeFavBtn === void 0 ? void 0 : closeFavBtn.addEventListener('click', closeFavorites);
    favOverlay === null || favOverlay === void 0 ? void 0 : favOverlay.addEventListener('click', closeFavorites);
    updateFavoritesUI();
    // ── Preview Modal Actions ─────────────────────────────────────────
    const previewModal = document.getElementById('previewModal');
    const previewOverlay = document.getElementById('previewOverlay');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const favoriteIcon = document.getElementById('favoriteIcon');
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
            const carId = window.currentCarId;
            if (!carId)
                return;
            const entry = carData[carId];
            entry.isFavorited = !entry.isFavorited;
            favoriteBtn.classList.toggle('favorited', entry.isFavorited);
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
