import React from 'react';

const CustomerReviews: React.FC = () => {
    const reviews = [
        {
            id: 1,
            name: "Mark T.",
            role: "Purchased Ford Escape 2012",
            rating: 5,
            text: "Racs Auto Deal completely changed how I buy cars. The process was straightforward, and the condition of the car was exactly as described. Premium service all the way!",
            image: "/assets/review 1.jpeg"
        },
        {
            id: 2,
            name: "Sarah Jenkins",
            role: "Purchased Nissan Livina 2023",
            rating: 5,
            text: "Incredible attention to detail. The team was highly professional and made sure all my questions were answered. I love my new Nissan!",
            image: "/assets/review 2.jpg"
        },
        {
            id: 3,
            name: "David R.",
            role: "Purchased Tesla Model S",
            rating: 5,
            text: "The smoothest transaction I've ever had at a dealership. Fair pricing and transparent history. Would highly recommend Racs Auto Deal to anyone looking for premium vehicles.",
            image: "/assets/review 3.jpg"
        }
    ];

    return (
        <section
            className="customer-reviews-section"
            style={{
                padding: '7rem 2rem 5rem',
                backgroundColor: '#0B0B0D',
                borderTop: '1px solid #2A2A2E',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <p style={{
                        color: '#6C757D',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        marginBottom: '1rem',
                    }}>Customer Testimonials</p>
                    <h2 style={{ fontSize: '2.6rem', fontWeight: '800', marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '-1px' }}>
                        What Our <span style={{ color: '#E63946' }}>Clients Say</span>
                    </h2>
                    <p style={{ color: '#B0B0B0', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto', lineHeight: '1.7' }}>
                        Don't just take our word for it. Read testimonials from our growing list of satisfied customers.
                    </p>
                </div>

                {/* Cards */}
                <div
                    className="reviews-grid"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '60px' }}
                >
                    {reviews.map(review => (
                        <div
                            key={review.id}
                            className="review-card"
                            style={{
                                backgroundColor: '#1A1A1D',
                                padding: '5rem 2rem 2rem 2rem',
                                borderRadius: '18px',
                                border: '1px solid #2A2A2E',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: '1rem',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                                position: 'relative',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 16px 40px rgba(230, 57, 70, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(230, 57, 70, 0.30)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
                                e.currentTarget.style.borderColor = '#2A2A2E';
                            }}
                        >
                            {/* Avatar */}
                            <div style={{ position: 'absolute', top: '-52px', left: '50%', transform: 'translateX(-50%)' }}>
                                <img
                                    src={review.image}
                                    alt={review.name}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid #1A1A1D',
                                        outline: '3px solid #E63946',
                                        boxShadow: '0 0 20px rgba(230, 57, 70, 0.40)',
                                    }}
                                />
                            </div>

                            {/* Stars */}
                            <div style={{ color: '#F4A261', fontSize: '1.1rem', display: 'flex', gap: '4px', marginTop: '8px' }}>
                                {[...Array(review.rating)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                            </div>

                            {/* Review Text */}
                            <p style={{ fontStyle: 'italic', color: '#B0B0B0', lineHeight: '1.75', flexGrow: 1, fontSize: '0.97rem' }}>
                                "{review.text}"
                            </p>

                            {/* Author */}
                            <div style={{
                                marginTop: '1rem',
                                borderTop: '1px solid #2A2A2E',
                                paddingTop: '1rem',
                                width: '100%',
                            }}>
                                <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.05rem', color: '#FFFFFF' }}>
                                    {review.name}
                                </h4>
                                <span style={{ color: '#6C757D', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>
                                    {review.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomerReviews;
