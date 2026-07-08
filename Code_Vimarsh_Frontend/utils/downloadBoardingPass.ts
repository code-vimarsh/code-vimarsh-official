/**
 * Draws a boarding pass ticket onto a canvas and triggers a PNG download.
 * Replaces html2canvas with a pixel-perfect custom renderer.
 */

interface BoardingPassData {
  participantName: string;
  ticketCode: string;
  registeredAt: string;
  venue: string;
  eventType: string;
  typeAcronym: string;
  qrCodeDataUrl: string;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function downloadBoardingPass(data: BoardingPassData): Promise<void> {
  const SCALE = 2;
  const W = 520 * SCALE;
  const H = 210 * SCALE;
  const PAD = 30 * SCALE; // outer padding around the card
  const CW = W + PAD * 2;
  const CH = H + PAD * 2;
  const R = 20 * SCALE; // border-radius

  // Sections
  const QR_W = 135 * SCALE;
  const SEP_W = 16 * SCALE;
  const STRIP_W = 48 * SCALE;
  const CONTENT_W = W - QR_W - SEP_W * 2 - STRIP_W;

  const canvas = document.createElement('canvas');
  canvas.width = CW;
  canvas.height = CH;
  const ctx = canvas.getContext('2d')!;

  // ── Background (dark, matches the page) ──
  ctx.fillStyle = '#0e0e0e';
  ctx.fillRect(0, 0, CW, CH);

  // ── Card white body ──
  ctx.save();
  roundRect(ctx, PAD, PAD, W, H, R);
  ctx.clip();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(PAD, PAD, W, H);

  // ── 1. QR Section (left) ──
  const qrSectionX = PAD;
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(qrSectionX, PAD, QR_W, H);

  // QR code image
  if (data.qrCodeDataUrl) {
    const qrImg = await loadImage(data.qrCodeDataUrl);
    const qrSize = 80 * SCALE;
    const qrBorder = 2 * SCALE;
    const qrPad = 4 * SCALE;
    const qrX = qrSectionX + (QR_W - qrSize - qrBorder * 2 - qrPad * 2) / 2;
    const qrY = PAD + (H - qrSize - qrBorder * 2 - qrPad * 2 - 20 * SCALE) / 2;

    // Orange border
    ctx.fillStyle = '#ff6a00';
    roundRect(ctx, qrX, qrY, qrSize + qrBorder * 2 + qrPad * 2, qrSize + qrBorder * 2 + qrPad * 2, 8 * SCALE);
    ctx.fill();

    // White inner
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, qrX + qrBorder, qrY + qrBorder, qrSize + qrPad * 2, qrSize + qrPad * 2, 6 * SCALE);
    ctx.fill();

    // QR image
    ctx.drawImage(qrImg, qrX + qrBorder + qrPad, qrY + qrBorder + qrPad, qrSize, qrSize);

    // "SCAN TO CHECK-IN" text
    ctx.fillStyle = '#718096';
    ctx.font = `bold ${7 * SCALE}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO CHECK-IN', qrSectionX + QR_W / 2, qrY + qrSize + qrBorder * 2 + qrPad * 2 + 14 * SCALE);
  }

  // ── 2. Separator 1 ──
  const sep1X = PAD + QR_W;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(sep1X, PAD, SEP_W, H);

  // Dashed line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2 * SCALE;
  ctx.setLineDash([6 * SCALE, 4 * SCALE]);
  ctx.beginPath();
  ctx.moveTo(sep1X + SEP_W / 2, PAD + 12 * SCALE);
  ctx.lineTo(sep1X + SEP_W / 2, PAD + H - 12 * SCALE);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── 3. Main content area ──
  const contentX = sep1X + SEP_W;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(contentX, PAD, CONTENT_W, H);

  const cPadX = 16 * SCALE;
  const cPadY = 14 * SCALE;
  const cx = contentX + cPadX;
  let cy = PAD + cPadY;

  ctx.textAlign = 'left';

  // Row 1: Organizer → Event Type
  // "ORGANIZER"
  ctx.fillStyle = '#718096';
  ctx.font = `600 ${8 * SCALE}px system-ui, sans-serif`;
  ctx.fillText('ORGANIZER', cx, cy + 8 * SCALE);

  // "CVM"
  ctx.fillStyle = '#1a202c';
  ctx.font = `800 ${16 * SCALE}px system-ui, sans-serif`;
  ctx.fillText('CVM', cx, cy + 26 * SCALE);

  // "Code Vimarsh"
  ctx.fillStyle = '#4a5568';
  ctx.font = `500 ${9 * SCALE}px system-ui, sans-serif`;
  ctx.fillText('Code Vimarsh', cx, cy + 37 * SCALE);

  // Arrow →
  const arrowX = cx + CONTENT_W / 2 - cPadX;
  ctx.strokeStyle = '#a0aec0';
  ctx.lineWidth = 1.5 * SCALE;
  ctx.beginPath();
  ctx.moveTo(arrowX - 10 * SCALE, cy + 22 * SCALE);
  ctx.lineTo(arrowX + 10 * SCALE, cy + 22 * SCALE);
  ctx.moveTo(arrowX + 5 * SCALE, cy + 17 * SCALE);
  ctx.lineTo(arrowX + 10 * SCALE, cy + 22 * SCALE);
  ctx.lineTo(arrowX + 5 * SCALE, cy + 27 * SCALE);
  ctx.stroke();

  // "EVENT TYPE" (right-aligned within content area)
  const rightX = contentX + CONTENT_W - cPadX;
  ctx.textAlign = 'right';
  ctx.fillStyle = '#718096';
  ctx.font = `600 ${8 * SCALE}px system-ui, sans-serif`;
  ctx.fillText('EVENT TYPE', rightX, cy + 8 * SCALE);

  ctx.fillStyle = '#1a202c';
  ctx.font = `800 ${16 * SCALE}px system-ui, sans-serif`;
  ctx.fillText(data.typeAcronym, rightX, cy + 26 * SCALE);

  ctx.fillStyle = '#4a5568';
  ctx.font = `500 ${9 * SCALE}px system-ui, sans-serif`;
  ctx.fillText(data.eventType, rightX, cy + 37 * SCALE);

  // Divider line
  cy += 45 * SCALE;
  ctx.strokeStyle = '#edf2f7';
  ctx.lineWidth = 2 * SCALE;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(rightX, cy);
  ctx.stroke();

  // Row 2: Passenger / Candidate + Ticket ID
  cy += 10 * SCALE;
  ctx.textAlign = 'left';

  ctx.fillStyle = '#a0aec0';
  ctx.font = `600 ${8 * SCALE}px system-ui, sans-serif`;
  ctx.fillText('PASSENGER / CANDIDATE', cx, cy + 8 * SCALE);

  ctx.fillStyle = '#2d3748';
  ctx.font = `700 ${11 * SCALE}px system-ui, sans-serif`;
  ctx.fillText(data.participantName, cx, cy + 22 * SCALE);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#a0aec0';
  ctx.font = `600 ${8 * SCALE}px system-ui, sans-serif`;
  ctx.fillText('TICKET ID', rightX, cy + 8 * SCALE);

  ctx.fillStyle = '#2d3748';
  ctx.font = `700 ${11 * SCALE}px system-ui, sans-serif`;
  ctx.fillText(`#${data.ticketCode}`, rightX, cy + 22 * SCALE);

  // Row 3: Date + Venue
  cy += 30 * SCALE;
  ctx.textAlign = 'left';

  ctx.fillStyle = '#a0aec0';
  ctx.font = `600 ${8 * SCALE}px system-ui, sans-serif`;
  ctx.fillText('DATE', cx, cy + 8 * SCALE);

  ctx.fillStyle = '#2d3748';
  ctx.font = `700 ${11 * SCALE}px system-ui, sans-serif`;
  ctx.fillText(data.registeredAt, cx, cy + 22 * SCALE);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#a0aec0';
  ctx.font = `600 ${8 * SCALE}px system-ui, sans-serif`;
  ctx.fillText('VENUE', rightX, cy + 8 * SCALE);

  ctx.fillStyle = '#2d3748';
  ctx.font = `700 ${11 * SCALE}px system-ui, sans-serif`;
  // Truncate venue if too long
  const venueText = data.venue.length > 20 ? data.venue.substring(0, 18) + '…' : data.venue;
  ctx.fillText(venueText, rightX, cy + 22 * SCALE);

  // ── 4. Separator 2 ──
  const sep2X = contentX + CONTENT_W;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(sep2X, PAD, SEP_W, H);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2 * SCALE;
  ctx.setLineDash([6 * SCALE, 4 * SCALE]);
  ctx.beginPath();
  ctx.moveTo(sep2X + SEP_W / 2, PAD + 12 * SCALE);
  ctx.lineTo(sep2X + SEP_W / 2, PAD + H - 12 * SCALE);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── 5. Brand strip (right) ──
  const stripX = sep2X + SEP_W;
  // Orange gradient
  const grad = ctx.createLinearGradient(stripX, PAD, stripX + STRIP_W, PAD + H);
  grad.addColorStop(0, '#ff6a00');
  grad.addColorStop(1, '#ff4141');
  ctx.fillStyle = grad;
  ctx.fillRect(stripX, PAD, STRIP_W, H);

  // Code brackets icon < >
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5 * SCALE;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const iconCx = stripX + STRIP_W / 2;
  const iconCy = PAD + 35 * SCALE;
  // Left bracket <
  ctx.beginPath();
  ctx.moveTo(iconCx + 2 * SCALE, iconCy - 8 * SCALE);
  ctx.lineTo(iconCx - 6 * SCALE, iconCy);
  ctx.lineTo(iconCx + 2 * SCALE, iconCy + 8 * SCALE);
  ctx.stroke();
  // Right bracket >
  ctx.beginPath();
  ctx.moveTo(iconCx - 2 * SCALE + 8 * SCALE, iconCy - 8 * SCALE);
  ctx.lineTo(iconCx + 6 * SCALE + 8 * SCALE, iconCy);
  ctx.lineTo(iconCx - 2 * SCALE + 8 * SCALE, iconCy + 8 * SCALE);
  ctx.stroke();

  // "CV" text at bottom
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${16 * SCALE}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('CV', iconCx, PAD + H - 25 * SCALE);

  // Small underline under CV
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(iconCx - 7 * SCALE, PAD + H - 22 * SCALE, 14 * SCALE, 2 * SCALE);

  ctx.restore(); // End clipping

  // ── 6. Circle notches (drawn ON TOP of the card, outside clipping) ──
  const notchR = 8 * SCALE;

  // Separator 1 notches
  drawNotch(ctx, sep1X + SEP_W / 2, PAD, notchR, '#0e0e0e');           // top
  drawNotch(ctx, sep1X + SEP_W / 2, PAD + H, notchR, '#0e0e0e');       // bottom

  // Separator 2 notches
  drawNotch(ctx, sep2X + SEP_W / 2, PAD, notchR, '#0e0e0e');           // top
  drawNotch(ctx, sep2X + SEP_W / 2, PAD + H, notchR, '#0e0e0e');       // bottom

  // ── Download ──
  const link = document.createElement('a');
  link.download = `CV_Ticket_${data.participantName.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function drawNotch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
