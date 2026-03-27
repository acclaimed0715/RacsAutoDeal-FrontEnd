// ─── Car Data ─────────────────────────────────────────────────────────────────
const carData = {
    escape2012: {
        title: 'Ford Escape XLs 2012',
        images: ['assets/suv_silver.png', 'assets/suv_gray.png', 'assets/suv_white.png'],
        name: 'Ford Escape',
        model: '2012',
        fuel: 'Gasoline',
        price: '₱750,000',
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
        type: 'SUV'
    },
    tesla_plaid: {
        title: 'Tesla Model S Plaid 2024',
        images: ['assets/tesla_plaid.png'],
        name: 'Tesla Model S',
        model: '2024',
        fuel: 'Electric',
        price: '₱6,500,000',
        brand: 'Tesla',
        transmission: 'Single-Speed Fixed Gear',
        description: 'All-Wheel Drive (AWD). 1,020 hp, 0-60 mph in 1.99s. 17-inch Cinematic Display, Autopilot, Premium Audio.',
        isFavorited: false,
        mileage: '0 KM',
        engine: 'Tri-Motor Electric',
        hp: '1,020 hp',
        torque: '1,050 lb-ft',
        safety: 'Autopilot, 8 Cameras, 12 Ultrasonic Sensors',
        seating: '5 Seater',
        posted: 'New Arrival',
        type: 'Electric Car'
    },
    porsche_taycan: {
        title: 'Porsche Taycan Turbo S 2024',
        images: ['assets/porsche_taycan.png'],
        name: 'Porsche Taycan',
        model: '2024',
        fuel: 'Electric',
        price: '₱12,500,000',
        brand: 'Porsche',
        transmission: '2-Speed Automatic (Rear), 1-Speed (Front)',
        description: 'All-Wheel Drive (AWD). 800V Architecture, Taycan Soul, Matrix LED Headlights. Performance Battery Plus, Sport Chrono Package.',
        isFavorited: false,
        mileage: '0 KM',
        engine: 'Dual-Motor Electric',
        hp: '750 hp (Overboost)',
        torque: '774 lb-ft',
        safety: 'Porsche InnoDrive, Night View Assist',
        seating: '4 Seater',
        posted: 'New Arrival',
        type: 'Electric Car'
    },
    escape2012_titanium: {
        title: 'Ford Escape Titanium 2012',
        images: ['assets/suv_gray.png', 'assets/suv_silver.png', 'assets/suv_white.png'],
        name: 'Ford Escape Titanium',
        model: '2012',
        fuel: 'Gasoline',
        price: '₱800,000',
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
        type: 'SUV'
    },
    livina2023: {
        title: 'Nissan Livina VL 2023',
        images: ['assets/suv_white.png', 'assets/suv_silver.png', 'assets/suv_gray.png'],
        name: 'Nissan Livina',
        model: '2023',
        fuel: 'Gasoline',
        price: '₱1,100,000',
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
        type: 'SUV'
    },
    civic_rs: {
        title: 'Honda Civic RS 2024',
        images: ['assets/sedan_black.png', 'assets/hatchback_red.png'],
        name: 'Honda Civic RS',
        model: '2024',
        fuel: 'Gasoline',
        price: '₱1,775,000',
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
        type: 'Sedan'
    },
    mazda3_sport: {
        title: 'Mazda 3 Sport 2023',
        images: ['assets/hatchback_red.png', 'assets/sedan_black.png'],
        name: 'Mazda 3',
        model: '2023',
        fuel: 'Mild Hybrid',
        price: '₱1,500,000',
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
        type: 'Hatchback'
    },
    innova_v: {
        title: 'Toyota Innova V 2022',
        images: ['assets/suv_gray.png', 'assets/suv_silver.png'],
        name: 'Toyota Innova',
        model: '2022',
        fuel: 'Diesel',
        price: '₱1,750,000',
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
        type: 'Van'
    },
    mustang_gt: {
        title: 'Ford Mustang GT 2024',
        images: ['assets/sedan_black.png', 'assets/hatchback_red.png'],
        name: 'Ford Mustang',
        model: '2024',
        fuel: 'Gasoline (V8)',
        price: '₱3,500,000',
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
        type: 'Sports Car'
    },
};
// ─── Merge Admin-Added Cars from localStorage ─────────────────────────────────
(function mergeAdminCars() {
    try {
        const stored = localStorage.getItem('racs_car_inventory');
        if (!stored)
            return;
        const adminCars = JSON.parse(stored);
        adminCars.forEach((car) => {
            const id = car.id;
            carData[id] = {
                title: `${car.name} ${car.model || ''}`.trim(),
                images: car.images && car.images.length ? car.images : ['assets/suv_silver.png'],
                name: car.name,
                model: car.model || 'N/A',
                fuel: car.fuel || 'N/A',
                price: car.price,
                brand: car.brand || 'N/A',
                transmission: car.transmission || 'N/A',
                description: car.description || '',
                isFavorited: false,
                mileage: car.mileage || 'N/A',
                engine: car.engine || 'N/A',
                hp: car.hp || 'N/A',
                torque: car.torque || 'N/A',
                safety: car.safety || 'N/A',
                seating: car.seating || 'N/A',
                posted: car.posted || 'Just Added',
                type: 'Admin Added'
            };
        });
    }
    catch (e) {
        console.warn('Could not merge admin cars:', e);
    }
})();
// ─── Badge helper ─────────────────────────────────────────────────────────────
function getBadgeHtml(carId) {
    if (carId === 'escape2012')
        return `<span class="car-badge badge-best-deal"><i class="fa-regular fa-star"></i> Best Deal</span>`;
    if (carId === 'escape2012_titanium')
        return `<span class="car-badge badge-most-clicked"><i class="fa-solid fa-hand-pointer"></i> Most Clicked</span>`;
    if (carId === 'livina2023')
        return `<span class="car-badge badge-new"><i class="fa-solid fa-arrow-trend-up"></i> New</span>`;
    if (carId === 'tesla_plaid' || carId === 'porsche_taycan')
        return `<span class="car-badge badge-electric" style="background:#00d2ff; color:#000;"><i class="fa-solid fa-bolt"></i> EV</span>`;
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
    const elePrice = document.getElementById('modalCarPrice');
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
        elePrice.innerHTML = entry.price;
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
    // ── Reveal Animations ───────────────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
    // ── Promo Carousel Logic ────────────────────────────────────────────────
    const promoTrack = document.getElementById('promoTrack');
    const promoSlides = document.querySelectorAll('.promo-slide');
    const promoDots = document.querySelectorAll('.promo-dot-wrapper');
    const promoPrev = document.getElementById('promoPrev');
    const promoNext = document.getElementById('promoNext');
    let currentPromo = 0;
    let promoInterval;
    const updatePromo = (index) => {
        var _a, _b;
        promoSlides.forEach(s => s.classList.remove('active'));
        promoDots.forEach(d => d.classList.remove('active'));
        currentPromo = (index + promoSlides.length) % promoSlides.length;
        if (promoTrack) {
            promoTrack.style.transform = `translateX(-${currentPromo * 100}%)`;
        }
        (_a = promoSlides[currentPromo]) === null || _a === void 0 ? void 0 : _a.classList.add('active');
        (_b = promoDots[currentPromo]) === null || _b === void 0 ? void 0 : _b.classList.add('active');
    };
    const nextPromo = () => updatePromo(currentPromo + 1);
    const prevPromo = () => updatePromo(currentPromo - 1);
    const startPromoAutoPlay = () => {
        clearInterval(promoInterval);
        promoInterval = setInterval(nextPromo, 5000);
    };
    if (promoSlides.length > 0) {
        promoPrev === null || promoPrev === void 0 ? void 0 : promoPrev.addEventListener('click', () => { prevPromo(); startPromoAutoPlay(); });
        promoNext === null || promoNext === void 0 ? void 0 : promoNext.addEventListener('click', () => { nextPromo(); startPromoAutoPlay(); });
        promoDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => { updatePromo(idx); startPromoAutoPlay(); });
        });
        startPromoAutoPlay();
    }
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
    // Car keys populated from carData (includes admin-added cars from localStorage)\n
    let carKeys = Object.keys(carData);
    let currentPage = 1;
    const ITEMS_PER_PAGE = 10;
    let currentView = 'grid';
    function renderCars(page) {
        const carGrid = document.getElementById('carGrid');
        const gridTitleP = document.getElementById('dynamicCategoryTitle');
        if (!carGrid)
            return;
        carGrid.innerHTML = '';
        let displayKeys = carKeys;
        if (currentView === 'garage') {
            displayKeys = carKeys.filter(id => carData[id].isFavorited);
            if (gridTitleP)
                gridTitleP.textContent = 'My Garage (Favorites)';
        }
        if (displayKeys.length === 0 && currentView === 'garage') {
            carGrid.innerHTML = '<div class="empty-fav-message" style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #666; font-style: italic; font-size: 1.2rem;">You haven\'t favorited any cars yet.</div>';
            renderPagination(0);
            return;
        }
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageKeys = displayKeys.slice(startIndex, endIndex);
        pageKeys.forEach(id => {
            const entry = carData[id];
            const badgeHTML = typeof getBadgeHtml === 'function' ? getBadgeHtml(id.replace('_v2', '').replace('_v3', '')) : '';
            const cardHTML = `
                <div class="car-card" data-id="${id}">
                    <div class="car-image-wrapper">
                        ${badgeHTML}
                        <img src="${entry.images[0]}" alt="${entry.name}" class="car-image">
                    </div>
                    <div class="car-card-middle">
                        <h3 class="card-name">${entry.title}</h3>
                        <p class="card-description clamped-desc">${entry.description}</p>
                        <div class="card-features-row">
                            <div class="card-feat-compact"><span>Year</span><b>${entry.model}</b></div>
                            <div class="card-feat-compact"><span>Mileage</span><b>${entry.mileage || 'N/A'}</b></div>
                            <div class="card-feat-compact"><span>Fuel</span><b>${entry.fuel.split(' ')[0]}</b></div>
                            <div class="card-feat-compact"><span>Trans</span><b>${entry.transmission.toLowerCase().includes('auto') || entry.transmission.toLowerCase().includes('cvt') ? 'Auto' : 'Manual'}</b></div>
                        </div>
                    </div>
                    <div class="car-card-right">
                        <div class="card-price">${entry.price}</div>
                        <div class="card-action-icon fav-card-btn ${entry.isFavorited ? 'favorited' : ''}" data-id="${id}"><i class="fa-solid fa-key"></i></div>
                        <div class="card-posted-compact"><i class="fa-regular fa-clock"></i> ${entry.posted}</div>
                    </div>
                </div>
            `;
            carGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
        renderPagination(displayKeys.length);
    }
    function renderPagination(totalItems) {
        const pageNumbersContainer = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        if (!pageNumbersContainer)
            return;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        pageNumbersContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('div');
            btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i.toString();
            btn.onclick = () => {
                var _a;
                currentPage = i;
                renderCars(currentPage);
                (_a = document.querySelector('.inventory-section')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
            };
            pageNumbersContainer.appendChild(btn);
        }
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderCars(currentPage);
                    window.scrollTo({ top: document.querySelector('.inventory-section').offsetTop - 100, behavior: 'smooth' });
                }
            };
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages || totalPages === 0;
            nextBtn.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderCars(currentPage);
                    window.scrollTo({ top: document.querySelector('.inventory-section').offsetTop - 100, behavior: 'smooth' });
                }
            };
        }
    }
    function applyFilters() {
        const activeVehicleTypes = [];
        const activeCategories = [];
        const topSearchInput = document.querySelector('.nav-search input');
        const brandSearch = (brandSearchInput === null || brandSearchInput === void 0 ? void 0 : brandSearchInput.value.toLowerCase().trim()) || (topSearchInput === null || topSearchInput === void 0 ? void 0 : topSearchInput.value.toLowerCase().trim()) || '';
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
        const allKeys = Object.keys(carData);
        carKeys = allKeys.filter(id => {
            const entry = carData[id];
            // Search
            const matchesSearch = !brandSearch ||
                entry.brand.toLowerCase().includes(brandSearch) ||
                entry.name.toLowerCase().includes(brandSearch) ||
                entry.title.toLowerCase().includes(brandSearch);
            // Vehicle Type
            let matchesType = true;
            if (activeVehicleTypes.length > 0) {
                matchesType = activeVehicleTypes.some(vt => {
                    var _a;
                    return ((_a = entry.type) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(vt)) ||
                        entry.brand.toLowerCase().includes(vt) ||
                        entry.name.toLowerCase().includes(vt);
                });
            }
            // Category (Badges)
            let matchesCat = true;
            if (activeCategories.length > 0) {
                const badge = getBadgeHtml(id.replace('_v2', '').replace('_v3', '')).toLowerCase();
                matchesCat = activeCategories.some(cat => badge.includes(cat));
            }
            // Price
            const numericPrice = parseInt(entry.price.replace(/[^0-9]/g, '')) || 0;
            const matchesPrice = numericPrice >= minPrice && numericPrice <= maxPrice;
            return matchesSearch && matchesType && matchesCat && matchesPrice;
        });
        currentPage = 1;
        renderCars(1);
        const gridTitle = document.getElementById('dynamicCategoryTitle');
        if (gridTitle) {
            gridTitle.textContent = activeVehicleTypes.length === 0
                ? (brandSearch ? `Search: "${brandSearch}"` : 'All Vehicles')
                : activeVehicleTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
        }
    }
    // Input List Actions
    brandSearchInput === null || brandSearchInput === void 0 ? void 0 : brandSearchInput.addEventListener('input', applyFilters);
    minPriceInput === null || minPriceInput === void 0 ? void 0 : minPriceInput.addEventListener('input', applyFilters);
    maxPriceInput === null || maxPriceInput === void 0 ? void 0 : maxPriceInput.addEventListener('input', applyFilters);
    const topSearch = document.querySelector('.nav-search input');
    const navSearchBar = document.querySelector('.search-bar.nav-search');
    const clearIcon = navSearchBar === null || navSearchBar === void 0 ? void 0 : navSearchBar.querySelector('.clear-icon');
    let hasScrolledOnSearch = false;
    if (topSearch && navSearchBar) {
        topSearch.addEventListener('input', () => {
            navSearchBar.classList.toggle('has-value', topSearch.value.length > 0);
            if (topSearch.value.length > 0 && !hasScrolledOnSearch) {
                hasScrolledOnSearch = true;
                const inventorySection = document.querySelector('.inventory-section');
                if (inventorySection) {
                    setTimeout(() => inventorySection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
                }
            }
            else if (topSearch.value.length === 0) {
                hasScrolledOnSearch = false;
            }
            applyFilters();
        });
    }
    if (clearIcon && topSearch && navSearchBar) {
        clearIcon.addEventListener('click', () => {
            topSearch.value = '';
            navSearchBar.classList.remove('has-value');
            hasScrolledOnSearch = false;
            topSearch.focus();
            applyFilters();
        });
    }
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
        if (topSearch) {
            topSearch.value = '';
            navSearchBar === null || navSearchBar === void 0 ? void 0 : navSearchBar.classList.remove('has-value');
        }
        if (minPriceInput)
            minPriceInput.value = '';
        if (maxPriceInput)
            maxPriceInput.value = '';
        hasScrolledOnSearch = false;
        applyFilters();
    });
    // View Toggling Logic
    const carGrid = document.getElementById('carGrid');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const garageViewBtn = document.getElementById('garageViewBtn');
    if (listViewBtn && gridViewBtn && garageViewBtn && carGrid) {
        gridViewBtn.addEventListener('click', () => {
            currentView = 'grid';
            carGrid.classList.add('grid-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            garageViewBtn.classList.remove('active');
            applyFilters();
        });
        listViewBtn.addEventListener('click', () => {
            currentView = 'list';
            carGrid.classList.remove('grid-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            garageViewBtn.classList.remove('active');
            applyFilters();
        });
        garageViewBtn.addEventListener('click', () => {
            currentView = 'garage';
            carGrid.classList.add('grid-view');
            garageViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.remove('active');
            renderCars(1);
        });
    }
    if (carGrid) {
        carGrid.addEventListener('click', (e) => {
            const target = e.target;
            const favBtn = target.closest('.fav-card-btn');
            const carCard = target.closest('.car-card');
            if (favBtn) {
                e.stopPropagation();
                const carId = favBtn.getAttribute('data-id');
                if (carId && carData[carId]) {
                    const entry = carData[carId];
                    entry.isFavorited = !entry.isFavorited;
                    favBtn.classList.toggle('favorited', entry.isFavorited);
                    updateFavoritesBadge();
                    if (currentView === 'garage')
                        renderCars(currentPage);
                    if (window.currentCarId === carId) {
                        const modalFavBtn = document.getElementById('favoriteBtn');
                        if (modalFavBtn)
                            modalFavBtn.classList.toggle('favorited', entry.isFavorited);
                    }
                }
                return;
            }
            if (carCard) {
                const carId = carCard.getAttribute('data-id');
                if (carId && typeof window.openPreview === 'function') {
                    window.openPreview(carId);
                }
            }
        });
    }
    // ── Favorites Logic ───────────────────────────────────────────
    const inventoryFavCount = document.getElementById('inventoryFavCount');
    function updateFavoritesBadge() {
        var _a;
        if (!inventoryFavCount)
            return;
        let count = 0;
        for (const carId in carData) {
            if ((_a = carData[carId]) === null || _a === void 0 ? void 0 : _a.isFavorited)
                count++;
        }
        inventoryFavCount.textContent = count.toString();
    }
    updateFavoritesBadge();
    // ── Notification Logic ─────────────────────────────────────────
    const mockNotifsArray = [
        { title: 'Price Drop Alert', desc: 'Ford Mustang GT price dropped by ₱50k!', time: '1 hr ago', unread: true },
        { title: 'New Arrival', desc: 'A brand new 2024 Honda Civic RS was just added to our inventory.', time: '3 hrs ago', unread: true },
        { title: 'Report Status', desc: 'Your report #1029 has been reviewed by our support team.', time: '1 day ago', unread: true },
        { title: 'Welcome!', desc: 'Thanks for joining Racs Auto Deal!', time: '2 days ago', unread: false }
    ];
    const navNotifButton = document.getElementById('navNotifBtn');
    const notificationModal = document.getElementById('notifModal');
    const notificationOverlay = document.getElementById('notifOverlay');
    const closeNotificationBtn = document.getElementById('closeNotifBtn');
    const notificationList = document.getElementById('notifList');
    const notificationBadge = document.getElementById('notifBadge');
    const notificationCountPill = document.getElementById('notifCountPill');
    function renderNotifs() {
        if (!notificationList)
            return;
        notificationList.innerHTML = '';
        let unreadCount = 0;
        mockNotifsArray.forEach((notif) => {
            if (notif.unread)
                unreadCount++;
            const li = document.createElement('li');
            li.className = `notif-item ${notif.unread ? 'unread' : ''}`;
            let iconClass = 'fa-bell';
            if (notif.title.includes('Drop'))
                iconClass = 'fa-arrow-trend-down';
            else if (notif.title.includes('Arrival'))
                iconClass = 'fa-car-side';
            else if (notif.title.includes('Report'))
                iconClass = 'fa-clipboard-check';
            li.innerHTML = `
                <div class="notif-icon"><i class="fa-solid ${iconClass}"></i></div>
                <div class="notif-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.desc}</p>
                    <span class="notif-time">${notif.time}</span>
                </div>
            `;
            notificationList.appendChild(li);
        });
        if (notificationBadge) {
            notificationBadge.textContent = unreadCount.toString();
            notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        if (notificationCountPill) {
            notificationCountPill.textContent = unreadCount.toString();
        }
    }
    renderNotifs();
    const toggleNotifs = (e) => {
        if (e)
            e.stopPropagation();
        notificationModal === null || notificationModal === void 0 ? void 0 : notificationModal.classList.toggle('active');
    };
    const closeNotifs = () => {
        notificationModal === null || notificationModal === void 0 ? void 0 : notificationModal.classList.remove('active');
    };
    navNotifButton === null || navNotifButton === void 0 ? void 0 : navNotifButton.addEventListener('click', toggleNotifs);
    closeNotificationBtn === null || closeNotificationBtn === void 0 ? void 0 : closeNotificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeNotifs();
    });
    document.addEventListener('click', (e) => {
        if (notificationModal === null || notificationModal === void 0 ? void 0 : notificationModal.classList.contains('active')) {
            const target = e.target;
            if (!notificationModal.contains(target) && !(navNotifButton === null || navNotifButton === void 0 ? void 0 : navNotifButton.contains(target))) {
                closeNotifs();
            }
        }
    });
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
        updateFavoritesBadge();
        if (currentView === 'garage')
            renderCars(currentPage);
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
    // Initial render
    applyFilters();
});
export {};
