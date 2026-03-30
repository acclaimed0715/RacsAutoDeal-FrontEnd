// main.ts — Index page logic
export { };

// ─── Types ────────────────────────────────────────────────────────────────────

type CarId = string;

declare global {
    interface Window {
        openPreview: (carId: CarId) => void;
        currentCarId: CarId | null;
    }
}

interface Vehicle {
    id: string;
    name: string;
    price: string;
    modelYear: string;
    mileage: string;
    brand: string;
    transmission: string;
    fuelType: string;
    engine: string;
    hp: string;
    torque: string;
    safety: string;
    seating: string;
    description: string;
    status: 'open' | 'in-progress' | 'closed';
    images: string[];
    date: string;
    isFavorited?: boolean; // UI only
    posted?: string; // UI only
    type?: string; // UI only
}

type CarDataDictionary = Record<string, Vehicle>;

// ─── Car Data ─────────────────────────────────────────────────────────────────

const carData: CarDataDictionary = {
    escape2012: {
        id: 'escape2012',
        name: 'Ford Escape',
        modelYear: '2012',
        fuelType: 'Gasoline',
        price: '₱750,000',
        brand: 'Ford',
        transmission: '5-Speed Manual / 6-Speed Automatic',
        description: 'Front-Wheel Drive (FWD). AM/FM Radio, CD Player, AUX Input.',
        isFavorited: false,
        mileage: '45,000 KM',
        engine: '2.5L I4',
        hp: '171 hp',
        torque: '171 lb-ft',
        safety: 'Front Airbags, ABS',
        seating: '5 Seater',
        posted: '1 Day Ago',
        type: 'SUV',
        status: 'open',
        images: ['assets/suv_silver.png', 'assets/suv_gray.png', 'assets/suv_white.png'],
        date: '2026-03-27'
    },
    tesla_plaid: {
        id: 'tesla_plaid',
        name: 'Tesla Model S Plaid',
        modelYear: '2024',
        fuelType: 'Electric',
        price: '₱6,500,000',
        brand: 'Tesla',
        transmission: 'Single-Speed Fixed Gear',
        description: 'All-Wheel Drive (AWD). 1,020 hp, 0-60 mph in 1.99s. Autopilot.',
        isFavorited: false,
        mileage: '0 KM',
        engine: 'Tri-Motor Electric',
        hp: '1,020 hp',
        torque: '1,050 lb-ft',
        safety: 'Autopilot, 8 Cameras',
        seating: '5 Seater',
        posted: 'New Arrival',
        type: 'Electric Car',
        status: 'open',
        images: ['assets/tesla_plaid.png'],
        date: '2026-03-27'
    },
    porsche_taycan: {
        id: 'porsche_taycan',
        name: 'Porsche Taycan Turbo S',
        modelYear: '2024',
        fuelType: 'Electric',
        price: '₱12,500,000',
        brand: 'Porsche',
        transmission: '2-Speed Automatic',
        description: 'All-Wheel Drive (AWD). 800V Architecture, Taycan Soul, Matrix LED Headlights.',
        isFavorited: false,
        mileage: '0 KM',
        engine: 'Dual-Motor Electric',
        hp: '750 hp',
        torque: '774 lb-ft',
        safety: 'Porsche InnoDrive',
        seating: '4 Seater',
        posted: 'New Arrival',
        type: 'Electric Car',
        status: 'open',
        images: ['assets/porsche_taycan.png'],
        date: '2026-03-27'
    },
    escape2012_titanium: {
        id: 'escape2012_titanium',
        name: 'Ford Escape Titanium',
        modelYear: '2012',
        fuelType: 'Gasoline',
        price: '₱800,000',
        brand: 'Ford',
        transmission: '6-Speed Automatic',
        description: 'Front-Wheel Drive (FWD) / Optional AWD. Bluetooth, Premium Audio.',
        isFavorited: false,
        mileage: '38,000 KM',
        engine: '2.0L I4',
        hp: '240 hp',
        torque: '270 lb-ft',
        safety: 'Front/Side Airbags, ABS',
        seating: '5 Seater',
        posted: '1 Day Ago',
        type: 'SUV',
        status: 'open',
        images: ['assets/suv_gray.png', 'assets/suv_silver.png', 'assets/suv_white.png'],
        date: '2026-03-27'
    },
    livina2023: {
        id: 'livina2023',
        name: 'Nissan Livina VL',
        modelYear: '2023',
        fuelType: 'Gasoline',
        price: '₱1,100,000',
        brand: 'Nissan',
        transmission: '4-Speed Automatic',
        description: 'Front-Wheel Drive (FWD). 7-inch Display, CarPlay, Android Auto.',
        isFavorited: false,
        mileage: '15,000 KM',
        engine: '1.5L I4',
        hp: '103 hp',
        torque: '141 Nm',
        safety: 'Dual Airbags, ABS',
        seating: '7 Seater',
        posted: '2 Days Ago',
        type: 'SUV',
        status: 'open',
        images: ['assets/suv_white.png', 'assets/suv_silver.png', 'assets/suv_gray.png'],
        date: '2026-03-27'
    },
    civic_rs: {
        id: 'civic_rs',
        name: 'Honda Civic RS',
        modelYear: '2024',
        fuelType: 'Gasoline',
        price: '₱1,775,000',
        brand: 'Honda',
        transmission: 'CVT',
        description: 'Front-Wheel Drive. Honda SENSING, 9-inch Display, Bose Sound.',
        isFavorited: false,
        mileage: '5,000 KM',
        engine: '1.5L Turbo',
        hp: '178 hp',
        torque: '240 Nm',
        safety: 'Honda SENSING',
        seating: '5 Seater',
        posted: '3 Days Ago',
        type: 'Sedan',
        status: 'open',
        images: ['assets/sedan_black.png', 'assets/hatchback_red.png'],
        date: '2026-03-27'
    },
    mazda3_sport: {
        id: 'mazda3_sport',
        name: 'Mazda 3 Sport',
        modelYear: '2023',
        fuelType: 'Mild Hybrid',
        price: '₱1,500,000',
        brand: 'Mazda',
        transmission: '6-Speed Automatic',
        description: 'Front-Wheel Drive. 360° View Monitor, Signature KODO Design.',
        isFavorited: false,
        mileage: '12,000 KM',
        engine: '2.0L Mild Hybrid',
        hp: '153 hp',
        torque: '200 Nm',
        safety: 'i-ACTIVSENSE',
        seating: '5 Seater',
        posted: '4 Days Ago',
        type: 'Hatchback',
        status: 'open',
        images: ['assets/hatchback_red.png', 'assets/sedan_black.png'],
        date: '2026-03-27'
    },
    innova_v: {
        id: 'innova_v',
        name: 'Toyota Innova V',
        modelYear: '2022',
        fuelType: 'Diesel',
        price: '₱1,750,000',
        brand: 'Toyota',
        transmission: '6-Speed Automatic',
        description: 'Rear-Wheel Drive. Captain Seats, Ambient Lighting.',
        isFavorited: false,
        mileage: '28,000 KM',
        engine: '2.8L Turbo Diesel',
        hp: '174 hp',
        torque: '360 Nm',
        safety: 'Dual Airbags, ABS, VSC',
        seating: '7 Seater',
        posted: '5 Days Ago',
        type: 'Van',
        status: 'open',
        images: ['assets/suv_gray.png', 'assets/suv_silver.png'],
        date: '2026-03-27'
    },
    mustang_gt: {
        id: 'mustang_gt',
        name: 'Ford Mustang GT',
        modelYear: '2024',
        fuelType: 'Gasoline (V8)',
        price: '₱3,500,000',
        brand: 'Ford',
        transmission: '10-Speed Automatic',
        description: 'Rear-Wheel Drive (RWD). Track Apps, MagneRide.',
        isFavorited: false,
        mileage: '2,000 KM',
        engine: '5.0L V8',
        hp: '480 hp',
        torque: '560 Nm',
        safety: 'Ford Co-Pilot360',
        seating: '4 Seater',
        posted: '1 Day Ago',
        type: 'Sports Car',
        status: 'open',
        images: ['assets/sedan_black.png', 'assets/hatchback_red.png'],
        date: '2026-03-27'
    },
};

// ─── Merge Admin-Added Cars from localStorage ─────────────────────────────────

function mergeAdminCars() {
    const INVENTORY_KEY = 'racs_car_inventory';
    const adminCarsRaw = localStorage.getItem(INVENTORY_KEY);
    if (!adminCarsRaw) return;

    try {
        const adminCars = JSON.parse(adminCarsRaw) as Vehicle[];
        adminCars.forEach(car => {
            carData[car.id] = {
                ...car,
                isFavorited: carData[car.id]?.isFavorited || false,
                posted: carData[car.id]?.posted || 'Recently Added'
            };
        });
    } catch (e) {
        console.error('Failed to parse admin cars', e);
    }
}

// ─── Badge helper ─────────────────────────────────────────────────────────────

function getBadgeHtml(carId: CarId): string {
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

function openPreview(carId: CarId) {
    mergeAdminCars();
    const car = carData[carId];
    if (!car) return;

    window.currentCarId = carId;
    const modal = document.getElementById('previewModal');
    const overlay = document.getElementById('previewOverlay');
    const carouselDots = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevImgBtn') as HTMLButtonElement | null;
    const nextBtn = document.getElementById('nextImgBtn') as HTMLButtonElement | null;
    const eleImg = document.getElementById('carImg') as HTMLImageElement | null;

    if (!modal || !overlay) return;

    let currentImgIdx = 0;
    const images = car.images;

    const updateCarousel = () => {
        if (eleImg && images.length > 0) {
            eleImg.style.opacity = '0.5';
            setTimeout(() => {
                eleImg.src = images[currentImgIdx];
                eleImg.style.opacity = '1';
            }, 150);
        }

        if (carouselDots) {
            carouselDots.innerHTML = '';
            images.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.className = `dot ${idx === currentImgIdx ? 'active' : ''}`;
                dot.onclick = () => {
                    currentImgIdx = idx;
                    updateCarousel();
                };
                carouselDots.appendChild(dot);
            });
        }

        if (prevBtn) prevBtn.disabled = currentImgIdx === 0;
        if (nextBtn) nextBtn.disabled = currentImgIdx === images.length - 1;
    };

    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentImgIdx > 0) { currentImgIdx--; updateCarousel(); }
        };
    }
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentImgIdx < images.length - 1) { currentImgIdx++; updateCarousel(); }
        };
    }

    // Populating UI
    const eleTitle = document.getElementById('carTitle');
    const elePrice = document.getElementById('modalCarPrice');
    const featModel = document.getElementById('featModel');
    const featMileage = document.getElementById('featMileage');
    const featTrans = document.getElementById('featTrans');
    const featFuel = document.getElementById('featFuel');
    const eleDesc = document.getElementById('carDescription');
    const featEngine = document.getElementById('featEngine')?.querySelector('span');
    const featHP = document.getElementById('featHP')?.querySelector('span');
    const featTorque = document.getElementById('featTorque')?.querySelector('span');
    const featSafety = document.getElementById('featSafety')?.querySelector('span');
    const featSeating = document.getElementById('featSeating')?.querySelector('span');

    updateCarousel();
    if (eleTitle) eleTitle.textContent = car.name;
    if (elePrice) elePrice.textContent = car.price;
    if (featModel) featModel.textContent = `${car.modelYear} Model`;
    if (featMileage) featMileage.textContent = car.mileage || 'N/A';
    if (featTrans) featTrans.textContent = car.transmission.toLowerCase().includes('auto') || car.transmission.toLowerCase().includes('cvt') ? 'Automatic' : 'Manual';
    if (featFuel) featFuel.textContent = car.fuelType;
    if (eleDesc) eleDesc.textContent = car.description;

    if (featEngine) featEngine.textContent = car.engine || 'Standard';
    if (featHP) featHP.textContent = car.hp || 'Standard';
    if (featTorque) featTorque.textContent = car.torque || 'Standard';
    if (featSafety) featSafety.textContent = car.safety || 'Standard';
    if (featSeating) featSeating.textContent = car.seating || 'Standard';

    const carPostedTime = document.getElementById('carPostedTime');
    if (carPostedTime) carPostedTime.textContent = car.posted || 'Recently Added';

    // Tabs reset
    const tabs = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    if (tabs[0]) tabs[0].classList.add('active');
    if (tabContents[0]) tabContents[0].classList.add('active');

    // Sync favorite button
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) favoriteBtn.classList.toggle('favorited', car.isFavorited || false);

    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.openPreview = openPreview;

// ─── DOM Ready ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
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
    let promoInterval: ReturnType<typeof setInterval>;

    const updatePromo = (index: number) => {
        promoSlides.forEach(s => s.classList.remove('active'));
        promoDots.forEach(d => d.classList.remove('active'));
        currentPromo = (index + promoSlides.length) % promoSlides.length;
        
        if (promoTrack) {
            promoTrack.style.transform = `translateX(-${currentPromo * 100}%)`;
        }
        
        promoSlides[currentPromo]?.classList.add('active');
        promoDots[currentPromo]?.classList.add('active');
    };

    const nextPromo = () => updatePromo(currentPromo + 1);
    const prevPromo = () => updatePromo(currentPromo - 1);

    const startPromoAutoPlay = () => {
        clearInterval(promoInterval);
        promoInterval = setInterval(nextPromo, 5000);
    };

    if (promoSlides.length > 0) {
        promoPrev?.addEventListener('click', () => { prevPromo(); startPromoAutoPlay(); });
        promoNext?.addEventListener('click', () => { nextPromo(); startPromoAutoPlay(); });
        promoDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => { updatePromo(idx); startPromoAutoPlay(); });
        });
        startPromoAutoPlay();
    }

    // ── Elements & State ──────────────────────────────────────────────────────────
    const filterBtn = document.querySelector<HTMLElement>('.filter-btn');
    const filterSidebar = document.getElementById('filterSidebar');
    const filterOverlay = document.getElementById('filterOverlay');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const filterLists = document.querySelectorAll<HTMLElement>('.filter-list');
    
    // Brand & Price Inputs
    const brandSearchInput = document.getElementById('brandSearchInput') as HTMLInputElement;
    const minPriceInput = document.getElementById('minPriceInput') as HTMLInputElement;
    const maxPriceInput = document.getElementById('maxPriceInput') as HTMLInputElement;

    // Scroll button
    const scrollBtn = document.getElementById('scrollBtn');
    scrollBtn?.addEventListener('click', () => {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    });

    // ── Filter Sidebar Logic ──────────────────────────────────────────────────
    const openFilter = (): void => { filterSidebar?.classList.add('active'); filterOverlay?.classList.add('active'); };
    const closeFilter = (): void => { filterSidebar?.classList.remove('active'); filterOverlay?.classList.remove('active'); };

    filterBtn?.addEventListener('click', openFilter);
    closeFilterBtn?.addEventListener('click', closeFilter);
    filterOverlay?.addEventListener('click', closeFilter);
    applyFilterBtn?.addEventListener('click', closeFilter);

    // Section Toggles (Accordion)
    document.querySelectorAll('.filter-group-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement?.classList.toggle('collapsed');
        });
    });

    let carKeys: CarId[] = Object.keys(carData) as CarId[];
    let currentPage = 1;
    const ITEMS_PER_PAGE = 10;
    let currentView: 'grid' | 'list' | 'garage' = 'grid';

    function renderCars(page: number): void {
        const carGrid = document.getElementById('carGrid');
        const gridTitleP = document.getElementById('dynamicCategoryTitle');
        if (!carGrid) return;

        carGrid.innerHTML = '';

        let displayKeys = carKeys;
        if (currentView === 'garage') {
            displayKeys = carKeys.filter(id => carData[id].isFavorited);
            if (gridTitleP) gridTitleP.textContent = 'My Garage (Favorites)';
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
            const car = carData[id];
            const badgeHTML = getBadgeHtml(id);
            
            const cardHTML = `
                <div class="car-card" data-id="${id}">
                    <div class="car-image-wrapper">
                        ${badgeHTML}
                        <img src="${car.images[0]}" alt="${car.name}" class="car-image">
                    </div>
                    <div class="car-card-middle">
                        <h3 class="card-name">${car.name} ${car.modelYear}</h3>
                        <p class="card-description clamped-desc">${car.description}</p>
                        <div class="card-features-row">
                            <div class="card-feat-compact"><span>Year</span><b>${car.modelYear}</b></div>
                            <div class="card-feat-compact"><span>Mileage</span><b>${car.mileage || 'N/A'}</b></div>
                            <div class="card-feat-compact"><span>Fuel</span><b>${car.fuelType.split(' ')[0]}</b></div>
                            <div class="card-feat-compact"><span>Trans</span><b>${car.transmission.toLowerCase().includes('auto') || car.transmission.toLowerCase().includes('cvt') ? 'Auto' : 'Manual'}</b></div>
                        </div>
                    </div>
                    <div class="car-card-right">
                        <div class="card-price">${car.price}</div>
                        <div class="card-action-icon fav-card-btn ${car.isFavorited ? 'favorited' : ''}" data-id="${id}"><i class="fa-solid fa-key"></i></div>
                        <div class="card-posted-compact"><i class="fa-regular fa-clock"></i> ${car.posted || 'Recent'}</div>
                    </div>
                </div>
            `;
            carGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        renderPagination(displayKeys.length);
    }

    function renderPagination(totalItems: number): void {
        const pageNumbersContainer = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPageBtn') as HTMLButtonElement | null;
        const nextBtn = document.getElementById('nextPageBtn') as HTMLButtonElement | null;

        if (!pageNumbersContainer) return;

        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        pageNumbersContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('div');
            btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i.toString();
            btn.onclick = () => {
                currentPage = i;
                renderCars(currentPage);
                document.querySelector('.inventory-section')?.scrollIntoView({ behavior: 'smooth' });
            };
            pageNumbersContainer.appendChild(btn);
        }

        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderCars(currentPage); } };
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages || totalPages === 0;
            nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderCars(currentPage); } };
        }
    }

    function applyFilters(): void {
        const activeVehicleTypes: string[] = [];
        const activeCategories: string[] = [];
        const topSearchInput = document.querySelector('.nav-search input') as HTMLInputElement | null;
        const brandSearch = (brandSearchInput?.value || topSearchInput?.value || '').toLowerCase().trim();
        const minPrice = parseInt(minPriceInput?.value) || 0;
        const maxPrice = parseInt(maxPriceInput?.value) || Infinity;

        filterLists.forEach(list => {
            const groupTitle = list.closest('.filter-group')?.querySelector('.filter-group-title')?.textContent?.toUpperCase() ?? '';
            list.querySelectorAll<HTMLElement>('li.active').forEach(li => {
                const text = li.textContent?.trim().toLowerCase() ?? '';
                if (groupTitle.includes('VEHICLE TYPE')) activeVehicleTypes.push(text);
                else if (groupTitle.includes('CATEGORY')) activeCategories.push(text);
            });
        });

        const allKeys = Object.keys(carData) as CarId[];
        carKeys = allKeys.filter(id => {
            const car = carData[id];
            const matchesSearch = !brandSearch || car.brand.toLowerCase().includes(brandSearch) || car.name.toLowerCase().includes(brandSearch);
            
            let matchesType = true;
            if (activeVehicleTypes.length > 0) {
                matchesType = activeVehicleTypes.some(vt => (car.type || '').toLowerCase().includes(vt) || car.brand.toLowerCase().includes(vt) || car.name.toLowerCase().includes(vt));
            }

            let matchesCat = true;
            if (activeCategories.length > 0) {
                const badge = getBadgeHtml(id).toLowerCase();
                matchesCat = activeCategories.some(cat => badge.includes(cat));
            }

            const numericPrice = parseInt(car.price.replace(/[^0-9]/g, '')) || 0;
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
    brandSearchInput?.addEventListener('input', applyFilters);
    minPriceInput?.addEventListener('input', applyFilters);
    maxPriceInput?.addEventListener('input', applyFilters);

    const topSearch = document.querySelector('.nav-search input') as HTMLInputElement | null;
    if (topSearch) {
        topSearch.addEventListener('input', () => {
            document.querySelector('.search-bar.nav-search')?.classList.toggle('has-value', topSearch.value.length > 0);
            applyFilters();
        });
    }

    filterLists.forEach(list => {
        list.querySelectorAll<HTMLElement>('li').forEach(li => {
            li.addEventListener('click', () => { li.classList.toggle('active'); applyFilters(); });
        });
    });

    // Reset button
    document.querySelector<HTMLElement>('.filter-reset-btn')?.addEventListener('click', () => {
        filterLists.forEach(list => list.querySelectorAll('li').forEach(li => li.classList.remove('active')));
        if (brandSearchInput) brandSearchInput.value = '';
        if (topSearch) topSearch.value = '';
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        applyFilters();
    });

    // View Toggling Logic
    const carGrid = document.getElementById('carGrid');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const garageViewBtn = document.getElementById('garageViewBtn');

    if (listViewBtn && gridViewBtn && garageViewBtn && carGrid) {
        gridViewBtn.onclick = () => { currentView = 'grid'; gridViewBtn.classList.add('active'); listViewBtn.classList.remove('active'); garageViewBtn.classList.remove('active'); carGrid.classList.add('grid-view'); applyFilters(); };
        listViewBtn.onclick = () => { currentView = 'list'; listViewBtn.classList.add('active'); gridViewBtn.classList.remove('active'); garageViewBtn.classList.remove('active'); carGrid.classList.remove('grid-view'); applyFilters(); };
        garageViewBtn.onclick = () => { currentView = 'garage'; garageViewBtn.classList.add('active'); gridViewBtn.classList.remove('active'); listViewBtn.classList.remove('active'); carGrid.classList.add('grid-view'); renderCars(1); };
    }

    if (carGrid) {
        carGrid.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const favBtn = target.closest('.fav-card-btn');
            const carCard = target.closest('.car-card');

            if (favBtn) {
                e.stopPropagation();
                const carId = favBtn.getAttribute('data-id') as CarId;
                if (carId && carData[carId]) {
                    const car = carData[carId];
                    car.isFavorited = !car.isFavorited;
                    favBtn.classList.toggle('favorited', car.isFavorited);
                    updateFavoritesBadge();
                    if (currentView === 'garage') renderCars(currentPage);
                    const modalFavBtn = document.getElementById('favoriteBtn');
                    if (window.currentCarId === carId && modalFavBtn) modalFavBtn.classList.toggle('favorited', car.isFavorited);
                }
                return;
            }

            if (carCard) {
                const carId = carCard.getAttribute('data-id') as CarId;
                if (carId) openPreview(carId);
            }
        });
    }

    const inventoryFavCount = document.getElementById('inventoryFavCount');
    function updateFavoritesBadge(): void {
        if (!inventoryFavCount) return;
        let count = 0;
        for (const carId in carData) if (carData[carId as CarId]?.isFavorited) count++;
        inventoryFavCount.textContent = count.toString();
    }
    updateFavoritesBadge();

    // ── Notifications ──────────────────────────────────────────────
    const navNotifBtn = document.getElementById('navNotifBtn');
    const notifModal = document.getElementById('notifModal');
    const notifList = document.getElementById('notifList');
    const notifBadge = document.getElementById('notifBadge');

    function renderNotifs(): void {
        if (!notifList) return;
        notifList.innerHTML = '<li class="notif-item"><div class="notif-content"><h4>No new notifications</h4><p>You are all caught up!</p></div></li>';
        if (notifBadge) notifBadge.style.display = 'none';
    }
    renderNotifs();

    navNotifBtn?.addEventListener('click', () => notifModal?.classList.toggle('active'));
    document.getElementById('closeNotifBtn')?.addEventListener('click', () => notifModal?.classList.remove('active'));

    // ── Previews & Modals ──────────────────────────────────────────
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const previewOverlayModal = document.getElementById('previewOverlay');
    const closePrev = () => { document.getElementById('previewModal')?.classList.remove('active'); previewOverlayModal?.classList.remove('active'); document.body.style.overflow = 'auto'; };
    closePreviewBtn?.addEventListener('click', closePrev);
    previewOverlayModal?.addEventListener('click', closePrev);

    // ── Reporting ──────────────────────────────────────────────────
    const openReportBtn = document.getElementById('openReportBtn');
    const reportModal = document.getElementById('reportModal');
    const reportOverlay = document.getElementById('reportOverlay');
    const reportForm = document.getElementById('reportForm') as HTMLFormElement;

    openReportBtn?.addEventListener('click', () => { if (reportModal && reportOverlay) { reportModal.style.display = 'block'; reportOverlay.style.display = 'block'; document.body.style.overflow = 'hidden'; } });
    const closeReport = () => { if (reportModal && reportOverlay) { reportModal.style.display = 'none'; reportOverlay.style.display = 'none'; document.body.style.overflow = 'auto'; } };
    document.getElementById('closeReportBtn')?.addEventListener('click', closeReport);
    reportOverlay?.addEventListener('click', closeReport);

    reportForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = reportForm.querySelector('.report-submit-btn') as HTMLButtonElement;
        const original = btn.textContent;

        const email = (document.getElementById('reportEmail') as HTMLInputElement).value;
        const reasonSelect = document.getElementById('reportReason') as HTMLSelectElement;
        const reason = reasonSelect.options[reasonSelect.selectedIndex].text;
        const desc = (document.getElementById('reportIssue') as HTMLTextAreaElement).value;

        const newReport = {
            id: 'rep_' + Date.now(),
            userName: email.split('@')[0], // Use part of email as name for now
            userEmail: email,
            reason: reason,
            description: desc,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'PENDING'
        };

        const existingReports = JSON.parse(localStorage.getItem('racs_reports') || '[]');
        existingReports.push(newReport);
        localStorage.setItem('racs_reports', JSON.stringify(existingReports));

        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Sent!';
            setTimeout(() => { 
                closeReport(); 
                reportForm.reset(); 
                btn.textContent = original; 
                btn.disabled = false; 
                alert('Report submitted successfully!'); 
            }, 1000);
        }, 1000);
    });

    // ── Favorites Toggle Modal ──────────────────────────────────────
    document.getElementById('favoriteBtn')?.addEventListener('click', function() {
        const carId = window.currentCarId;
        if (!carId || !carData[carId]) return;
        const car = carData[carId];
        car.isFavorited = !car.isFavorited;
        this.classList.toggle('favorited', car.isFavorited);
        document.querySelectorAll(`.fav-card-btn[data-id="${carId}"]`).forEach(btn => btn.classList.toggle('favorited', car.isFavorited));
        updateFavoritesBadge();
        if (currentView === 'garage') renderCars(currentPage);
    });

    // ── Tabs ────────────────────────────────────────────────────────
    document.querySelectorAll('.tab-item').forEach(tab => {
        (tab as HTMLElement).onclick = () => {
            const target = (tab as HTMLElement).getAttribute('data-tab');
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            if (target === 'description') document.getElementById('description-tab')?.classList.add('active');
            else document.getElementById('other-features-tab')?.classList.add('active');
        };
    });

    // ── Inquire Button ──────────────────────────────────────────────
    document.getElementById('inquireBtnModal')?.addEventListener('click', () => {
        const carId = window.currentCarId;
        const car = carId ? carData[carId] : null;
        if (car) {
            const subject = document.getElementById('composerSubject') as HTMLInputElement;
            const message = document.getElementById('composerMessage') as HTMLTextAreaElement;
            if (subject) subject.value = `Inquiry for ${car.name}`;
            if (message) message.value = `Hi Racs Auto Deal,\n\nI am interested in the ${car.name} ${car.modelYear}.\nPrice: ${car.price}\n\nPlease contact me.`;
            document.getElementById('emailComposer')?.classList.add('active');
        }
    });

    document.getElementById('closeComposerBtn')?.addEventListener('click', () => document.getElementById('emailComposer')?.classList.remove('active'));
    document.getElementById('sendEmailBtn')?.addEventListener('click', () => { alert('Inquiry sent!'); document.getElementById('emailComposer')?.classList.remove('active'); });

    // ── Scroll & FAQs ────────────────────────────────────────────────
    const smartNav = document.querySelector('.smart-nav');
    window.addEventListener('scroll', () => smartNav?.classList.toggle('scrolled', window.scrollY > 80));
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question')?.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    });

    // ── Pre-initialization ──────────────────────────────────────────
    mergeAdminCars();
    updateFavoritesBadge();
    applyFilters();
});
