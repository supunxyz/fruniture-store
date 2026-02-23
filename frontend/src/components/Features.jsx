import React, { useEffect, useState, useRef } from 'react';
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
    const scrollRef = useRef(null);

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

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

                // Only autoscroll if there's actual overflow (mobile view)
                if (scrollWidth > clientWidth) {
                    // If we've reached the end
                    if (scrollLeft + clientWidth >= scrollWidth - 10) {
                        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        // Scroll to next snap point (about the width of one card + gap)
                        scrollRef.current.scrollBy({ left: 284, behavior: 'smooth' });
                    }
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [features]);

    return (
        <section className="container">
            <div ref={scrollRef} className="features-section">
                {features.map((item, idx) => (
                    <div key={idx} className="feature-card">
                        <div className="feature-icon-wrapper">
                            {iconMap[item.icon] || <ShoppingBag />}
                        </div>
                        <div className="feature-title">{item.title}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
