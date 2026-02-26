import React from 'react';
import { CertificateData, CertType } from '../types';

export { type CertType, type CertificateData };

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
    abs: (extra?: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', ...extra }),
    row: (extra?: React.CSSProperties): React.CSSProperties => ({
        display: 'flex', flexDirection: 'row', alignItems: 'center', ...extra,
    }),
    col: (extra?: React.CSSProperties): React.CSSProperties => ({
        display: 'flex', flexDirection: 'column', alignItems: 'center', ...extra,
    }),
};

// Helper for hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
};

const CertificateCanvas: React.FC<Props> = ({ data, certRef }) => {
    const baseCfg = TYPE_CONFIG[data.certType];
    const template = data.templateId || 'Nexus';
    const primaryColor = data.themeColor || baseCfg.color;
    const accentColor = hexToRgba(primaryColor, 0.12);

    const displayName = data.recipientName || 'Recipient Name';
    const displayEvent = data.eventName || 'Event Name';
    const displayDate = data.date
        ? new Date(data.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Date';
    const displayIssuedBy = data.issuedBy || 'Code Vimarsh Team';

    const renderNexus = () => {
        const nameFontSize = displayName.length > 26 ? 32 : displayName.length > 18 ? 38 : 46;
        return (
            <div style={{
                width: 900, height: 636,
                background: 'linear-gradient(135deg,#0c0c0c 0%,#100e08 60%,#0c0c0c 100%)',
                position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-between', padding: '40px 60px 30px',
                fontFamily: "Inter, sans-serif", flexShrink: 0, border: `1px solid #222`,
                boxSizing: 'border-box'
            }}>
                <div style={S.abs({ inset: 10, border: `1px solid ${primaryColor}35`, borderRadius: 8, pointerEvents: 'none' })} />
                <div style={S.abs({ inset: 18, border: `1px solid ${primaryColor}15`, borderRadius: 6, pointerEvents: 'none' })} />
                {[
                    { top: 10, left: 10, borderTop: `4px solid ${primaryColor}`, borderLeft: `4px solid ${primaryColor}` },
                    { top: 10, right: 10, borderTop: `4px solid ${primaryColor}`, borderRight: `4px solid ${primaryColor}` },
                    { bottom: 10, left: 10, borderBottom: `4px solid ${primaryColor}`, borderLeft: `4px solid ${primaryColor}` },
                    { bottom: 10, right: 10, borderBottom: `4px solid ${primaryColor}`, borderRight: `4px solid ${primaryColor}` },
                ].map((pos, i) => (
                    <div key={i} style={{ position: 'absolute', width: 30, height: 30, ...pos }} />
                ))}
                <div style={S.abs({
                    top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 600, height: 400,
                    background: `radial-gradient(ellipse,${accentColor} 0%,transparent 75%)`,
                    pointerEvents: 'none',
                })} />
                <div style={S.row({ gap: 16, zIndex: 1 })}>
                    <img src="/CV LOGO.webp" alt="CV" style={{ width: 50, height: 50 }} crossOrigin="anonymous" />
                    <div style={S.col({ alignItems: 'flex-start' })}>
                        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.05em', color: '#fff', textTransform: 'uppercase' }}>CODE<span style={{ color: primaryColor }}>VIMARSH</span></span>
                        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', marginTop: 2 }}>MSU Baroda · CSE Coding Club</span>
                    </div>
                </div>
                <div style={{
                    fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                    color: primaryColor, padding: '6px 20px', border: `1px solid ${primaryColor}40`,
                    borderRadius: 30, background: accentColor, marginBottom: 10, zIndex: 1, fontWeight: 700
                }}>{baseCfg.label}</div>
                <div style={{ fontSize: 14, color: '#666', letterSpacing: '0.05em', marginBottom: 5, zIndex: 1 }}>This is to certify that</div>
                <div style={{ height: 60, display: 'flex', alignItems: 'center', zIndex: 1 }}>
                    <span style={{ fontSize: nameFontSize, fontWeight: 800, color: '#fff', textShadow: `0 0 30px ${primaryColor}40`, letterSpacing: '0.02em' }}>{displayName}</span>
                </div>
                <div style={{ height: 2, width: 220, background: `linear-gradient(90deg,transparent,${primaryColor},transparent)`, marginBottom: 15, zIndex: 1 }} />
                <div style={{ fontSize: 13, color: '#888', fontStyle: 'italic', textAlign: 'center', maxWidth: 650, marginBottom: 10, zIndex: 1 }}>
                    {data.description || 'has successfully participated in and contributed to'}
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: primaryColor, letterSpacing: '0.03em', textAlign: 'center', marginBottom: 5, zIndex: 1 }}>{displayEvent}</div>
                <div style={{ fontSize: 10, color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20, zIndex: 1 }}>Organized by Code Vimarsh — MSU Baroda</div>
                <div style={{ ...S.row({ justifyContent: 'space-between', width: '100%', padding: '0 20px' }), zIndex: 1 }}>
                    <div style={S.col({ alignItems: 'center', minWidth: 150 })}>
                        <span style={{ fontSize: 14, color: '#bbb' }}>{displayDate}</span>
                        <div style={{ height: 1, width: 120, background: '#333', margin: '8px 0 5px' }} />
                        <span style={{ fontSize: 9, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Date of Issue</span>
                    </div>
                    <div style={{ width: 70, height: 70, borderRadius: '50%', border: `2px solid ${primaryColor}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle,${accentColor},transparent)` }}>
                        <span style={{ fontSize: 24, lineHeight: 1 }}>{baseCfg.icon}</span>
                    </div>
                    <div style={S.col({ alignItems: 'center', minWidth: 150 })}>
                        <span style={{ fontSize: 14, color: '#bbb' }}>{displayIssuedBy}</span>
                        <div style={{ height: 1, width: 120, background: '#333', margin: '8px 0 5px' }} />
                        <span style={{ fontSize: 9, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Issued By</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderSignature = () => {
        const nameFontSize = displayName.length > 26 ? 34 : displayName.length > 18 ? 40 : 48;
        return (
            <div style={{
                width: 900, height: 636,
                background: '#fffef0', border: `16px solid ${primaryColor}`,
                position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-between', padding: '50px 70px 40px',
                fontFamily: "Georgia, serif", color: '#1a1a1a', flexShrink: 0,
                boxSizing: 'border-box'
            }}>
                <div style={S.abs({ inset: 4, border: `1px solid ${primaryColor}88`, pointerEvents: 'none' })} />
                <div style={S.abs({ inset: 10, border: `2px solid ${primaryColor}`, pointerEvents: 'none' })} />
                <div style={S.col({ gap: 5, zIndex: 1 })}>
                    <img src="/CV LOGO.webp" alt="CV" style={{ width: 45, height: 45, filter: 'grayscale(1) brightness(0.2)' }} crossOrigin="anonymous" />
                    <span style={{ fontSize: 12, letterSpacing: '0.3em', color: primaryColor, fontWeight: 700, textTransform: 'uppercase' }}>Official Certification</span>
                </div>
                <div style={{ zIndex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 42, fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 5 }}>{baseCfg.label}</div>
                    <div style={{ fontSize: 14, color: '#666', fontStyle: 'italic' }}>This world-class recognition is proudly presented to</div>
                </div>
                <div style={{ zIndex: 1, textAlign: 'center', margin: '15px 0' }}>
                    <span style={{ fontSize: nameFontSize, fontWeight: 400, color: '#2c2c2c', borderBottom: `2px solid ${primaryColor}`, paddingBottom: 5, display: 'inline-block', minWidth: 400 }}>{displayName}</span>
                </div>
                <div style={{ fontSize: 15, color: '#555', fontStyle: 'italic', textAlign: 'center', maxWidth: 600, zIndex: 1 }}>
                    {data.description || 'for their remarkable achievement and active participation in'}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: primaryColor, letterSpacing: '0.02em', textAlign: 'center', zIndex: 1, margin: '5px 0' }}>{displayEvent}</div>
                <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', zIndex: 1 }}>Hosted by Code Vimarsh Community</div>
                <div style={{ ...S.row({ justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }), zIndex: 1 }}>
                    <div style={S.col({ alignItems: 'center' })}>
                        <span style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{displayDate}</span>
                        <div style={{ height: 1, width: 140, background: '#2c2c2c' }} />
                        <span style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', marginTop: 5 }}>Issue Date</span>
                    </div>
                    <div style={{ width: 90, height: 90, borderRadius: '50%', background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: `2px solid ${primaryColor}88` }}>
                        <span style={{ fontSize: 32 }}>🎖️</span>
                    </div>
                    <div style={S.col({ alignItems: 'center' })}>
                        <span style={{ fontSize: 15, fontWeight: 'bold', fontStyle: 'italic', marginBottom: 5 }}>{displayIssuedBy}</span>
                        <div style={{ height: 1, width: 140, background: '#2c2c2c' }} />
                        <span style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', marginTop: 5 }}>Authorized Signatory</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderMinimal = () => {
        const nameFontSize = displayName.length > 26 ? 34 : displayName.length > 18 ? 44 : 56;
        return (
            <div style={{
                width: 900, height: 636,
                background: '#f8fafc', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', padding: '60px',
                fontFamily: "Outfit, sans-serif", color: '#0f172a', flexShrink: 0,
                boxSizing: 'border-box'
            }}>
                <div style={S.abs({ top: 0, left: 0, width: '35%', height: '100%', background: primaryColor })} />
                <div style={{ zIndex: 1, width: '28%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
                    <div style={S.col({ alignItems: 'flex-start', gap: 15 })}>
                        <img src="/CV LOGO.webp" alt="CV" style={{ width: 60, height: 60 }} crossOrigin="anonymous" />
                        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.1em' }}>CODE<span style={{ color: '#fff' }}>VIMARSH</span></span>
                    </div>
                    <div style={S.col({ alignItems: 'flex-start', gap: 5 })}>
                        <div style={{ fontSize: 10, letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>Date</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{displayDate}</div>
                    </div>
                    <div style={S.col({ alignItems: 'flex-start', gap: 5 })}>
                        <div style={{ fontSize: 10, letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>ID Number</div>
                        <div style={{ fontSize: 12, fontWeight: 500, fontFamily: 'monospace' }}>CV-CERT-{Date.now().toString().slice(-6)}</div>
                    </div>
                </div>
                <div style={{ zIndex: 1, position: 'absolute', top: 60, left: '38%', right: 60, bottom: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: primaryColor, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 }}>{baseCfg.label}</div>
                    <div style={{ fontSize: 18, color: '#64748b', marginBottom: 10 }}>Successfully Awarded to</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: 30 }}>{displayName}</div>
                    <div style={{ fontSize: 15, color: '#475569', lineHeight: 1.6, maxWidth: 450, marginBottom: 40 }}>
                        {data.description || 'Outstanding contribution and excellent performance during the session of'}
                        <strong style={{ color: '#0f172a', display: 'block', fontSize: 24, marginTop: 10 }}>{displayEvent}</strong>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 40 }}>
                        <div style={S.col({ alignItems: 'flex-start' })}>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>{displayIssuedBy}</div>
                            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Director, Code Vimarsh</div>
                        </div>
                        <div style={{ width: 60, height: 60, borderRadius: 12, border: `2px solid ${primaryColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, background: `${primaryColor}11` }}>
                            {baseCfg.icon}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAcademic = () => {
        const nameFontSize = displayName.length > 26 ? 34 : displayName.length > 18 ? 42 : 52;
        return (
            <div style={{
                width: 900, height: 636,
                background: '#fff', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0',
                fontFamily: "'Times New Roman', serif", color: primaryColor, flexShrink: 0,
                border: `30px solid ${primaryColor}`, boxSizing: 'border-box'
            }}>
                <div style={S.abs({ inset: -20, border: '1px solid #d4af37', pointerEvents: 'none' })} />
                <div style={{ width: '100%', padding: '40px 0', background: primaryColor, color: '#fff', textAlign: 'center' }}>
                    <div style={S.row({ justifyContent: 'center', gap: 15, marginBottom: 10 })}>
                        <img src="/CV LOGO.webp" style={{ width: 40, height: 40, filter: 'brightness(0) invert(1)' }} crossOrigin="anonymous" />
                        <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'Arial' }}>CODE VIMARSH ACADEMY</span>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0 80px' }}>
                    <div style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Official Transcript of Achievement</div>
                    <div style={{ fontSize: 16, fontStyle: 'italic', color: '#666', marginBottom: 5 }}>This document hereby certifies that</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 'bold', color: primaryColor, margin: '15px 0', textAlign: 'center' }}>{displayName}</div>
                    <div style={{ height: 1, width: '100%', background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`, marginBottom: 20 }} />
                    <div style={{ fontSize: 18, color: '#333', textAlign: 'center', lineHeight: 1.5 }}>
                        on this day, {displayDate}, is recognized for
                        <br />
                        <span style={{ fontSize: 24, fontWeight: 'bold', color: primaryColor, display: 'block', marginTop: 10 }}>{baseCfg.label}</span>
                    </div>
                </div>
                <div style={{ width: '100%', padding: '0 100px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
                    <div style={S.col({ alignItems: 'center' })}>
                        <div style={{ height: 1.5, width: 160, background: primaryColor }} />
                        <span style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Official Seal</span>
                    </div>
                    <div style={S.abs({ left: '50%', transform: 'translateX(-50%)', bottom: 40, zIndex: 10 })}>
                        <div style={{ width: 100, height: 100, background: primaryColor, borderRadius: '50%', border: '4px double #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 30px ${primaryColor}44` }}>
                            <div style={{ fontSize: 40 }}>{baseCfg.icon}</div>
                        </div>
                    </div>
                    <div style={S.col({ alignItems: 'center' })}>
                        <span style={{ fontSize: 16, fontWeight: 'bold', fontStyle: 'italic', marginBottom: 3 }}>{displayIssuedBy}</span>
                        <div style={{ height: 1.5, width: 160, background: primaryColor }} />
                        <span style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Member of Core Committee</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderCyber = () => {
        const nameFontSize = displayName.length > 26 ? 36 : 48;
        return (
            <div style={{
                width: 900, height: 636, background: '#050505',
                position: 'relative', overflow: 'hidden', padding: '50px',
                fontFamily: "'Orbitron', sans-serif", color: '#fff', flexShrink: 0,
                boxSizing: 'border-box'
            }}>
                <div style={S.abs({ inset: 0, opacity: 0.1, background: `repeating-linear-gradient(0deg, transparent, transparent 1px, ${primaryColor} 1px, ${primaryColor} 2px)` })} />
                <div style={S.abs({ top: 30, left: 30, right: 30, height: 2, background: `linear-gradient(90deg, ${primaryColor}, transparent)` })} />
                <div style={S.abs({ bottom: 30, right: 30, left: 30, height: 2, background: `linear-gradient(270deg, ${primaryColor}, transparent)` })} />

                <div style={S.col({ alignItems: 'flex-start', gap: 20, zIndex: 10 })}>
                    <img src="/CV LOGO.webp" style={{ width: 70, height: 70, filter: `drop-shadow(0 0 10px ${primaryColor})` }} crossOrigin="anonymous" />
                    <div>
                        <div style={{ fontSize: 12, color: primaryColor, letterSpacing: '0.4em' }}>SYSTEMS INTEGRATED PROTECTION</div>
                        <div style={{ fontSize: 32, fontWeight: 900 }}>CV_ARCHIVE v2.0</div>
                    </div>
                </div>

                <div style={{ marginTop: 60, zIndex: 10 }}>
                    <div style={{ fontSize: 14, color: primaryColor, textTransform: 'uppercase' }}>Subject Detected:</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 900, letterSpacing: '0.05em', color: '#fff', textShadow: `0 0 20px ${primaryColor}` }}>{displayName.toUpperCase()}</div>

                    <div style={{ marginTop: 40, borderLeft: `4px solid ${primaryColor}`, paddingLeft: 20 }}>
                        <div style={{ fontSize: 12, opacity: 0.6 }}>Achievement Level:</div>
                        <div style={{ fontSize: 20 }}>{baseCfg.label}</div>
                        <div style={{ fontSize: 12, marginTop: 10, opacity: 0.7 }}>Mission Data:</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: primaryColor }}>{displayEvent}</div>
                    </div>
                </div>

                <div style={S.abs({ bottom: 60, right: 60, textAlign: 'right', zIndex: 10 })}>
                    <div style={{ fontSize: 10, opacity: 0.5 }}>AUTHORITY:</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{displayIssuedBy}</div>
                    <div style={{ fontSize: 14, marginTop: 5, color: primaryColor }}>{displayDate}</div>
                </div>
            </div>
        );
    };

    const renderCreative = () => {
        const nameFontSize = displayName.length > 26 ? 38 : 52;
        return (
            <div style={{
                width: 900, height: 636, background: '#fff',
                position: 'relative', overflow: 'hidden', padding: '60px',
                fontFamily: "'Outfit', sans-serif", flexShrink: 0,
                boxSizing: 'border-box'
            }}>
                <div style={S.abs({ top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: `linear-gradient(45deg, ${primaryColor}, transparent)`, filter: 'blur(60px)' })} />
                <div style={S.abs({ bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: `linear-gradient(45deg, transparent, ${primaryColor})`, filter: 'blur(60px)' })} />

                <div style={S.row({ justifyContent: 'space-between', width: '100%', zIndex: 10 })}>
                    <img src="/CV LOGO.webp" style={{ width: 60, height: 60 }} crossOrigin="anonymous" />
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: primaryColor }}>DESIGN & FLOW</div>
                        <div style={{ fontSize: 10, color: '#666' }}>CODE VIMARSH CREATIVE</div>
                    </div>
                </div>

                <div style={{ marginTop: 80, zIndex: 10 }}>
                    <div style={{ fontSize: 16, color: '#999', marginBottom: 10 }}>This badge of honor belongs to</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 900, color: '#1a1a1a', background: `linear-gradient(to right, #1a1a1a, ${primaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{displayName}</div>

                    <div style={{ marginTop: 50 }}>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{baseCfg.label}</div>
                        <div style={{ fontSize: 16, color: '#666', marginTop: 5 }}>For exceptional creativity in</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: primaryColor, marginTop: 5 }}>{displayEvent}</div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 }}>
                    <div style={{ fontSize: 14, color: '#666' }}>{displayDate}</div>
                    <div style={{ width: 80, height: 80, borderRadius: '24px', background: `${primaryColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${primaryColor}44` }}>
                        <div style={{ fontSize: 40 }}>{baseCfg.icon}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderVintage = () => {
        const nameFontSize = displayName.length > 26 ? 36 : 50;
        return (
            <div style={{
                width: 900, height: 636, background: '#f4ecd8',
                position: 'relative', overflow: 'hidden', padding: '60px',
                fontFamily: "'Playfair Display', serif", color: '#4a3728', flexShrink: 0,
                boxSizing: 'border-box', border: '25px solid #4a3728',
            }}>
                <div style={S.abs({ inset: 5, border: '1px solid #c5a059', pointerEvents: 'none' })} />
                <div style={S.abs({ inset: 12, border: '2px solid #4a3728', pointerEvents: 'none' })} />

                {[
                    { top: 15, left: 15, borderTop: '15px solid #4a3728', borderLeft: '15px solid #4a3728' },
                    { top: 15, right: 15, borderTop: '15px solid #4a3728', borderRight: '15px solid #4a3728' },
                    { bottom: 15, left: 15, borderBottom: '15px solid #4a3728', borderLeft: '15px solid #4a3728' },
                    { bottom: 15, right: 15, borderBottom: '15px solid #4a3728', borderRight: '15px solid #4a3728' },
                ].map((pos, i) => (
                    <div key={i} style={S.abs({ width: 40, height: 40, ...pos })} />
                ))}

                <div style={S.col({ zIndex: 10 })}>
                    <img src="/CV LOGO.webp" style={{ width: 55, height: 55, filter: 'sepia(1) brightness(0.6)' }} crossOrigin="anonymous" />
                    <div style={{ fontSize: 24, fontWeight: 900, marginTop: 10, letterSpacing: '0.2em', borderBottom: '2px double #4a3728' }}>CERTIFICATE OF MERIT</div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 40, zIndex: 10 }}>
                    <div style={{ fontSize: 18, fontStyle: 'italic' }}>Know all men by these presents that</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 'bold', textDecoration: 'underline', margin: '20px 0', textDecorationColor: '#c5a059' }}>{displayName}</div>
                    <div style={{ fontSize: 18, fontStyle: 'italic' }}>hath performed with distinction in</div>
                    <div style={{ fontSize: 28, fontWeight: 'bold', marginTop: 10, color: '#4a3728' }}>{displayEvent}</div>
                </div>

                <div style={{ position: 'absolute', bottom: 70, left: 80, zIndex: 10 }}>
                    <div style={{ fontSize: 14 }}>Issued on this day:</div>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>{displayDate}</div>
                </div>

                <div style={{ position: 'absolute', bottom: 70, right: 80, zIndex: 10 }}>
                    <div style={{ width: 90, height: 90, border: '2px dashed #4a3728', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(74, 55, 40, 0.05)' }}>
                        <div style={{ fontSize: 40, opacity: 0.6 }}>{baseCfg.icon}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCorporate = () => {
        const nameFontSize = displayName.length > 26 ? 34 : 46;
        return (
            <div style={{
                width: 900, height: 636, background: '#1e293b',
                position: 'relative', overflow: 'hidden', padding: '0',
                fontFamily: "'Inter', sans-serif", color: '#f8fafc', flexShrink: 0,
                boxSizing: 'border-box'
            }}>
                <div style={S.abs({ top: 0, left: 0, width: '100%', height: 10, background: primaryColor })} />
                <div style={S.abs({ top: 0, left: 0, width: 300, height: '100%', background: 'rgba(255,255,255,0.02)' })} />

                <div style={{ padding: '60px', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                    <div style={S.row({ justifyContent: 'space-between', alignItems: 'flex-start' })}>
                        <div style={S.col({ alignItems: 'flex-start' })}>
                            <img src="/CV LOGO.webp" style={{ width: 50, height: 50 }} crossOrigin="anonymous" />
                            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 10 }}>CV GLOBAL</div>
                        </div>
                        <div style={{ border: `1px solid ${primaryColor}`, color: primaryColor, padding: '4px 12px', borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>
                            ELITE MEMBER
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                        <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: '0.2em' }}>OFFICIAL TESTIMONIAL</div>
                        <div style={{ fontSize: 42, fontWeight: 900, margin: '10px 0' }}>{baseCfg.label}</div>
                        <div style={{ fontSize: 18, color: '#94a3b8' }}>Presented to the distinguished contributor:</div>
                        <div style={{ fontSize: nameFontSize, fontWeight: 700, marginTop: 10, color: primaryColor }}>{displayName}</div>

                        <div style={{ marginTop: 40, maxWidth: 500, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>
                            {data.description || 'For professional excellence and exceptional dedication shown throughout the enterprise event of'}
                            <strong style={{ color: '#fff', marginLeft: 5 }}>{displayEvent}</strong>
                        </div>
                    </div>

                    <div style={S.row({ justifyContent: 'space-between', alignItems: 'flex-end' })}>
                        <div style={S.col({ alignItems: 'flex-start' })}>
                            <div style={{ fontSize: 10, opacity: 0.5 }}>DATE OF ISSUE</div>
                            <div style={{ fontSize: 16 }}>{displayDate}</div>
                        </div>
                        <div style={S.col({ alignItems: 'flex-end' })}>
                            <div style={{ fontSize: 10, opacity: 0.5 }}>ISSUED BY</div>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>{displayIssuedBy}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderRoyal = () => {
        const nameFontSize = displayName.length > 26 ? 38 : 54;
        return (
            <div style={{
                width: 900, height: 636, background: '#1e293b',
                position: 'relative', overflow: 'hidden', padding: '60px',
                fontFamily: "'Playfair Display', serif", color: '#fff', flexShrink: 0,
                boxSizing: 'border-box', border: '25px solid #d4af37'
            }}>
                <div style={S.abs({ inset: 5, border: '2px solid #d4af37', pointerEvents: 'none' })} />
                <div style={S.abs({ inset: 15, border: '1px solid #d4af3788', pointerEvents: 'none' })} />

                <div style={S.col({ zIndex: 10, gap: 10 })}>
                    <img src="/CV LOGO.webp" style={{ width: 60, height: 60, filter: 'drop-shadow(0 0 10px #d4af37)' }} crossOrigin="anonymous" />
                    <div style={{ fontSize: 14, letterSpacing: '0.4em', color: '#d4af37', fontWeight: 700 }}>ROYAL CERTIFICATION</div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 40, zIndex: 10 }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: '#d4af37', letterSpacing: '0.05em' }}>{baseCfg.label}</div>
                    <div style={{ fontSize: 16, fontStyle: 'italic', color: '#cbd5e1', marginTop: 10 }}>This honor is formally bestowed upon</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 'bold', margin: '20px 0', borderBottom: '2px double #d4af37', display: 'inline-block', paddingBottom: 10 }}>{displayName}</div>
                    <div style={{ fontSize: 18, color: '#cbd5e1' }}>for achieving excellence in the field of</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 10 }}>{displayEvent}</div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 }}>
                    <div style={S.col({ alignItems: 'flex-start' })}>
                        <div style={{ fontSize: 12, color: '#d4af37' }}>ISSUED BY</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{displayIssuedBy}</div>
                        <div style={{ fontSize: 14, opacity: 0.6 }}>{displayDate}</div>
                    </div>
                    <div style={{ width: 100, height: 100, background: 'radial-gradient(circle, #d4af37, #b8860b)', borderRadius: '50%', border: '4px double #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}>
                        <div style={{ fontSize: 48 }}>{baseCfg.icon}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSpace = () => {
        const nameFontSize = displayName.length > 26 ? 34 : 48;
        return (
            <div style={{
                width: 900, height: 636, background: '#020617',
                position: 'relative', overflow: 'hidden', padding: '60px',
                fontFamily: "'Orbitron', sans-serif", color: '#fff', flexShrink: 0,
                boxSizing: 'border-box'
            }}>
                <div style={S.abs({ top: '-20%', left: '-10%', width: '120%', height: '140%', background: `radial-gradient(circle at 70% 30%, ${primaryColor}22 0%, transparent 60%)`, filter: 'blur(40px)' })} />
                <div style={S.abs({ inset: 30, border: `2px solid ${primaryColor}44`, borderStyle: 'dashed', borderRadius: 20 })} />

                <div style={S.row({ justifyContent: 'space-between', width: '100%', zIndex: 10 })}>
                    <div style={S.row({ gap: 15 })}>
                        <img src="/CV LOGO.webp" style={{ width: 50, height: 50, filter: `drop-shadow(0 0 10px ${primaryColor})` }} crossOrigin="anonymous" />
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.1em' }}>CV SPACE</div>
                            <div style={{ fontSize: 10, color: primaryColor }}>GALACTIC DIVISION</div>
                        </div>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.5 }}>COORDINATES: CV-SF-${Date.now().toString().slice(-4)}</div>
                </div>

                <div style={{ marginTop: 80, zIndex: 10 }}>
                    <div style={{ fontSize: 12, color: primaryColor, letterSpacing: '0.3em' }}>AWARDED TO EXPLORER:</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 900, letterSpacing: '0.1em', marginTop: 10, textShadow: `0 0 15px ${primaryColor}` }}>{displayName.toUpperCase()}</div>

                    <div style={{ marginTop: 40, borderLeft: `5px solid ${primaryColor}`, paddingLeft: 25 }}>
                        <div style={{ fontSize: 24, fontWeight: 700 }}>{baseCfg.label}</div>
                        <div style={{ fontSize: 16, opacity: 0.7, marginTop: 5 }}>For navigating through the challenges of</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: primaryColor, marginTop: 5 }}>{displayEvent}</div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 }}>
                    <div style={{ fontSize: 14 }}>{displayDate}</div>
                    <div style={S.col({ alignItems: 'flex-end' })}>
                        <div style={{ fontSize: 10, opacity: 0.5 }}>COMMANDER</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{displayIssuedBy}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEco = () => {
        const nameFontSize = displayName.length > 26 ? 36 : 50;
        return (
            <div style={{
                width: 900, height: 636, background: '#f0f4f0',
                position: 'relative', overflow: 'hidden', padding: '60px',
                fontFamily: "'Outfit', sans-serif", color: '#164e63', flexShrink: 0,
                boxSizing: 'border-box', border: '15px solid #dcf3e7'
            }}>
                <div style={S.abs({ top: -50, right: -50, width: 250, height: 250, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', background: '#dcf3e7', opacity: 0.6 })} />
                <div style={S.abs({ bottom: -30, left: -30, width: 200, height: 200, borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%', background: '#dcf3e7', opacity: 0.6 })} />

                <div style={S.row({ justifyContent: 'center', width: '100%', zIndex: 10, marginBottom: 40 })}>
                    <img src="/CV LOGO.webp" style={{ width: 50, height: 50, filter: 'grayscale(1) brightness(0.5) opacity(0.8)' }} crossOrigin="anonymous" />
                </div>

                <div style={{ textAlign: 'center', zIndex: 10 }}>
                    <div style={{ fontSize: 12, letterSpacing: '0.4em', color: '#059669', fontWeight: 800 }}>CERTIFICATE OF GROWTH</div>
                    <div style={{ fontSize: 44, fontWeight: 900, margin: '15px 0', color: '#164e63' }}>{baseCfg.label}</div>
                    <div style={{ fontSize: 18, color: '#6b7280' }}>This acknowledges the sustainable efforts of</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 900, color: '#059669', margin: '20px 0' }}>{displayName}</div>
                    <div style={{ fontSize: 18, color: '#6b7280' }}>during the impactful sessions of</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#065f46', marginTop: 10 }}>{displayEvent}</div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ borderTop: '2px solid #059669', paddingTop: 8, minWidth: 150, textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{displayDate}</div>
                        <div style={{ fontSize: 10, opacity: 0.6 }}>DATE</div>
                    </div>
                    <div style={{ fontSize: 48 }}>🌿</div>
                    <div style={{ borderTop: '2px solid #059669', paddingTop: 8, minWidth: 150, textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{displayIssuedBy}</div>
                        <div style={{ fontSize: 10, opacity: 0.6 }}>AUTHORIZED</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGeometric = () => {
        const nameFontSize = displayName.length > 26 ? 38 : 52;
        return (
            <div style={{
                width: 900, height: 636, background: '#ffffff',
                position: 'relative', overflow: 'hidden', padding: '60px',
                fontFamily: "'Inter', sans-serif", color: '#000', flexShrink: 0,
                boxSizing: 'border-box'
            }}>
                <div style={S.abs({ top: 0, right: 0, borderTop: '200px solid #000', borderLeft: '200px solid transparent' })} />
                <div style={S.abs({ bottom: 0, left: 0, borderBottom: '150px solid ' + primaryColor, borderRight: '150px solid transparent' })} />

                <div style={{ zIndex: 10, color: '#fff', textAlign: 'right', position: 'absolute', top: 30, right: 30 }}>
                    <div style={{ fontSize: 18, fontWeight: 900 }}>CV CORE</div>
                    <div style={{ fontSize: 10, opacity: 0.8 }}>GEN-G COLLECTION</div>
                </div>

                <div style={{ marginTop: 80, zIndex: 10 }}>
                    <div style={{ height: 10, width: 100, background: primaryColor, marginBottom: 30 }} />
                    <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 0.9, marginBottom: 30 }}>{baseCfg.label.toUpperCase().split(' ')[2]}<br /><span style={{ color: primaryColor }}>AWARD</span></div>

                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>PROUDLY PRESENTED TO:</div>
                    <div style={{ fontSize: nameFontSize, fontWeight: 900, background: '#000', color: '#fff', padding: '5px 20px', display: 'inline-block' }}>{displayName}</div>

                    <div style={{ marginTop: 40 }}>
                        <div style={{ fontSize: 16, fontWeight: 500 }}>FOR EXCEPTIONAL PERFORMANCE AT</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: primaryColor }}>{displayEvent}</div>
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: 40, right: 40, textAlign: 'right', zIndex: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>VALIDATED: {displayDate}</div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>DIRECTOR {displayIssuedBy.toUpperCase()}</div>
                </div>
            </div>
        );
    };

    const renderTemplate = () => {
        switch (template) {
            case 'Signature': return renderSignature();
            case 'Minimal': return renderMinimal();
            case 'Academic': return renderAcademic();
            case 'Cyber': return renderCyber();
            case 'Creative': return renderCreative();
            case 'Vintage': return renderVintage();
            case 'Corporate': return renderCorporate();
            case 'Royal': return renderRoyal();
            case 'Space': return renderSpace();
            case 'Eco': return renderEco();
            case 'Geometric': return renderGeometric();
            default: return renderNexus();
        }
    };

    return (
        <div ref={certRef as React.RefObject<HTMLDivElement>} style={{ flexShrink: 0, width: 900, height: 636 }}>
            {renderTemplate()}
        </div>
    );
};

export default CertificateCanvas;
