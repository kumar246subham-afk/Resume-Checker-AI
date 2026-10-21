import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Concurrency guard to prevent simultaneous exports
 */
let isExportInProgress = false;

/**
 * Sanitize filename to ensure valid OS filesystem string
 */
export const sanitizePdfFilename = (name) => {
  if (!name || typeof name !== 'string') return 'Professional_Resume.pdf';
  const clean = name.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_');
  return clean ? `${clean}.pdf` : 'Professional_Resume.pdf';
};

/**
 * Export resume preview node to high-fidelity multi-page A4 PDF
 *
 * @param {HTMLElement|React.RefObject} targetNode - DOM element to capture
 * @param {Object} options - Export configuration
 * @param {string} options.filename - Downloaded PDF filename
 * @param {Function} [options.onProgress] - Optional progress callback
 * @returns {Promise<{ success: boolean, totalPages: number, filename: string, blob: Blob }>}
 */
export const exportResumeToPdf = async (targetNode, options = {}) => {
  if (isExportInProgress) {
    throw new Error('A PDF download is already in progress. Please wait a moment.');
  }

  isExportInProgress = true;

  // Resolve node if a React ref is passed
  const element = targetNode?.current ? targetNode.current : targetNode;

  if (!element || !(element instanceof HTMLElement)) {
    isExportInProgress = false;
    throw new Error('Resume preview element was not found in document. Please make sure the preview is visible.');
  }

  const filename = options.filename
    ? (options.filename.endsWith('.pdf') ? options.filename : `${options.filename}.pdf`)
    : 'My_Resume.pdf';

  let isolatedWrapper = null;

  try {
    if (options.onProgress) options.onProgress('Preparing fonts and layout...');

    // 1. Wait for web fonts to complete loading
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (fontErr) {
        console.warn('[PDF Export] Font ready check warning:', fontErr);
      }
    }

    // 2. Wait for any internal images to finish loading
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    if (options.onProgress) options.onProgress('Normalizing A4 dimensions...');

    // 3. Create isolated offscreen container to avoid zoom transforms, scroll clipping, or mobile display:none
    isolatedWrapper = document.createElement('div');
    isolatedWrapper.setAttribute('id', 'resume-pdf-isolated-export-root');
    Object.assign(isolatedWrapper.style, {
      position: 'fixed',
      left: '-12000px',
      top: '0px',
      width: '210mm',
      minHeight: '297mm',
      background: '#ffffff',
      zIndex: '-9999',
      margin: '0',
      padding: '0',
      boxSizing: 'border-box',
      transform: 'none',
      opacity: '1',
      pointerEvents: 'none'
    });

    // Deep clone the node into isolated container
    const clonedNode = element.cloneNode(true);
    Object.assign(clonedNode.style, {
      transform: 'none',
      margin: '0',
      padding: clonedNode.style.padding || '',
      width: '100%',
      maxWidth: '100%',
      boxShadow: 'none',
      display: 'block',
      visibility: 'visible'
    });

    isolatedWrapper.appendChild(clonedNode);
    document.body.appendChild(isolatedWrapper);

    // Give DOM a microtask tick to calculate layout
    await new Promise(resolve => setTimeout(resolve, 60));

    if (options.onProgress) options.onProgress('Rendering high-resolution canvas...');

    // 4. Capture with html2canvas at scale 2 (retina / 192 DPI crisp typography)
    const canvas = await html2canvas(clonedNode, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // Standard 210mm in pixels at 96 DPI
      scrollX: 0,
      scrollY: 0
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas render produced an empty image. Please verify resume content.');
    }

    if (options.onProgress) options.onProgress('Structuring A4 pages...');

    // 5. Multi-page A4 Pagination Calculation
    // A4 ratio: 297mm height / 210mm width = 1.4142857
    const a4Ratio = 297 / 210;
    const pageHeightInCanvasPx = Math.floor(canvas.width * a4Ratio);
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageHeightInCanvasPx));

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // 6. Draw each A4 slice onto its respective page
    for (let p = 0; p < totalPages; p++) {
      if (p > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageHeightInCanvasPx;

      const pCtx = pageCanvas.getContext('2d');
      if (pCtx) {
        // Fill page with clean white background
        pCtx.fillStyle = '#ffffff';
        pCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        const srcY = p * pageHeightInCanvasPx;
        const srcHeight = Math.min(pageHeightInCanvasPx, canvas.height - srcY);

        pCtx.drawImage(
          canvas,
          0, srcY, canvas.width, srcHeight,
          0, 0, canvas.width, srcHeight
        );

        const pageDataUrl = pageCanvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(pageDataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
    }

    if (options.onProgress) options.onProgress('Generating PDF file...');

    // 7. Output Blob and trigger native browser download
    const blob = pdf.output('blob');

    if (!blob || blob.size < 500) {
      throw new Error('Generated PDF file was empty or corrupted.');
    }

    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Revoke object URL safely after download initiates
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 15000);

    return {
      success: true,
      totalPages,
      filename,
      blob
    };
  } finally {
    isExportInProgress = false;
    // Always clean up isolated DOM node
    if (isolatedWrapper && isolatedWrapper.parentNode) {
      isolatedWrapper.parentNode.removeChild(isolatedWrapper);
    }
  }
};

/**
 * Print-ready fallback: opens native browser print dialog
 */
export const triggerPrintFallback = () => {
  window.print();
};
