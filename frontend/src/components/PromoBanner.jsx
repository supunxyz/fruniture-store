import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck, Tag, Sparkles, Clock, Gift, BadgePercent, Zap, Star, Package } from 'lucide-react';

const ICON_MAP = {
    Truck: <Truck size={15} />,
    Tag: <Tag size={15} />,
    Sparkles: <Sparkles size={15} />,
    Clock: <Clock size={15} />,
    Gift: <Gift size={15} />,
    BadgePercent: <BadgePercent size={15} />,
    Zap: <Zap size={15} />,
    Star: <Star size={15} />,
    Package: <Package size={15} />,
};

const PromoBanner = () => {
    const [promos, setPromos] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/promos/')
            .then(res => setPromos(res.data))
            .catch(() => { }); // fail silently — banner just won't show
    }, []);

    if (promos.length === 0) return null;

    // Duplicate for seamless infinite loop
    const items = [...promos, ...promos];

    return (
        <div className="promo-banner" aria-label="Promotions and offers">
            <div className="promo-track">
                {items.map((promo, i) => (
                    <span key={i} className="promo-pill">
                        <span className="promo-icon">{ICON_MAP[promo.icon] || <Tag size={15} />}</span>
                        {promo.text}
                        <span className="promo-sep" aria-hidden="true">✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default PromoBanner;
