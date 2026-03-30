import React from 'react';

const brands = [
    { name: 'Isuzu', img: '/assets/featured%20brands/Isuzu.png' },
    { name: 'Kia', img: '/assets/featured%20brands/Kia.png' },
    { name: 'Ford', img: '/assets/featured%20brands/ford.png' },
    { name: 'Geely', img: '/assets/featured%20brands/geely.png' },
    { name: 'Honda', img: '/assets/featured%20brands/honda.png' },
    { name: 'Hyundai', img: '/assets/featured%20brands/hyundai.png' },
    { name: 'Mitsubishi', img: '/assets/featured%20brands/mitsubishi.png' },
    { name: 'Nissan', img: '/assets/featured%20brands/nissan-2.png' },
    { name: 'Suzuki', img: '/assets/featured%20brands/suzuki.png' },
];

const topRow = brands.slice(0, 5);
const bottomRow = brands.slice(5, 9);

const BrandCard: React.FC<{ brand: { name: string; img: string } }> = ({ brand }) => (
    <div
        style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'default',
            height: '90px',
            width: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(230, 57, 70, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(230, 57, 70, 0.3)';
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.filter = 'brightness(1.05)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.filter = 'brightness(1)';
        }}
    >
        <img
            src={brand.img}
            alt={brand.name}
            style={{
                height: '55px',
                width: '100%',
                objectFit: 'contain',
                transition: 'all 0.4s ease',
                filter: 'brightness(1)',
            }}
        />
    </div>
);

const BrandHighlights: React.FC = () => {
    return (
        <section
            className="brand-highlights"
            style={{
                backgroundColor: '#0B0B0D',
                padding: '4rem 2rem',
                borderTop: '1px solid #2A2A2E',
                borderBottom: '1px solid #2A2A2E',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h4
                    style={{
                        color: '#6C757D',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        margin: '0 0 0.5rem 0',
                        fontWeight: '600',
                    }}
                >
                    Premium Brands We Offer
                </h4>
                <div style={{ width: '40px', height: '2px', background: 'linear-gradient(135deg, #E63946, #FF4D5A)', margin: '0 auto', borderRadius: '2px' }} />
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                    maxWidth: '960px',
                    margin: '0 auto',
                }}
            >
                {/* Top row — 5 brands */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {topRow.map((brand) => (
                        <BrandCard key={brand.name} brand={brand} />
                    ))}
                </div>

                {/* Bottom row — 4 brands, centred */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {bottomRow.map((brand) => (
                        <BrandCard key={brand.name} brand={brand} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandHighlights;
