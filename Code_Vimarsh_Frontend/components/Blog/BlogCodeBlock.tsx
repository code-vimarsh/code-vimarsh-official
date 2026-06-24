import React from 'react';
import { ORANGE, BORDER_DIM } from './theme';

const KW: Record<string, string[]> = {
    python: ['def', 'return', 'if', 'in', 'print', 'import', 'class', 'for', 'else', 'not'],
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'try', 'catch', 'async', 'await', 'else'],
    bash: ['git', 'src'],
    css: ['display', 'grid', 'flex', 'gap', 'align-items', 'justify-content', 'repeat', 'minmax'],
};

function hl(code: string, lang: string): React.ReactNode[] {
    const kws = KW[lang] ?? [];
    return code.split('\n').map((line, li) => {
        const ci = (() => { const a = line.indexOf('#'), b = line.indexOf('//'); const v = [a, b].filter(x => x >= 0); return v.length ? Math.min(...v) : -1; })();
        const raw = ci >= 0 ? line.slice(0, ci) : line;
        const tail = ci >= 0 ? line.slice(ci) : '';
        const nodes: React.ReactNode[] = [];
        const rStr = /(".*?"|'.*?'|`.*?`)/g;
        let last = 0, m: RegExpExecArray | null;
        while ((m = rStr.exec(raw)) !== null) {
            nodes.push(...tok(raw.slice(last, m.index), kws, `${li}${last}`));
            nodes.push(<span key={`s${li}${m.index}`} style={{ color: '#86efac' }}>{m[0]}</span>);
            last = m.index + m[0].length;
        }
        nodes.push(...tok(raw.slice(last), kws, `${li}e`));
        if (tail) nodes.push(<span key={`c${li}`} style={{ color: '#374151', fontStyle: 'italic' }}>{tail}</span>);
        return <div key={li}>{nodes.length ? nodes : '\u00a0'}</div>;
    });
}

function tok(text: string, kws: string[], pfx: string): React.ReactNode[] {
    const out: React.ReactNode[] = [], re = /(\w+)/g; let last = 0, m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) out.push(<span key={`${pfx}g${last}`}>{text.slice(last, m.index)}</span>);
        const w = m[0];
        const c = kws.includes(w) ? '#fb923c' : /^\d+$/.test(w) ? '#f97316' : '#e2e8f0';
        out.push(<span key={`${pfx}w${m.index}`} style={{ color: c }}>{w}</span>);
        last = m.index + w.length;
    }
    if (last < text.length) out.push(<span key={`${pfx}r`}>{text.slice(last)}</span>);
    return out;
}

export const BlogCodeBlock: React.FC<{ text: string; language: string }> = ({ text, language }) => (
    <div style={{ background: '#060608', border: `1px solid ${BORDER_DIM}`, borderRadius: 8, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px', background: 'rgba(255,106,0,0.05)', borderBottom: `1px solid ${BORDER_DIM}` }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: ORANGE, letterSpacing: '0.12em' }}>{language}</span>
            <div style={{ display: 'flex', gap: 5 }}>{['#ef4444', '#facc15', '#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}</div>
        </div>
        <pre style={{ margin: 0, padding: '14px 16px', fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, lineHeight: 1.7, overflowX: 'auto' }}>
            <code>{hl(text, language)}</code>
        </pre>
    </div>
);
