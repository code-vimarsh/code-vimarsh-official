/**
 * CheckInScanner.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin component for event check-in with QR code scanning and registration
 * management. Includes:
 *  • Live camera QR scanner using html5-qrcode
 *  • Registrations table with search, status badges, and attendance toggle
 *  • CSV/Excel export of all registrations
 *  • Manual check-in via ticket ID input
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera, CameraOff, Search, Download, CheckCircle, XCircle,
  Users, UserCheck, ArrowLeft, RefreshCw, X, Hash
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalContext';
import api from '../../services/api';
import type { EventType, Participant } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckInScannerProps {
  event: EventType;
  onBack: () => void;
}

interface ScanResult {
  type: 'success' | 'warning' | 'error';
  message: string;
  name?: string;
  email?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CheckInScanner: React.FC<CheckInScannerProps> = ({ event, onBack }) => {
  const { participants, updateParticipantStatus } = useGlobalState();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [manualId, setManualId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(false);
  const [localParticipants, setLocalParticipants] = useState<Participant[]>([]);
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter participants for this event
  useEffect(() => {
    setLocalParticipants(participants.filter(p => p.eventId === event.id));
  }, [participants, event.id]);

  // Refresh registrations from server
  const refreshRegistrations = useCallback(async () => {
    try {
      const res = await api.get('/events/registrations');
      if (res.data.success) {
        const saved = localStorage.getItem('cv_participant_statuses');
        const localMap = saved ? JSON.parse(saved) : {};

        const all = res.data.registrations
          .filter((r: any) => r.event_id === event.id)
          .map((r: any) => ({
            id: r.id,
            name: r.full_name,
            email: r.email,
            eventId: r.event_id,
            eventTitle: r.event?.title || event.title,
            registeredAt: new Date(r.registered_at).toISOString().split('T')[0],
            status: localMap[r.id] || r.status || 'Registered',
            whatsapp_number: r.whatsapp_number || '',
            github_username: r.github_username || '',
            experience_level: r.experience_level || '',
          }));
        setLocalParticipants(all);
      }
    } catch (err) {
      console.error('Failed to refresh registrations:', err);
    }
  }, [event.id, event.title]);

  // Start scanner
  const startScanner = async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-scanner-viewport');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText: string) => {
          // Pause scanning while processing
          await scanner.pause();
          await handleCheckIn(decodedText.trim());
          // Resume after 2 seconds
          setTimeout(() => {
            try { scanner.resume(); } catch {}
          }, 2000);
        },
        () => {} // ignore errors during scanning
      );

      setScanning(true);
    } catch (err: any) {
      console.error('Scanner error:', err);
      setScanResult({
        type: 'error',
        message: err?.message?.includes('NotAllowedError')
          ? 'Camera permission denied. Please allow camera access.'
          : `Failed to start scanner: ${err?.message || 'Unknown error'}`,
      });
    }
  };

  // Stop scanner
  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {}
    setScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  // Handle check-in client-side
  const handleCheckIn = async (registrationId: string) => {
    if (!registrationId || processing) return;
    setProcessing(true);
    setScanResult(null);

    // Give a very small artificial delay for visual feedback
    await new Promise(r => setTimeout(r, 300));

    const participant = localParticipants.find(p => p.id === registrationId);

    if (!participant) {
      setScanResult({
        type: 'error',
        message: 'Invalid ticket. Registration not found for this event.',
      });
      setProcessing(false);
      setManualId('');
      return;
    }

    if (participant.status === 'Attended') {
      setScanResult({
        type: 'warning',
        message: 'This participant was already checked in.',
        name: participant.name,
        email: participant.email,
      });
    } else {
      // Mark as Attended
      updateParticipantStatus(registrationId, 'Attended');
      setScanResult({
        type: 'success',
        message: 'Check-in successful!',
        name: participant.name,
        email: participant.email,
      });
    }
    setProcessing(false);
    setManualId('');
  };

  // Manual status toggle
  const toggleStatus = (participant: Participant) => {
    const newStatus = participant.status === 'Attended' ? 'Registered' : 'Attended';
    updateParticipantStatus(participant.id, newStatus);
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ['Name', 'Email', 'WhatsApp', 'GitHub', 'Experience', 'Status', 'Registered At'];
    const rows = localParticipants.map(p => [
      p.name,
      p.email,
      p.whatsapp_number || '',
      p.github_username || '',
      p.experience_level || '',
      p.status,
      p.registeredAt,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, '_')}_registrations.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered participants
  const filtered = localParticipants.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRegistered = localParticipants.length;
  const totalAttended = localParticipants.filter(p => p.status === 'Attended').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { stopScanner(); onBack(); }}
            className="p-2 bg-surfaceLight/30 hover:bg-surfaceLight/60 rounded-xl text-textMuted hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{event.title}</h2>
            <p className="text-sm text-textMuted mt-0.5">Registrations & Check-In Scanner</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refreshRegistrations} className="p-2 bg-surfaceLight/30 hover:bg-surfaceLight/60 rounded-xl text-textMuted hover:text-white transition-colors" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-surfaceLight/30 hover:bg-surfaceLight/60 rounded-xl text-sm text-textMuted hover:text-white transition-colors border border-surfaceLight">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalRegistered}</p>
              <p className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Registered</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <UserCheck size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalAttended}</p>
              <p className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Attended</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-surfaceLight rounded-2xl p-5 relative overflow-hidden col-span-2 sm:col-span-1">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Hash size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0}%</p>
              <p className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scanner & Manual Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <div className="bg-surface border border-surfaceLight rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera size={14} className="text-primary" /> QR Scanner
              </h3>
              <button
                onClick={scanning ? stopScanner : startScanner}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  scanning
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                    : 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20'
                }`}
              >
                {scanning ? <><CameraOff size={12} /> Stop</> : <><Camera size={12} /> Start Scanner</>}
              </button>
            </div>

            <div
              id="qr-scanner-viewport"
              ref={containerRef}
              className="w-full aspect-[4/3] bg-bgDark rounded-xl overflow-hidden border border-surfaceLight flex items-center justify-center"
              style={{ minHeight: 260 }}
            >
              {!scanning && (
                <div className="text-center p-6">
                  <Camera size={40} className="text-textMuted mx-auto mb-3 opacity-30" />
                  <p className="text-xs text-textMuted">Click "Start Scanner" to begin</p>
                </div>
              )}
            </div>
          </div>

          {/* Scan Result Feedback */}
          {scanResult && (
            <div className={`mx-5 mb-5 p-4 rounded-xl border ${
              scanResult.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
              scanResult.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                {scanResult.type === 'success' ? <CheckCircle size={18} className="text-green-400 mt-0.5" /> :
                 scanResult.type === 'warning' ? <CheckCircle size={18} className="text-yellow-400 mt-0.5" /> :
                 <XCircle size={18} className="text-red-400 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${
                    scanResult.type === 'success' ? 'text-green-400' :
                    scanResult.type === 'warning' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>{scanResult.message}</p>
                  {scanResult.name && (
                    <p className="text-xs text-white mt-1">{scanResult.name} · {scanResult.email}</p>
                  )}
                </div>
                <button onClick={() => setScanResult(null)} className="text-textMuted hover:text-white">
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manual Check-In */}
        <div className="bg-surface border border-surfaceLight rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Hash size={14} className="text-blue-400" /> Manual Check-In
            </h3>
            <p className="text-xs text-textMuted mb-4">
              Enter a ticket ID (registration UUID) to manually check in a participant.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualId}
                onChange={e => setManualId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCheckIn(manualId.trim())}
                placeholder="Paste registration ID here..."
                className="flex-1 bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none text-white placeholder:text-textMuted/50 transition-colors"
              />
              <button
                onClick={() => handleCheckIn(manualId.trim())}
                disabled={!manualId.trim() || processing}
                className="px-5 py-2.5 bg-primary hover:bg-secondary disabled:opacity-40 text-black font-bold rounded-xl text-sm transition-all"
              >
                {processing ? '...' : 'Check In'}
              </button>
            </div>

            {/* Quick tips */}
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-[11px] text-textMuted leading-relaxed">
                <strong className="text-primary">How it works:</strong> Each participant receives a QR code via email when they register.
                Scan the QR code or manually enter the ticket ID to mark attendance. The system will
                automatically prevent duplicate check-ins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-surface border border-surfaceLight rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-sm font-bold text-white">
              All Registrations ({localParticipants.length})
            </h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="bg-bgDark border border-surfaceLight rounded-xl pl-9 pr-4 py-2 text-xs focus:border-primary focus:outline-none text-white placeholder:text-textMuted/50 w-64 transition-colors"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <p className="text-textMuted text-sm">No registrations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] text-textMuted uppercase tracking-widest border-b border-surfaceLight">
                    <th className="px-5 py-3 font-bold">Name</th>
                    <th className="px-5 py-3 font-bold">Email</th>
                    <th className="px-5 py-3 font-bold">WhatsApp</th>
                    <th className="px-5 py-3 font-bold">Level</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Date</th>
                    <th className="px-5 py-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b border-surfaceLight/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-medium text-white whitespace-nowrap">{p.name}</td>
                      <td className="px-5 py-3 text-textMuted whitespace-nowrap">{p.email}</td>
                      <td className="px-5 py-3 text-textMuted whitespace-nowrap">{p.whatsapp_number || '—'}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-textMuted">
                          {p.experience_level || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          p.status === 'Attended'
                            ? 'bg-green-500/15 text-green-400'
                            : p.status === 'Cancelled'
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-blue-500/15 text-blue-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-textMuted whitespace-nowrap">{p.registeredAt}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => toggleStatus(p)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                            p.status === 'Attended'
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                              : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                          }`}
                        >
                          {p.status === 'Attended' ? 'Undo' : 'Mark Attended'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInScanner;
