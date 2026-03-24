// main.ts — Index page logic
export {};


// ─── Types ────────────────────────────────────────────────────────────────────

interface CarEntry {
    title: string;
    image: string;
    name: string;
    model: string;
    fuel: string;
    price: string;
    brand: string;
    transmission: string;
    drivetrain?: string;
    features?: string;
    comfort?: string;
    isFavorited: boolean;
}

type CarId = string;
type CarDataDictionary = Record<CarId, CarEntry>;

// ─── Augment Window for global openPreview ────────────────────────────────────

declare global {
    interface Window {
        openPreview: (carId: CarId) => void;
    }
}

// ─── Car Data ─────────────────────────────────────────────────────────────────

const carData: CarDataDictionary = {
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

function getBadgeHtml(carId: CarId): string {
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

    // ── Scroll button ──────────────────────────────────────────────────────────
    const scrollBtn = document.getElementById('scrollBtn');
    scrollBtn?.addEventListener('click', () => {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    });

    // ── Filter Sidebar Toggle ──────────────────────────────────────────────────
    const filterBtn        = document.querySelector<HTMLElement>('.filter-btn');
    const filterSidebar    = document.getElementById('filterSidebar');
    const filterOverlay    = document.getElementById('filterOverlay');
    const closeFilterBtn   = document.getElementById('closeFilterBtn');
    const applyFilterBtn   = document.getElementById('applyFilterBtn');

    const openFilter  = (): void => { filterSidebar?.classList.add('active');    filterOverlay?.classList.add('active');    };
    const closeFilter = (): void => { filterSidebar?.classList.remove('active'); filterOverlay?.classList.remove('active'); };

    filterBtn?.addEventListener('click', openFilter);
    closeFilterBtn?.addEventListener('click', closeFilter);
    filterOverlay?.addEventListener('click', closeFilter);
    applyFilterBtn?.addEventListener('click', closeFilter);

    // ── Show All Vehicles Toggle ───────────────────────────────────────────────
    const showAllBtn      = document.getElementById('showAllBtn');
    const hiddenVehicles  = document.getElementById('hiddenVehicles');

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
    const favoritesGrid    = document.getElementById('favoritesGrid');

    function updateFavoritesUI(): void {
        if (!favoritesGrid || !favoritesSection) return;

        favoritesGrid.innerHTML = '';
        let hasFavorites = false;

        for (const carId in carData) {
            const entry = carData[carId];
            if (!entry.isFavorited) continue;

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
    const previewModal    = document.getElementById('previewModal');
    const previewOverlay  = document.getElementById('previewOverlay');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const favoriteBtn     = document.getElementById('favoriteBtn');
    const favoriteIcon    = document.getElementById('favoriteIcon');

    let currentCarId: CarId | null = null;

    window.openPreview = (carId: CarId): void => {
        currentCarId = carId;
        const entry = carData[carId];
        if (!entry || !previewModal || !previewOverlay) return;

        const eleImg   = document.getElementById('carImg')          as HTMLImageElement | null;
        const eleTitle = document.getElementById('carTitle');
        const eleName  = document.getElementById('carName');
        const eleModel = document.getElementById('carModel');
        const eleFuel  = document.getElementById('carFuel');
        const elePrice = document.getElementById('carPrice');
        const eleBrand = document.getElementById('carBrand');
        const eleTrans = document.getElementById('carTransmission');
        const eleDrive = document.getElementById('carDrivetrain');
        const eleFeat  = document.getElementById('carFeatures');
        const eleComf  = document.getElementById('carComfort');

        if (eleImg)   eleImg.src           = entry.image;
        if (eleTitle) eleTitle.textContent = entry.title;
        if (eleName)  eleName.innerHTML    = `<strong>Car Name:</strong> ${entry.name}`;
        if (eleModel) eleModel.innerHTML   = `<strong>Car Model:</strong> ${entry.model}`;
        if (eleFuel)  eleFuel.innerHTML    = `<strong>Fuel Type:</strong> ${entry.fuel}`;
        if (elePrice) elePrice.innerHTML   = `<strong>Price:</strong> ${entry.price}`;
        if (eleBrand) eleBrand.innerHTML   = `<strong>Brand:</strong> ${entry.brand}`;
        if (eleTrans) eleTrans.innerHTML   = `<strong>Transmission:</strong> ${entry.transmission}`;

        if (eleDrive) {
            if (entry.drivetrain) { eleDrive.innerHTML = `<strong>Drivetrain:</strong> ${entry.drivetrain}`; eleDrive.style.display = 'list-item'; }
            else eleDrive.style.display = 'none';
        }
        if (eleFeat) {
            if (entry.features)  { eleFeat.innerHTML = `<strong>Features:</strong> ${entry.features}`; eleFeat.style.display = 'list-item'; }
            else eleFeat.style.display = 'none';
        }
        if (eleComf) {
            if (entry.comfort)   { eleComf.innerHTML = `<strong>Comfort:</strong> ${entry.comfort}`; eleComf.style.display = 'list-item'; }
            else eleComf.style.display = 'none';
        }

        // Sync favorite button state
        if (favoriteBtn && favoriteIcon) {
            favoriteBtn.classList.toggle('favorited', entry.isFavorited);
            favoriteIcon.classList.toggle('fa-solid',   entry.isFavorited);
            favoriteIcon.classList.toggle('fa-regular', !entry.isFavorited);
        }

        previewModal.classList.add('active');
        previewOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closePreviewModal(): void {
        previewModal?.classList.remove('active');
        previewOverlay?.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closePreviewBtn?.addEventListener('click', closePreviewModal);
    previewOverlay?.addEventListener('click', closePreviewModal);

    // ── Favorite button toggle ────────────────────────────────────────────────
    if (favoriteBtn && favoriteIcon) {
        favoriteBtn.addEventListener('click', () => {
            if (!currentCarId) return;

            const entry = carData[currentCarId];
            entry.isFavorited = !entry.isFavorited;

            favoriteBtn.classList.toggle('favorited', entry.isFavorited);
            favoriteIcon.classList.toggle('fa-solid',   entry.isFavorited);
            favoriteIcon.classList.toggle('fa-regular', !entry.isFavorited);

            updateFavoritesUI();
        });
    }

    // ── Filtering (Multi-Select) ──────────────────────────────────────────────
    const carCards = document.querySelectorAll<HTMLElement>('.car-card');

    // Auto-assign data-category from title text if missing
    carCards.forEach(card => {
        if (card.getAttribute('data-category')) return;
        const title = card.querySelector('.car-title')?.textContent?.toLowerCase() ?? '';
        if      (title.includes('escape') || title.includes('innova') || title.includes('livina')) card.setAttribute('data-category', 'suv');
        else if (title.includes('civic'))   card.setAttribute('data-category', 'sedan');
        else if (title.includes('mazda'))   card.setAttribute('data-category', 'hatchback');
        else if (title.includes('mustang')) card.setAttribute('data-category', 'coupe');
    });

    const filterLists = document.querySelectorAll<HTMLElement>('.filter-list');

    function applyFilters(): void {
        const activeVehicleTypes: string[] = [];
        const activeCategories:   string[] = [];

        filterLists.forEach(list => {
            const groupHeader = list.closest('.filter-group')?.querySelector('.filter-group-title');
            if (!groupHeader) return;
            const groupTitle = groupHeader.textContent?.toUpperCase() ?? '';

            list.querySelectorAll<HTMLElement>('li.active').forEach(li => {
                const text = li.textContent?.trim().toLowerCase() ?? '';
                if (text === 'all') return;
                if (groupTitle.includes('VEHICLE TYPE')) activeVehicleTypes.push(text);
                else if (groupTitle.includes('CATEGORY')) activeCategories.push(text);
            });
        });

        // Dynamic grid title
        const gridTitle = document.getElementById('dynamicCategoryTitle');
        if (gridTitle) {
            gridTitle.textContent = activeVehicleTypes.length === 0
                ? 'All Vehicles'
                : activeVehicleTypes.map(t => t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(', ');
        }

        const showAllContainer = document.querySelector<HTMLElement>('.show-all-container');

        // Show/hide cards
        carCards.forEach(card => {
            let showType = true;
            let showCat  = true;

            if (activeVehicleTypes.length > 0) {
                const cat = card.getAttribute('data-category')?.toLowerCase();
                showType = !!(cat && activeVehicleTypes.includes(cat));
            }
            if (activeCategories.length > 0) {
                showCat = (
                    (activeCategories.includes('new')          && !!card.querySelector('.badge-new'))          ||
                    (activeCategories.includes('best deal')    && !!card.querySelector('.badge-best-deal'))    ||
                    (activeCategories.includes('most clicked') && !!card.querySelector('.badge-most-clicked'))
                );
            }

            card.style.display = showType && showCat ? 'flex' : 'none';
        });

        // Smart hidden-vehicles toggle
        if (hiddenVehicles) {
            const filtersActive = activeVehicleTypes.length > 0 || activeCategories.length > 0;
            hiddenVehicles.style.display = filtersActive ? 'grid' : 'none';
            if (showAllContainer) showAllContainer.style.display = filtersActive ? 'none' : 'flex';
        }
    }

    filterLists.forEach(list => {
        list.querySelectorAll<HTMLElement>('li').forEach(li => {
            li.addEventListener('click', function () {
                const filterText = this.textContent?.trim().toLowerCase() ?? '';

                if (filterText === 'all') {
                    list.querySelectorAll('li').forEach(el => el.classList.remove('active'));
                    this.classList.add('active');
                } else {
                    this.classList.toggle('active');

                    // Deselect "All" when a specific item is chosen
                    if (this.classList.contains('active')) {
                        Array.from(list.querySelectorAll<HTMLElement>('li')).find(el => el.textContent?.trim().toLowerCase() === 'all')?.classList.remove('active');
                    }

                    // Re-activate "All" if nothing is selected
                    if (!list.querySelector('li.active')) {
                        Array.from(list.querySelectorAll<HTMLElement>('li')).find(el => el.textContent?.trim().toLowerCase() === 'all')?.classList.add('active');
                    }
                }

                applyFilters();
            });
        });
    });

    // Reset filter button
    document.querySelector<HTMLElement>('.filter-reset-btn')?.addEventListener('click', () => {
        filterLists.forEach(list => {
            list.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            Array.from(list.querySelectorAll<HTMLElement>('li')).find(el => el.textContent?.trim().toLowerCase() === 'all')?.classList.add('active');
        });
        applyFilters();
    });

    // ── Fixed Navbar (always visible, style changes on scroll) ──────────────
    const smartNav = document.querySelector<HTMLElement>('.smart-nav');

    if (smartNav) {
        window.addEventListener('scroll', () => {
            smartNav.classList.toggle('scrolled', window.scrollY > 80);
        });
    }
});
