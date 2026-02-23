import React, { useEffect, useState } from 'react';
import { ShoppingBag, Truck, HeadphonesIcon, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const iconMap = {
    ShoppingBag: <ShoppingBag />,
    Truck: <Truck />,
    Headphones: <HeadphonesIcon />,
    ShieldCheck: <ShieldCheck />,
};

const Features = () => {
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        // Fetch from FastAPI
        axios.get('http://127.0.0.1:8000/api/features')
            .then(res => setFeatures(res.data))
            .catch(err => {
                console.error('Failed to fetch features, using defaults', err);
                setFeatures([
                    { icon: 'ShoppingBag', title: 'Easy For Shopping' },
                    { icon: 'Truck', title: 'Fast & Free Shipping' },
                    { icon: 'Headphones', title: '24/7 Support' },
                    { icon: 'ShieldCheck', title: 'Money Back Guarantee' },
                ]);
            });
    }, []);

    return (
        <section className="container">
            <div className="features-section">
                {features.map((item, idx) => (
                    <div key={idx} className="feature-card">
                        <div className="feature-icon-wrapper">
                            {iconMap[item.icon] || <ShoppingBag />}
                        </div>
                        <div className="feature-title">{item.title}</div>
                    </div>
                ))}
            </div>

            <div className="cards-row">
                <div className="image-card">
                    <img src="https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=500&q=80" alt="Furniture Design Ideas" style={{ objectPosition: 'center' }} />
                </div>
                <div className="info-card">
                    <div className="tag">FURNITURE DESIGN IDEAS</div>
                    <p className="info-desc">
                        Explore furnish's curated collection of and classic contemporary pieces designed to create luxury and functional living spaces.
                    </p>
                    <button className="btn-primary">Shop Now &rarr;</button>
                </div>
            </div>
        </section>
    );
};

export default Features;
