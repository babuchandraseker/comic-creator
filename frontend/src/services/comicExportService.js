/**
 * Comic Export Engine
 * Generates high-resolution publication-ready Comic Pages in PNG and PDF formats.
 */

/**
 * Loads an image from a URL or Base64 string safely with cross-origin handling.
 */
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      return resolve(null);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // If CORS fails for external image, try loading without crossOrigin or fallback
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => resolve(null);
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

/**
 * Helper to wrap text into multiple lines given a maximum width.
 */
function wrapText(ctx, text, maxWidth) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Draws a classic Speech Bubble with tail.
 */
function drawSpeechBubble(ctx, x, y, width, height, radius, tailPos = 'bottom-left') {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';

  // Rounded rectangle
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

  // Speech tail
  if (tailPos === 'bottom-left') {
    ctx.lineTo(x + 50, y + height);
    ctx.lineTo(x + 25, y + height + 24);
    ctx.lineTo(x + 35, y + height);
  } else {
    ctx.lineTo(x + width - 35, y + height);
    ctx.lineTo(x + width - 25, y + height + 24);
    ctx.lineTo(x + width - 50, y + height);
  }

  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 0;

  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a Thought Bubble with cloudy puffs.
 */
function drawThoughtBubble(ctx, x, y, width, height) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;

  const cx = x + width / 2;
  const cy = y + height / 2;
  const rx = width / 2;
  const ry = height / 2;

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.stroke();

  // Trail of small thought circles
  const circles = [
    { cx: x + 25, cy: y + height + 10, r: 8 },
    { cx: x + 15, cy: y + height + 24, r: 5 },
    { cx: x + 8, cy: y + height + 34, r: 3 },
  ];

  circles.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

/**
 * Draws a Shout Bubble with starburst jagged points.
 */
function drawShoutBubble(ctx, x, y, width, height) {
  ctx.save();
  ctx.fillStyle = '#fef08a'; // Light bright yellow
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;

  const points = 14;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const rx = width / 2 + 10;
  const ry = height / 2 + 10;
  const innerRx = rx * 0.8;
  const innerRy = ry * 0.8;

  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const isOuter = i % 2 === 0;
    const radiusX = isOuter ? rx : innerRx;
    const radiusY = isOuter ? ry : innerRy;
    const px = cx + Math.cos(angle) * radiusX;
    const py = cy + Math.sin(angle) * radiusY;

    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a classic yellow Narrative Caption box.
 */
function drawCaptionBox(ctx, x, y, width, height, text) {
  ctx.save();
  ctx.fillStyle = '#fef08a'; // Bright comic yellow
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 0;

  ctx.fillRect(x, y, width, height);
  ctx.shadowColor = 'transparent';
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 15px "Kalam", "Comic Sans MS", Impact, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const lines = wrapText(ctx, text.toUpperCase(), width - 20);
  lines.forEach((line, idx) => {
    ctx.fillText(line, x + 10, y + 8 + idx * 18);
  });

  ctx.restore();
}

/**
 * Master Canvas Renderer for Comic Pages
 */
export async function renderComicPageCanvas(comicData) {
  const {
    title = 'UNTITLED COMIC STORY',
    style = 'SUPERHERO',
    panels = [],
  } = comicData;

  const panelCount = panels.length || 6;

  // Standard high-resolution comic canvas dimensions (approx 1600 x 2400 @ 300DPI)
  const canvasWidth = 1600;
  const canvasHeight = panelCount > 6 ? 2600 : panelCount <= 4 ? 2000 : 2300;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // 1. Background Paper Fill
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Outer Comic Border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

  // 2. Comic Masthead (Header Banner)
  const headerHeight = 150;
  ctx.fillStyle = '#000000';
  ctx.fillRect(30, 30, canvasWidth - 60, headerHeight);

  // Masthead Logo Box
  ctx.fillStyle = '#facc15'; // Comic Yellow
  ctx.fillRect(45, 45, 120, headerHeight - 30);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(45, 45, 120, headerHeight - 30);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 36px "Bangers", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('COMIC', 105, 85);
  ctx.fillStyle = '#b91c1c';
  ctx.fillText('AI', 105, 125);

  // Title & Volume Details
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Bangers", Impact, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(title.toUpperCase(), 185, 92);

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 18px Inter, Arial, sans-serif';
  ctx.fillText(
    `ISSUE #1  •  STYLE: ${style.toUpperCase()}  •  ${panels.length} FULL PANELS  •  AI STORYBOARD EDITION`,
    185,
    130
  );

  // Issue Badge (Top Right)
  ctx.fillStyle = '#ef4444'; // Red Badge
  ctx.fillRect(canvasWidth - 170, 45, 120, headerHeight - 30);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(canvasWidth - 170, 45, 120, headerHeight - 30);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Bangers", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('#1', canvasWidth - 110, 88);
  ctx.font = 'bold 13px Inter, Arial, sans-serif';
  ctx.fillText('COLLECTOR', canvasWidth - 110, 115);

  // 3. Grid Calculation
  const margin = 40;
  const gutter = 24;
  const gridTop = headerHeight + 50;
  const gridBottom = canvasHeight - 65;
  const gridHeight = gridBottom - gridTop;
  const gridWidth = canvasWidth - margin * 2;

  let cols = 2;
  let rows = 3;

  if (panelCount <= 4) {
    cols = 2;
    rows = 2;
  } else if (panelCount === 6) {
    cols = 2;
    rows = 3;
  } else if (panelCount === 8) {
    cols = 2;
    rows = 4;
  } else {
    rows = Math.ceil(panelCount / 2);
  }

  const panelWidth = (gridWidth - (cols - 1) * gutter) / cols;
  const panelHeight = (gridHeight - (rows - 1) * gutter) / rows;

  // Pre-load all panel images concurrently
  const loadedImages = await Promise.all(
    panels.map((p) => loadImage(p.imageUrl))
  );

  // 4. Render Each Comic Panel
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];
    const col = i % cols;
    const row = Math.floor(i / cols);

    const px = margin + col * (panelWidth + gutter);
    const py = gridTop + row * (panelHeight + gutter);
    const pw = panelWidth;
    const ph = panelHeight;

    // A. Draw Panel Background / Image
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    const img = loadedImages[i];
    if (img) {
      // Draw image to fill panel with cover aspect ratio
      const imgRatio = img.width / img.height;
      const panelRatio = pw / ph;
      let renderW, renderH, offsetX, offsetY;

      if (imgRatio > panelRatio) {
        renderH = ph;
        renderW = ph * imgRatio;
        offsetX = px - (renderW - pw) / 2;
        offsetY = py;
      } else {
        renderW = pw;
        renderH = pw / imgRatio;
        offsetX = px;
        offsetY = py - (renderH - ph) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    } else {
      // Fallback placeholder gradient
      const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(px, py, pw, ph);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic bold 20px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(panel.sceneDescription || `Scene Panel #${panel.panelNumber}`, px + pw / 2, py + ph / 2);
    }
    ctx.restore();

    // B. Draw Panel Ink Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeRect(px, py, pw, ph);

    // C. Draw Panel Number Badge (Top-Left)
    ctx.fillStyle = '#facc15';
    ctx.fillRect(px, py, 38, 32);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(px, py, 38, 32);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px "Bangers", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${panel.panelNumber || i + 1}`, px + 19, py + 17);

    // D. Draw Narrative Caption (if available)
    if (panel.caption && panel.caption.trim()) {
      const capWidth = Math.min(pw * 0.75, 340);
      const capLines = wrapText(ctx, panel.caption.toUpperCase(), capWidth - 20);
      const capHeight = 16 + capLines.length * 18;
      drawCaptionBox(ctx, px + 10, py + 40, capWidth, capHeight, panel.caption);
    }

    // E. Draw Dialogue Bubble (if available)
    if (panel.dialogue && panel.dialogue.trim()) {
      const bubbleType = panel.dialogueType || 'speech';
      const bubbleMaxWidth = Math.min(pw * 0.8, 340);

      ctx.font = 'bold 16px "Kalam", "Comic Sans MS", cursive, sans-serif';
      const diagLines = wrapText(ctx, panel.dialogue, bubbleMaxWidth - 30);
      const bubbleHeight = Math.max(50, 24 + diagLines.length * 20);
      const bubbleWidth = Math.min(bubbleMaxWidth, Math.max(160, diagLines.reduce((max, l) => Math.max(max, ctx.measureText(l).width + 36), 0)));

      // Position bubble in lower half or top-right
      const bx = px + pw - bubbleWidth - 16;
      const by = py + ph - bubbleHeight - 34;

      if (bubbleType === 'thought') {
        drawThoughtBubble(ctx, bx, by, bubbleWidth, bubbleHeight);
      } else if (bubbleType === 'shout') {
        drawShoutBubble(ctx, bx, by, bubbleWidth, bubbleHeight);
      } else {
        drawSpeechBubble(ctx, bx, by, bubbleWidth, bubbleHeight, 14, 'bottom-right');
      }

      // Draw Dialogue Text inside Bubble
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 15px "Kalam", "Comic Sans MS", cursive, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lineStartY = by + bubbleHeight / 2 - ((diagLines.length - 1) * 19) / 2;
      diagLines.forEach((line, lineIdx) => {
        ctx.fillText(line, bx + bubbleWidth / 2, lineStartY + lineIdx * 19);
      });
    }
  }

  // 5. Comic Page Footer
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    'COMICAI PUBLISHING  •  STORY-TO-COMIC AI ENGINE  •  CHARACTER BIBLE CONSISTENCY ENFORCED',
    canvasWidth / 2,
    canvasHeight - 35
  );

  return canvas;
}

/**
 * Downloads the comic page as a high-resolution PNG image.
 */
export async function exportToPng(comicData, customFilename) {
  const canvas = await renderComicPageCanvas(comicData);
  const title = (comicData.title || 'comic').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = customFilename || `${title}_comic_page.png`;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve(true);
    }, 'image/png');
  });
}

/**
 * Downloads the comic page as a standard, print-ready PDF document.
 * Encodes the rendered canvas into a standard RFC PDF 1.4 file with zero external dependencies.
 */
export async function exportToPdf(comicData, customFilename) {
  const canvas = await renderComicPageCanvas(comicData);
  const title = (comicData.title || 'comic').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = customFilename || `${title}_comic_page.pdf`;

  // Convert canvas to JPEG data for high-compression, crystal-clear PDF embedding
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const base64Data = jpegDataUrl.split(',')[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // PDF Dimensions (Standard A4 / Letter in Points: 72 points per inch)
  const pdfWidth = 595.28; // Standard A4 width in pt
  const pdfHeight = (canvas.height / canvas.width) * pdfWidth;

  // Build standard PDF 1.4 document stream
  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';

  // Object 1: Catalog
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

  // Object 2: Pages
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';

  // Object 3: Page
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfWidth.toFixed(2)} ${pdfHeight.toFixed(2)}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`;

  // Object 4: Content Stream (Paints image over full page)
  const contentStream = `q\n${pdfWidth.toFixed(2)} 0 0 ${pdfHeight.toFixed(2)} 0 0 cm\n/Im1 Do\nQ\n`;
  const obj4 = `4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`;

  // Object 5: Image XObject Header
  const obj5Header = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`;
  const obj5Footer = '\nendstream\nendobj\n';

  // Combine binary parts
  const enc = new TextEncoder();
  const partHeader = enc.encode(header + obj1 + obj2 + obj3 + obj4 + obj5Header);
  const partFooter = enc.encode(obj5Footer);

  // Calculate offsets for xref table
  const offset1 = header.length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offset5 = offset4 + obj4.length;

  const totalBeforeXref = partHeader.length + bytes.length + partFooter.length;

  const padOffset = (n) => n.toString().padStart(10, '0');
  const xref =
    `xref\n0 6\n0000000000 65535 f \n${padOffset(offset1)} 00000 n \n${padOffset(offset2)} 00000 n \n${padOffset(offset3)} 00000 n \n${padOffset(offset4)} 00000 n \n${padOffset(offset5)} 00000 n \n` +
    `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${totalBeforeXref}\n%%EOF\n`;

  const partXref = enc.encode(xref);

  // Merge into single Blob
  const pdfBlob = new Blob([partHeader, bytes, partFooter, partXref], {
    type: 'application/pdf',
  });

  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return true;
}
