import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

import Footer from '../components/Footer';

const ContactUs = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('sent');
            e.target.reset();
        }, 1500);
    };

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh', paddingBottom: '0' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Get in Touch</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Have a question about our products, shipping, or need interior design advice? We're here to help!
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    {/* Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ background: 'var(--card-bg)', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'start', gap: '20px' }}>
                            <div style={{ background: 'var(--primary-teal-light)', padding: '16px', borderRadius: '50%', color: 'white' }}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '8px' }}>Our Location</h3>
                                <p style={{ color: 'var(--text-muted)' }}>123 Furniture Avenue<br />Design District, NY 10001</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'start', gap: '20px' }}>
                            <div style={{ background: 'var(--primary-teal-light)', padding: '16px', borderRadius: '50%', color: 'white' }}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '8px' }}>Phone Number</h3>
                                <p style={{ color: 'var(--text-muted)' }}>+1 (555) 123-4567<br />Mon-Fri, 9am - 6pm EST</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'start', gap: '20px' }}>
                            <div style={{ background: 'var(--primary-teal-light)', padding: '16px', borderRadius: '50%', color: 'white' }}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '8px' }}>Email Address</h3>
                                <p style={{ color: 'var(--text-muted)' }}>hello@furnish.store<br />support@furnish.store</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '24px' }}>Send a Message</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '0.9rem' }}>First Name</label>
                                    <input type="text" required style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-light)' }} placeholder="John" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '0.9rem' }}>Last Name</label>
                                    <input type="text" required style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-light)' }} placeholder="Doe" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
                                <input type="email" required style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-light)' }} placeholder="john@example.com" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '0.9rem' }}>Message</label>
                                <textarea required rows="5" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-light)', resize: 'vertical' }} placeholder="How can we help you?"></textarea>
                            </div>

                            <button type="submit" disabled={status === 'sending'} style={{ background: 'var(--primary-teal)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.3s' }}>
                                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : <><Send size={20} /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
