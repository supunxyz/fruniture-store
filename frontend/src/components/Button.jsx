import React from 'react';

/**
 * Reusable Button component — matches the site's btn-primary pill theme.
 *
 * Props:
 *  variant   — 'primary' | 'secondary' | 'danger' | 'ghost'   (default: 'primary')
 *  size      — 'sm' | 'md' | 'lg'                              (default: 'md')
 *  icon      — any React node rendered before the label
 *  loading   — bool: shows "…" and disables the button
 *  fullWidth — bool: stretches to 100%
 *  ...rest   — any other native <button> props (onClick, type, disabled, style, …)
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon = null,
    loading = false,
    fullWidth = false,
    style = {},
    ...rest
}) => {
    const BASE = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '30px',
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: rest.disabled || loading ? 'not-allowed' : 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s, opacity 0.2s',
        width: fullWidth ? '100%' : undefined,
        opacity: rest.disabled || loading ? 0.65 : 1,
        whiteSpace: 'nowrap',
    };

    const SIZE = {
        sm: { padding: '8px 18px', fontSize: '13px' },
        md: { padding: '12px 24px', fontSize: '14px' },
        lg: { padding: '14px 32px', fontSize: '16px' },
    }[size];

    const VARIANT = {
        primary: {
            background: 'var(--primary-teal, #0c4b60)',
            color: 'white',
        },
        secondary: {
            background: 'transparent',
            color: 'var(--text-primary, #1a1a1a)',
            border: '1.5px solid var(--border-color, #e2e8f0)',
        },
        danger: {
            background: '#ef4444',
            color: 'white',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--primary-teal, #0c4b60)',
            border: '1.5px solid var(--primary-teal, #0c4b60)',
        },
    }[variant] || {};

    const HOVER_MAP = {
        primary: (e) => {
            e.currentTarget.style.background = 'var(--primary-teal-light, #0a3d4f)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(12,75,96,0.25)';
        },
        secondary: (e) => {
            e.currentTarget.style.background = 'var(--bg-light, #f1f5f9)';
        },
        danger: (e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.3)';
        },
        ghost: (e) => {
            e.currentTarget.style.background = 'var(--primary-teal, #0c4b60)';
            e.currentTarget.style.color = 'white';
        },
    };

    const LEAVE_MAP = {
        primary: (e) => {
            e.currentTarget.style.background = 'var(--primary-teal, #0c4b60)';
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
        },
        secondary: (e) => {
            e.currentTarget.style.background = 'transparent';
        },
        danger: (e) => {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
        },
        ghost: (e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--primary-teal, #0c4b60)';
        },
    };

    const combinedStyle = { ...BASE, ...SIZE, ...VARIANT, ...style };

    return (
        <button
            {...rest}
            disabled={rest.disabled || loading}
            style={combinedStyle}
            onMouseEnter={!rest.disabled && !loading ? HOVER_MAP[variant] : undefined}
            onMouseLeave={!rest.disabled && !loading ? LEAVE_MAP[variant] : undefined}
        >
            {loading ? '…' : (
                <>
                    {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
