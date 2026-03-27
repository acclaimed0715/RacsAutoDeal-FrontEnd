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
        posted: '1 Day Ago',
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
        posted: '1 Day Ago',
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
        posted: '2 Days Ago',
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
        posted: '3 Days Ago',
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
        posted: '4 Days Ago',
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
        posted: '5 Days Ago',
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
        posted: '1 Day Ago',
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
    const carPostedTime = document.getElementById('carPostedTime');
    if (carPostedTime)
        carPostedTime.textContent = entry.posted;
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
    // Configure Inquire button (Custom Gmail-style Composer)
    const inquireBtn = document.getElementById('inquireBtnModal');
    const emailComposer = document.getElementById('emailComposer');
    const composerSubject = document.getElementById('composerSubject');
    const composerMessage = document.getElementById('composerMessage');
    if (inquireBtn && emailComposer && composerSubject && composerMessage) {
        inquireBtn.onclick = () => {
            composerSubject.value = `Inquiry for ${entry.title}`;
            composerMessage.value =
                `Hi Racs Auto Deal,\n\nI am interested in inquiring about the following unit:\n\n` +
                    `Unit: ${entry.title}\n` +
                    `Year: ${entry.model}\n` +
                    `Price: ${entry.price}\n\n` +
                    `Please send me more details. Thank you!`;
            emailComposer.classList.add('active');
        };
    }
    // Sync favorite button state
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.classList.toggle('favorited', entry.isFavorited);
    }
    previewModal.classList.add('active');
    previewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};
// ─── DOM Ready ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    // ── Elements & State ──────────────────────────────────────────────────────────
    const filterBtn = document.querySelector('.filter-btn');
    const filterSidebar = document.getElementById('filterSidebar');
    const filterOverlay = document.getElementById('filterOverlay');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const filterLists = document.querySelectorAll('.filter-list');
    const carCards = document.querySelectorAll('.car-card');
    // Brand & Price Inputs
    const brandSearchInput = document.getElementById('brandSearchInput');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');
    // Scroll button
    const scrollBtn = document.getElementById('scrollBtn');
    scrollBtn === null || scrollBtn === void 0 ? void 0 : scrollBtn.addEventListener('click', () => {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    });
    // ── Filter Sidebar Logic ──────────────────────────────────────────────────
    const openFilter = () => { filterSidebar === null || filterSidebar === void 0 ? void 0 : filterSidebar.classList.add('active'); filterOverlay === null || filterOverlay === void 0 ? void 0 : filterOverlay.classList.add('active'); };
    const closeFilter = () => { filterSidebar === null || filterSidebar === void 0 ? void 0 : filterSidebar.classList.remove('active'); filterOverlay === null || filterOverlay === void 0 ? void 0 : filterOverlay.classList.remove('active'); };
    filterBtn === null || filterBtn === void 0 ? void 0 : filterBtn.addEventListener('click', openFilter);
    closeFilterBtn === null || closeFilterBtn === void 0 ? void 0 : closeFilterBtn.addEventListener('click', closeFilter);
    filterOverlay === null || filterOverlay === void 0 ? void 0 : filterOverlay.addEventListener('click', closeFilter);
    applyFilterBtn === null || applyFilterBtn === void 0 ? void 0 : applyFilterBtn.addEventListener('click', closeFilter);
    // Section Toggles (Accordion)
    document.querySelectorAll('.filter-group-header').forEach(header => {
        header.addEventListener('click', () => {
            var _a;
            (_a = header.parentElement) === null || _a === void 0 ? void 0 : _a.classList.toggle('collapsed');
        });
    });
    function applyFilters() {
        const activeVehicleTypes = [];
        const activeCategories = [];
        const brandSearch = (brandSearchInput === null || brandSearchInput === void 0 ? void 0 : brandSearchInput.value.toLowerCase().trim()) || '';
        const minPrice = parseInt(minPriceInput === null || minPriceInput === void 0 ? void 0 : minPriceInput.value) || 0;
        const maxPrice = parseInt(maxPriceInput === null || maxPriceInput === void 0 ? void 0 : maxPriceInput.value) || Infinity;
        filterLists.forEach(list => {
            var _a, _b, _c;
            const groupHeader = (_a = list.closest('.filter-group')) === null || _a === void 0 ? void 0 : _a.querySelector('.filter-group-title');
            if (!groupHeader)
                return;
            const groupTitle = (_c = (_b = groupHeader.textContent) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== null && _c !== void 0 ? _c : '';
            list.querySelectorAll('li.active').forEach(li => {
                var _a, _b;
                const text = (_b = (_a = li.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : '';
                if (groupTitle.includes('VEHICLE TYPE'))
                    activeVehicleTypes.push(text);
                else if (groupTitle.includes('CATEGORY'))
                    activeCategories.push(text);
            });
        });
        carCards.forEach(card => {
            var _a, _b, _c;
            const carId = card.getAttribute('data-id');
            const entry = carData[carId];
            if (!entry)
                return;
            // 1. Vehicle Type
            let showType = true;
            if (activeVehicleTypes.length > 0) {
                const type = (_a = card.getAttribute('data-category')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                showType = !!(type && activeVehicleTypes.includes(type));
            }
            // 2. Category (Badges)
            let showCat = true;
            if (activeCategories.length > 0) {
                const badgeText = ((_c = (_b = card.querySelector('.car-badge')) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
                showCat = activeCategories.some(cat => badgeText.includes(cat));
            }
            // 3. Brand Search
            const showBrand = brandSearch === '' ||
                entry.brand.toLowerCase().includes(brandSearch) ||
                entry.name.toLowerCase().includes(brandSearch);
            // 4. Price Filter
            const numericPrice = parseInt(entry.price.replace(/[^0-9]/g, '')) || 0;
            const showPrice = numericPrice >= minPrice && numericPrice <= maxPrice;
            card.style.display = (showType && showCat && showBrand && showPrice) ? 'flex' : 'none';
        });
        const gridTitle = document.getElementById('dynamicCategoryTitle');
        if (gridTitle) {
            gridTitle.textContent = activeVehicleTypes.length === 0
                ? 'All Vehicles'
                : activeVehicleTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
        }
    }
    // Input List Actions
    brandSearchInput === null || brandSearchInput === void 0 ? void 0 : brandSearchInput.addEventListener('input', applyFilters);
    minPriceInput === null || minPriceInput === void 0 ? void 0 : minPriceInput.addEventListener('input', applyFilters);
    maxPriceInput === null || maxPriceInput === void 0 ? void 0 : maxPriceInput.addEventListener('input', applyFilters);
    filterLists.forEach(list => {
        list.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', function () {
                this.classList.toggle('active');
                applyFilters();
            });
        });
    });
    // Reset button
    (_a = document.querySelector('.filter-reset-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        filterLists.forEach(list => list.querySelectorAll('li').forEach(li => li.classList.remove('active')));
        if (brandSearchInput)
            brandSearchInput.value = '';
        if (minPriceInput)
            minPriceInput.value = '';
        if (maxPriceInput)
            maxPriceInput.value = '';
        applyFilters();
    });
    // ── Favorites Logic ───────────────────────────────────────────
    const navFavBtn = document.getElementById('navFavBtn');
    const favCount = document.getElementById('favCount');
    const favModal = document.getElementById('favModal');
    const favOverlay = document.getElementById('favOverlay');
    const closeFavBtn = document.getElementById('closeFavBtn');
    const favModalBody = document.getElementById('favModalBody');
    const openFavorites = () => { favModal === null || favModal === void 0 ? void 0 : favModal.classList.add('active'); favOverlay === null || favOverlay === void 0 ? void 0 : favOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const closeFavorites = () => { favModal === null || favModal === void 0 ? void 0 : favModal.classList.remove('active'); favOverlay === null || favOverlay === void 0 ? void 0 : favOverlay.classList.remove('active'); document.body.style.overflow = 'auto'; };
    function updateFavoritesUI() {
        if (!favModalBody || !favCount)
            return;
        favModalBody.innerHTML = '';
        let count = 0;
        for (const carId in carData) {
            const entry = carData[carId];
            if (entry === null || entry === void 0 ? void 0 : entry.isFavorited) {
                count++;
                const item = document.createElement('div');
                item.className = 'fav-item';
                const priceMatch = entry.price.match(/₱[0-9,]+/);
                const displayPrice = priceMatch ? priceMatch[0] : entry.price;
                item.innerHTML = `
                    <div class="fav-item-img"><img src="${entry.images[0]}" alt="${entry.title}"></div>
                    <div class="fav-item-info">
                        <span class="fav-item-title">${entry.title}</span>
                        <div class="dealer-action">
                            <button class="message-dealer-btn inquire-fav-btn" data-id="${carId}">Inquire</button>
                        </div>
                        <span class="fav-item-price">${displayPrice}</span>
                    </div>
                    <i class="fa-solid fa-trash remove-fav-btn" data-id="${carId}"></i>
                `;
                item.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('remove-fav-btn') && !e.target.classList.contains('inquire-fav-btn')) {
                        closeFavorites();
                        window.openPreview(carId);
                    }
                });
                favModalBody.appendChild(item);
            }
        }
        favCount.textContent = count.toString();
        favCount.classList.toggle('active', count > 0);
        if (count === 0)
            favModalBody.innerHTML = '<div class="empty-fav-message">You haven\'t favorited any cars yet.</div>';
        favModalBody.querySelectorAll('.remove-fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                var _a;
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                if (carData[id]) {
                    carData[id].isFavorited = false;
                    updateFavoritesUI();
                    document.querySelectorAll(`.fav-card-btn[data-id="${id}"]`).forEach(b => b.classList.remove('favorited'));
                    if (window.currentCarId === id)
                        (_a = document.getElementById('favoriteBtn')) === null || _a === void 0 ? void 0 : _a.classList.remove('favorited');
                }
            });
        });
    }
    navFavBtn === null || navFavBtn === void 0 ? void 0 : navFavBtn.addEventListener('click', openFavorites);
    closeFavBtn === null || closeFavBtn === void 0 ? void 0 : closeFavBtn.addEventListener('click', closeFavorites);
    favOverlay === null || favOverlay === void 0 ? void 0 : favOverlay.addEventListener('click', closeFavorites);
    // Initial Sync
    const favCardBtns = document.querySelectorAll('.fav-card-btn');
    favCardBtns.forEach(btn => {
        var _a;
        const carId = btn.getAttribute('data-id');
        if (carId && ((_a = carData[carId]) === null || _a === void 0 ? void 0 : _a.isFavorited))
            btn.classList.add('favorited');
        btn.addEventListener('click', (e) => {
            var _a;
            e.stopPropagation();
            if (!carId || !carData[carId])
                return;
            const entry = carData[carId];
            entry.isFavorited = !entry.isFavorited;
            btn.classList.toggle('favorited', entry.isFavorited);
            if (window.currentCarId === carId)
                (_a = document.getElementById('favoriteBtn')) === null || _a === void 0 ? void 0 : _a.classList.toggle('favorited', entry.isFavorited);
            updateFavoritesUI();
        });
    });
    updateFavoritesUI();
    // ── Preview & Reporting Logic ───────────────────────────────────
    const previewOverlay = document.getElementById('previewOverlay');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const closePreview = () => { var _a; (_a = document.getElementById('previewModal')) === null || _a === void 0 ? void 0 : _a.classList.remove('active'); previewOverlay === null || previewOverlay === void 0 ? void 0 : previewOverlay.classList.remove('active'); document.body.style.overflow = 'auto'; };
    closePreviewBtn === null || closePreviewBtn === void 0 ? void 0 : closePreviewBtn.addEventListener('click', closePreview);
    previewOverlay === null || previewOverlay === void 0 ? void 0 : previewOverlay.addEventListener('click', closePreview);
    const openReportBtn = document.getElementById('openReportBtn');
    const reportModal = document.getElementById('reportModal');
    const reportOverlay = document.getElementById('reportOverlay');
    const closeReportBtn = document.getElementById('closeReportBtn');
    const reportForm = document.getElementById('reportForm');
    openReportBtn === null || openReportBtn === void 0 ? void 0 : openReportBtn.addEventListener('click', () => { reportModal.style.display = 'block'; reportOverlay.style.display = 'block'; document.body.style.overflow = 'hidden'; });
    const closeReport = () => { reportModal.style.display = 'none'; reportOverlay.style.display = 'none'; document.body.style.overflow = 'auto'; };
    closeReportBtn === null || closeReportBtn === void 0 ? void 0 : closeReportBtn.addEventListener('click', closeReport);
    reportOverlay === null || reportOverlay === void 0 ? void 0 : reportOverlay.addEventListener('click', closeReport);
    reportForm === null || reportForm === void 0 ? void 0 : reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = reportForm.querySelector('.report-submit-btn');
        const original = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Report Sent!';
            btn.style.background = '#27ae60';
            setTimeout(() => { closeReport(); reportForm.reset(); btn.textContent = original; btn.style.background = ''; btn.disabled = false; alert('Thank you! Your report has been submitted.'); }, 1500);
        }, 1000);
    });
    // ── Scroll Behaviors ──────────────────────────────────────────
    const smartNav = document.querySelector('.smart-nav');
    if (smartNav)
        window.addEventListener('scroll', () => smartNav.classList.toggle('scrolled', window.scrollY > 80));
    // ── Preview Modal Favorite Toggle ──────────────────────────────
    const favoriteBtn = document.getElementById('favoriteBtn');
    favoriteBtn === null || favoriteBtn === void 0 ? void 0 : favoriteBtn.addEventListener('click', () => {
        const carId = window.currentCarId;
        if (!carId || !carData[carId])
            return;
        const entry = carData[carId];
        entry.isFavorited = !entry.isFavorited;
        favoriteBtn.classList.toggle('favorited', entry.isFavorited);
        // Sync back to inventory card
        document.querySelectorAll(`.fav-card-btn[data-id="${carId}"]`).forEach(btn => btn.classList.toggle('favorited', entry.isFavorited));
        updateFavoritesUI();
    });
    // ── Email Composer Global Logic ────────────────────────────────
    const emailComposer = document.getElementById('emailComposer');
    const closeComposerBtn = document.getElementById('closeComposerBtn');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const composerDelete = document.querySelector('.composer-delete');
    const closeComposer = () => emailComposer === null || emailComposer === void 0 ? void 0 : emailComposer.classList.remove('active');
    closeComposerBtn === null || closeComposerBtn === void 0 ? void 0 : closeComposerBtn.addEventListener('click', closeComposer);
    composerDelete === null || composerDelete === void 0 ? void 0 : composerDelete.addEventListener('click', closeComposer);
    sendEmailBtn === null || sendEmailBtn === void 0 ? void 0 : sendEmailBtn.addEventListener('click', () => {
        const fromField = document.getElementById('composerFrom');
        if (fromField && !fromField.value.trim()) {
            alert('Please enter your email in the "From" field.');
            fromField.focus();
            return;
        }
        if (!sendEmailBtn)
            return;
        const originalText = sendEmailBtn.textContent;
        sendEmailBtn.textContent = 'Sending...';
        sendEmailBtn.disabled = true;
        setTimeout(() => {
            alert('Your inquiry has been sent to our sales team!');
            closeComposer();
            if (fromField)
                fromField.value = ''; // Clean up
            sendEmailBtn.textContent = originalText;
            sendEmailBtn.disabled = false;
        }, 1500);
    });
    // ── FAQs ──────────────────────────────────────────────────────
    document.querySelectorAll('.faq-item').forEach(item => {
        var _a;
        (_a = item.querySelector('.faq-question')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!wasActive)
                item.classList.add('active');
        });
    });
});
export {};
