import React from 'react';

export type CertType = 'Participation' | 'Completion' | 'Winner' | 'Merit';

export interface CertificateData {
    recipientName: string;
    eventName: string;
    certType: CertType;
    date: string;
    issuedBy: string;
    description: string;
}

const TYPE_CONFIG: Record<CertType, { color: string; accent: string; label: string; icon: string }> = {
    Participation: { color: '#ff6a00', accent: 'rgba(255,106,0,0.12)', label: 'Certificate of Participation', icon: '📋' },
    Completion: { color: '#22c55e', accent: 'rgba(34,197,94,0.12)', label: 'Certificate of Completion', icon: '✅' },
    Winner: { color: '#f59e0b', accent: 'rgba(245,158,11,0.12)', label: 'Certificate of Excellence', icon: '🏆' },
    Merit: { color: '#3b82f6', accent: 'rgba(59,130,246,0.12)', label: 'Certificate of Merit', icon: '🌟' },
};

interface Props {
    data: CertificateData;
    certRef?: React.RefObject<HTMLDivElement>;
}

const S = {
    /* Helpers to keep inline styles terse */
    abs: (extra?: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', ...extra }),
    row: (extra?: React.CSSProperties): React.CSSProperties => ({
        display: 'flex', flexDirection: 'row', alignItems: 'center', ...extra,
    }),
    col: (extra?: React.CSSProperties): React.CSSProperties => ({
        display: 'flex', flexDirection: 'column', alignItems: 'center', ...extra,
    }),
};

const CertificateCanvas: React.FC<Props> = ({ data, certRef }) => {
    const cfg = TYPE_CONFIG[data.certType];

    const displayName = data.recipientName || 'Recipient Name';
    const displayEvent = data.eventName || 'Event Name';
    const displayDate = data.date
        ? new Date(data.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Date';

    const nameFontSize = displayName.length > 26 ? 36 : displayName.length > 18 ? 42 : 50;

    return (
        <div
            ref={certRef as React.RefObject<HTMLDivElement>}
            style={{
                width: 900,
                height: 636,
                background: 'linear-gradient(135deg,#0c0c0c 0%,#100e08 60%,#0c0c0c 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                padding: '32px 56px 28px',
                fontFamily: "Georgia,'Times New Roman',serif",
                flexShrink: 0,
            }}
        >
            {/* ── Decorative borders ── */}
            <div style={S.abs({ inset: 10, border: `1px solid ${cfg.color}45`, borderRadius: 3, pointerEvents: 'none' })} />
            <div style={S.abs({ inset: 17, border: `1px solid ${cfg.color}20`, borderRadius: 2, pointerEvents: 'none' })} />

            {/* Corner brackets */}
            {([
                { top: 10, left: 10, borderTop: `3px solid ${cfg.color}`, borderLeft: `3px solid ${cfg.color}` },
                { top: 10, right: 10, borderTop: `3px solid ${cfg.color}`, borderRight: `3px solid ${cfg.color}` },
                { bottom: 10, left: 10, borderBottom: `3px solid ${cfg.color}`, borderLeft: `3px solid ${cfg.color}` },
                { bottom: 10, right: 10, borderBottom: `3px solid ${cfg.color}`, borderRight: `3px solid ${cfg.color}` },
            ] as React.CSSProperties[]).map((pos, i) => (
                <div key={i} style={{ position: 'absolute', width: 26, height: 26, ...pos }} />
            ))}

            {/* Radial glow */}
            <div style={S.abs({
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                width: 500, height: 380,
                background: `radial-gradient(ellipse,${cfg.accent} 0%,transparent 70%)`,
                pointerEvents: 'none',
            })} />

            {/* Top accent line */}
            <div style={S.abs({
                top: 28, left: 56, right: 56, height: 1,
                background: `linear-gradient(90deg,transparent,${cfg.color},transparent)`,
            })} />
            {/* Bottom accent line */}
            <div style={S.abs({
                bottom: 28, left: 56, right: 56, height: 1,
                background: `linear-gradient(90deg,transparent,${cfg.color},transparent)`,
            })} />

            {/* ══════════ CONTENT — flex column ══════════ */}

            {/* 1. Header (logo + name) */}
            <div style={{ ...S.row({ gap: 14, marginBottom: 14 }), zIndex: 1 }}>
                <img
                    src="/CV LOGO.webp"
                    alt="Code Vimarsh"
                    style={{ width: 44, height: 44, objectFit: 'contain' }}
                    crossOrigin="anonymous"
                />
                <div style={S.col({ alignItems: 'flex-start' })}>
                    <span style={{
                        fontSize: 20, fontWeight: 800, letterSpacing: '0.06em',
                        color: '#fff', fontFamily: 'Arial,sans-serif',
                    }}>
                        CODE<span style={{ color: cfg.color }}>VIMARSH</span>
                    </span>
                    <span style={{
                        fontSize: 9, letterSpacing: '0.22em', color: '#777',
                        fontFamily: 'Arial,sans-serif', textTransform: 'uppercase', marginTop: 1,
                    }}>
                        MSU Baroda · CSE Coding Club
                    </span>
                </div>
            </div>

            {/* 2. Type badge */}
            <div style={{
                fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
                color: cfg.color, padding: '4px 18px',
                border: `1px solid ${cfg.color}50`,
                borderRadius: 20, fontFamily: 'Arial,sans-serif',
                background: cfg.accent, marginBottom: 14, zIndex: 1,
            }}>
                {cfg.label}
            </div>

            {/* 3. "This is to certify that" */}
            <div style={{
                fontSize: 13, color: '#888', fontStyle: 'italic', letterSpacing: '0.04em',
                fontFamily: 'Georgia,serif', marginBottom: 6, zIndex: 1,
            }}>
                This is to certify that
            </div>

            {/* 4. Recipient name */}
            <div style={{ zIndex: 1, textAlign: 'center', marginBottom: 4, lineHeight: 1.1 }}>
                <span style={{
                    fontSize: nameFontSize,
                    fontWeight: 700, color: '#fff',
                    letterSpacing: '0.02em',
                    fontFamily: 'Georgia,serif',
                    textShadow: `0 0 40px ${cfg.color}50`,
                }}>
                    {displayName}
                </span>
            </div>

            {/* Name underline */}
            <div style={{
                height: 2, width: 180, zIndex: 1,
                background: `linear-gradient(90deg,transparent,${cfg.color},transparent)`,
                marginBottom: 10,
            }} />

            {/* 5. Achievement description */}
            <div style={{
                fontSize: 12, color: '#999', fontStyle: 'italic', textAlign: 'center',
                fontFamily: 'Georgia,serif', lineHeight: 1.5,
                maxWidth: 600, marginBottom: 8, zIndex: 1,
            }}>
                {data.description || 'has successfully participated in and contributed to'}
            </div>

            {/* 6. Event name */}
            <div style={{
                fontSize: 22, fontWeight: 700, color: cfg.color,
                letterSpacing: '0.04em', fontFamily: 'Arial,sans-serif',
                textAlign: 'center', marginBottom: 4, zIndex: 1,
            }}>
                {displayEvent}
            </div>

            {/* 7. "Organized by" label */}
            <div style={{
                fontSize: 10, color: '#555', letterSpacing: '0.12em',
                textTransform: 'uppercase', fontFamily: 'Arial,sans-serif',
                marginBottom: 12, zIndex: 1,
            }}>
                Organized by Code Vimarsh — MSU Baroda
            </div>

            {/* 8. Footer row: date | seal | issued by */}
            <div style={{
                ...S.row({ justifyContent: 'space-between', width: '100%' }),
                zIndex: 1,
            }}>
                {/* Date */}
                <div style={S.col({ alignItems: 'center', minWidth: 130 })}>
                    <span style={{ fontSize: 13, color: '#ddd', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>
                        {displayDate}
                    </span>
                    <div style={{ height: 1, width: 110, background: '#2e2e2e', margin: '6px 0 4px' }} />
                    <span style={{ fontSize: 8, color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Arial,sans-serif' }}>
                        Date of Issue
                    </span>
                </div>

                {/* Seal */}
                <div style={{
                    width: 66, height: 66, borderRadius: '50%',
                    border: `2px solid ${cfg.color}55`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: `radial-gradient(circle,${cfg.accent},transparent)`,
                    boxShadow: `0 0 16px ${cfg.color}25`,
                }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 7, color: cfg.color, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Arial,sans-serif', marginTop: 3 }}>
                        Verified
                    </span>
                </div>

                {/* Issued by */}
                <div style={S.col({ alignItems: 'center', minWidth: 130 })}>
                    <span style={{ fontSize: 13, color: '#ddd', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>
                        {data.issuedBy || 'Code Vimarsh Team'}
                    </span>
                    <div style={{ height: 1, width: 110, background: '#2e2e2e', margin: '6px 0 4px' }} />
                    <span style={{ fontSize: 8, color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Arial,sans-serif' }}>
                        Issued By
                    </span>
                </div>
            </div>


        </div>
    );
};

export default CertificateCanvas;
