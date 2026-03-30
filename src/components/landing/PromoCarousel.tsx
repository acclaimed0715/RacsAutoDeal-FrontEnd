import React, { useState, useEffect } from 'react';

const PROMO_SLIDES = [
    {
        tag: 'Showcase',
        title: 'Porsche 911 GT3',
        desc: 'Experience the pinnacle of performance and precision engineering.',
        btnText: 'View Details',
        img: '/assets/promo_showcase.png',
        tagClass: ''
    },
    {
        tag: 'Hot Deal',
        title: 'Seasonal Savings',
        desc: 'Get up to ₱100,000 off on selected premium SUVs this month.',
        btnText: 'Explore Deals',
        img: '/assets/promo_deals.png',
        tagClass: 'orange'
    },
    {
        tag: 'New Arrival',
        title: 'The Future Is Here',
        desc: "Discover our latest collection of 2024 luxury electric vehicles.",
        btnText: "See What's New",
        img: '/assets/promo_new.png',
        tagClass: 'blue'
    }
];

const PromoCarousel: React.FC = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % PROMO_SLIDES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="promo-section">
            <div className="promo-container">
                <div className="promo-carousel" id="promoCarousel">
                    <div 
                        className="promo-track" 
                        id="promoTrack" 
                        style={{ transform: `translateX(-${current * 100}%)`, transition: 'transform 0.5s ease-in-out' }}
                    >
                        {PROMO_SLIDES.map((slide, index) => (
                            <div key={index} className={`promo-slide ${index === current ? 'active' : ''}`}>
                                <img src={slide.img} alt={slide.title} />
                                <div className="promo-content">
                                    <span className={`promo-tag ${slide.tagClass} rev-item active`}>{slide.tag}</span>
                                    <h2 className="rev-item active">{slide.title}</h2>
                                    <p className="rev-item active">{slide.desc}</p>
                                    <a href="#carGrid" className="promo-btn rev-item active">{slide.btnText}</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="promo-nav prev" onClick={() => setCurrent((current - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length)}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="promo-nav next" onClick={() => setCurrent((current + 1) % PROMO_SLIDES.length)}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                    <div className="promo-dots" id="promoDots">
                        {PROMO_SLIDES.map((_, index) => (
                            <div 
                                key={index} 
                                className={`promo-dot-wrapper ${index === current ? 'active' : ''}`}
                                onClick={() => setCurrent(index)}
                            >
                                <span className="dot">
                                    <div className="dot-progress"></div>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoCarousel;
