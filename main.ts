// main.ts — Index page logic
export {};


// ─── Types ────────────────────────────────────────────────────────────────────

type CarId = string;

declare global {
    interface Window {
        openPreview: (carId: CarId) => void;
        currentCarId: CarId | null;
    }
}

interface CarEntry {
    title: string;
    images: string[];
    name: string;
    model: string;
    fuel: string;
    price: string;
    brand: string;
    transmission: string;
    description: string;
    isFavorited: boolean;
}

type CarDataDictionary = Record<CarId, CarEntry>;

// ─── Car Data ─────────────────────────────────────────────────────────────────

const carData: CarDataDictionary = {
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

// ─── Global State & Functions ──────────────────────────────────────────────────

window.currentCarId = null;

window.openPreview = (carId: CarId): void => {
    window.currentCarId = carId;
    const entry = carData[carId];
    if (!entry) return;

    const previewModal    = document.getElementById('previewModal');
    const previewOverlay  = document.getElementById('previewOverlay');
    const carouselDots    = document.getElementById('carouselDots');
    const prevBtn         = document.getElementById('prevImgBtn') as HTMLButtonElement | null;
    const nextBtn         = document.getElementById('nextImgBtn') as HTMLButtonElement | null;

    if (!previewModal || !previewOverlay) return;

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

        if (prevBtn) prevBtn.disabled = currentImgIdx === 0;
        if (nextBtn) nextBtn.disabled = currentImgIdx === images.length - 1;
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

    const eleImg   = document.getElementById('carImg') as HTMLImageElement | null;
    const eleTitle = document.getElementById('carTitle');
    const eleName  = document.getElementById('carName');
    const eleModel = document.getElementById('carModel');
    const eleFuel  = document.getElementById('carFuel');
    const elePrice = document.getElementById('carPrice');
    const eleBrand = document.getElementById('carBrand');
    const eleTrans = document.getElementById('carTransmission');
    const eleDesc = document.getElementById('carDescription');

    updateCarousel();
    if (eleTitle) eleTitle.textContent = entry.title;
    if (eleName)  eleName.innerHTML    = `<strong>Car Name:</strong> ${entry.name}`;
    if (eleModel) eleModel.innerHTML   = `<strong>Car Model:</strong> ${entry.model}`;
    if (eleFuel)  eleFuel.innerHTML    = `<strong>Fuel Type:</strong> ${entry.fuel}`;
    if (elePrice) elePrice.innerHTML   = `<strong>Price:</strong> ${entry.price}`;
    if (eleBrand) eleBrand.innerHTML   = `<strong>Brand:</strong> ${entry.brand}`;
    if (eleTrans) eleTrans.innerHTML   = `<strong>Transmission:</strong> ${entry.transmission}`;

    if (eleDesc) {
        eleDesc.innerHTML = `<strong>Description:</strong> ${entry.description}`;
    }

    // Sync favorite button state
    const favoriteBtn     = document.getElementById('favoriteBtn');
    const favoriteIcon    = document.getElementById('favoriteIcon');
    if (favoriteBtn && favoriteIcon) {
        favoriteBtn.classList.toggle('favorited', entry.isFavorited);
    }

    previewModal.classList.add('active');
    previewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

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

    // ── Favorites Logic ───────────────────────────────────────────
    const navFavBtn = document.getElementById('navFavBtn');
    const favCount = document.getElementById('favCount');
    const favModal = document.getElementById('favModal');
    const favOverlay = document.getElementById('favOverlay');
    const closeFavBtn = document.getElementById('closeFavBtn');
    const favModalBody = document.getElementById('favModalBody');

    function updateFavoritesUI(): void {
        if (!favModalBody || !favCount) return;

        favModalBody.innerHTML = '';
        let count = 0;

        for (const carId in carData) {
            const entry = carData[carId as CarId];
            if (!entry || !entry.isFavorited) continue;

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

            item.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;
                if (!target.classList.contains('remove-fav-btn')) {
                    closeFavorites();
                    window.openPreview(carId as CarId);
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
            btn.addEventListener('click', (e: Event) => {
                e.stopPropagation();
                const carId = (btn as HTMLElement).getAttribute('data-id') as CarId;
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

    const openFavorites = (): void => {
        favModal?.classList.add('active');
        favOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeFavorites = (): void => {
        favModal?.classList.remove('active');
        favOverlay?.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    navFavBtn?.addEventListener('click', openFavorites);
    closeFavBtn?.addEventListener('click', closeFavorites);
    favOverlay?.addEventListener('click', closeFavorites);

    updateFavoritesUI();

    // ── Preview Modal Actions ─────────────────────────────────────────
    const previewModal    = document.getElementById('previewModal');
    const previewOverlay  = document.getElementById('previewOverlay');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const favoriteBtn     = document.getElementById('favoriteBtn');
    const favoriteIcon    = document.getElementById('favoriteIcon');

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
            const carId = window.currentCarId;
            if (!carId) return;

            const entry = carData[carId as CarId];
            entry.isFavorited = !entry.isFavorited;

            favoriteBtn.classList.toggle('favorited', entry.isFavorited);
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
