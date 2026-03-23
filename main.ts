// main.ts
export {};

// Car Data Dictionary
const carData: Record<string, any> = {
    'escape2012': {
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
        isFavorited: false
    },
    'escape2012_titanium': {
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
        isFavorited: false
    },
    'livina2023': {
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
        isFavorited: false
    },
    'civic_rs': {
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
        isFavorited: false
    },
    'mazda3_sport': {
        title: 'Mazda 3 Sport 2023',
        image: 'assets/hatchback_red.png',
        name: 'Mazda 3 Hatchback Segment',
        model: '2023',
        fuel: 'Mild Hybrid',
        price: 'Starts at P1,500,000',
        brand: 'Mazda',
        transmission: '6-Speed Automatic',
        drivetrain: 'Front-Wheel Drive',
        features: '360° View Monitor, Signature KODO Design, HUD',
        comfort: 'Burgundy Leather, Premium Bose Audio',
        isFavorited: false
    },
    'innova_v': {
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
        isFavorited: false
    }
};

// Expose openPreview to window so buttons can access it
declare global {
    interface Window {
        openPreview: (carId: string) => void;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Behavior
    const scrollBtn = document.getElementById('scrollBtn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Filter Sidebar Toggle Logic
    const filterBtn = document.querySelector('.filter-btn');
    const filterSidebar = document.getElementById('filterSidebar');
    const filterOverlay = document.getElementById('filterOverlay');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');

    function openFilter() {
        if(filterSidebar && filterOverlay) {
            filterSidebar.classList.add('active');
            filterOverlay.classList.add('active');
        }
    }

    function closeFilter() {
        if(filterSidebar && filterOverlay) {
            filterSidebar.classList.remove('active');
            filterOverlay.classList.remove('active');
        }
    }

    if(filterBtn) filterBtn.addEventListener('click', openFilter);
    if(closeFilterBtn) closeFilterBtn.addEventListener('click', closeFilter);
    if(filterOverlay) filterOverlay.addEventListener('click', closeFilter);
    if(applyFilterBtn) applyFilterBtn.addEventListener('click', closeFilter);

    // Show All Vehicles Toggle
    const showAllBtn = document.getElementById('showAllBtn');
    const hiddenVehicles = document.getElementById('hiddenVehicles');

    if (showAllBtn && hiddenVehicles) {
        showAllBtn.addEventListener('click', () => {
            if (hiddenVehicles.style.display === 'none') {
                hiddenVehicles.style.display = 'grid'; // because .car-grid is grid
                showAllBtn.innerHTML = '<i class="fa-regular fa-eye-slash"></i> <span>Hide vehicles</span>';
            } else {
                hiddenVehicles.style.display = 'none';
                showAllBtn.innerHTML = '<i class="fa-regular fa-images"></i> <span>Show all vehicles</span>';
            }
        });
    }

    // Modal logic
    const previewModal = document.getElementById('previewModal');
    const previewOverlay = document.getElementById('previewOverlay');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    
    // Favorites
    const favoriteBtn = document.getElementById('favoriteBtn');
    const favoriteIcon = document.getElementById('favoriteIcon');

    let currentCarId: string | null = null;

    window.openPreview = function(carId: string) {
        currentCarId = carId;
        const data = carData[carId];
        if(!data || !previewModal || !previewOverlay) return;
        
        const eleImg = document.getElementById('carImg') as HTMLImageElement;
        const eleTitle = document.getElementById('carTitle');
        const eleName = document.getElementById('carName');
        const eleModel = document.getElementById('carModel');
        const eleFuel = document.getElementById('carFuel');
        const elePrice = document.getElementById('carPrice');
        const eleBrand = document.getElementById('carBrand');
        const eleTrans = document.getElementById('carTransmission');
        
        const eleDrive = document.getElementById('carDrivetrain');
        const eleFeatures = document.getElementById('carFeatures');
        const eleComfort = document.getElementById('carComfort');

        if(eleImg) eleImg.src = data.image;
        if(eleTitle) eleTitle.textContent = data.title;
        if(eleName) eleName.innerHTML = '<strong>Car Name:</strong> ' + data.name;
        if(eleModel) eleModel.innerHTML = '<strong>Car Model:</strong> ' + data.model;
        if(eleFuel) eleFuel.innerHTML = '<strong>Fuel Type:</strong> ' + data.fuel;
        if(elePrice) elePrice.innerHTML = '<strong>Price:</strong> ' + data.price;
        if(eleBrand) eleBrand.innerHTML = '<strong>Brand:</strong> ' + data.brand;
        if(eleTrans) eleTrans.innerHTML = '<strong>Transmission:</strong> ' + data.transmission;

        if(eleDrive && data.drivetrain) {
            eleDrive.innerHTML = '<strong>Drivetrain:</strong> ' + data.drivetrain;
            eleDrive.style.display = 'list-item';
        } else if (eleDrive) eleDrive.style.display = 'none';

        if(eleFeatures && data.features) {
            eleFeatures.innerHTML = '<strong>Features:</strong> ' + data.features;
            eleFeatures.style.display = 'list-item';
        } else if (eleFeatures) eleFeatures.style.display = 'none';

        if(eleComfort && data.comfort) {
            eleComfort.innerHTML = '<strong>Comfort:</strong> ' + data.comfort;
            eleComfort.style.display = 'list-item';
        } else if (eleComfort) eleComfort.style.display = 'none';

        // Set favorites state on load
        if (favoriteBtn && favoriteIcon) {
            if (data.isFavorited) {
                favoriteBtn.classList.add('favorited');
                favoriteIcon.classList.remove('fa-regular');
                favoriteIcon.classList.add('fa-solid');
            } else {
                favoriteBtn.classList.remove('favorited');
                favoriteIcon.classList.remove('fa-solid');
                favoriteIcon.classList.add('fa-regular');
            }
        }

        // Show Modal
        previewModal.classList.add('active');
        previewOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // stop background scrolling
    };

    function closePreviewModal() {
        if(previewModal && previewOverlay) {
            previewModal.classList.remove('active');
            previewOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // resume background scrolling
        }
    }

    if(closePreviewBtn) closePreviewBtn.addEventListener('click', closePreviewModal);
    if(previewOverlay) previewOverlay.addEventListener('click', closePreviewModal);

    // Favorites click handling
    if (favoriteBtn && favoriteIcon) {
        favoriteBtn.addEventListener('click', () => {
            if (!currentCarId) return;

            // Toggle state in memory
            carData[currentCarId].isFavorited = !carData[currentCarId].isFavorited;
            const isFav = carData[currentCarId].isFavorited;

            // Update UI
            if (isFav) {
                favoriteBtn.classList.add('favorited');
                favoriteIcon.classList.remove('fa-regular');
                favoriteIcon.classList.add('fa-solid');
            } else {
                favoriteBtn.classList.remove('favorited');
                favoriteIcon.classList.remove('fa-solid');
                favoriteIcon.classList.add('fa-regular');
            }
        });
    }
});
