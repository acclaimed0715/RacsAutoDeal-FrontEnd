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
        <section className="customer-reviews-section">
            <div className="customer-reviews-container">
                {/* Heading */}
                <div className="reviews-header">
                    <p className="section-subtitle">Customer Testimonials</p>
                    <h2 className="section-title">
                        What Our <span className="text-primary">Clients Say</span>
                    </h2>
                    <p className="reviews-desc">
                        Don't just take our word for it. Read testimonials from our growing list of satisfied customers.
                    </p>
                </div>

                {/* Cards */}
                <div className="reviews-grid">
                    {reviews.map(review => (
                        <div
                            key={review.id}
                            className="review-card-item"
                        >
                            {/* Avatar */}
                            <div className="review-avatar-wrapper">
                                <img
                                    src={review.image}
                                    alt={review.name}
                                    className="review-avatar-img"
                                />
                            </div>

                            {/* Stars */}
                            <div className="review-stars">
                                {[...Array(review.rating)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                            </div>

                            {/* Review Text */}
                            <p className="review-text-content">
                                "{review.text}"
                            </p>

                            {/* Author */}
                            <div className="review-author-info">
                                <h4>{review.name}</h4>
                                <span>{review.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomerReviews;
