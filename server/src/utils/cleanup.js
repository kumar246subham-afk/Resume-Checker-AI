const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Privacy & Temporary File Cleanup Utility
 * Ensures temporary parsing artifacts or abandoned OCR files are purged safely.
 */
class CleanupService {
  /**
   * Safely purge temporary files older than maxAgeMs matching specific prefixes
   * @param {string} dirPath - Directory to inspect
   * @param {string[]} allowedExtensions - File extensions eligible for cleanup
   * @param {number} maxAgeMs - Maximum allowed age in milliseconds (default: 1 hour)
   */
  static cleanOldTempFiles(dirPath, allowedExtensions = ['.tmp', '.traineddata'], maxAgeMs = 3600000) {
    if (!fs.existsSync(dirPath)) return;

    try {
      const files = fs.readdirSync(dirPath);
      const now = Date.now();

      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        // Strict guard: ONLY touch files matching allowed temporary extensions
        if (!allowedExtensions.includes(ext)) {
          continue;
        }

        const filePath = path.join(dirPath, file);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile() && (now - stats.mtimeMs) > maxAgeMs) {
            fs.unlinkSync(filePath);
            console.log(`[Privacy Cleanup] Safely removed orphaned temp file: ${file}`);
          }
        } catch (fileErr) {
          // File might have been cleaned up by another worker or process
        }
      }
    } catch (err) {
      console.warn(`[Privacy Cleanup Warning] Directory scan failed for ${dirPath}: ${err.message}`);
    }
  }

  /**
   * Start recurring background cleanup job (every 2 hours)
   */
  static initScheduledCleanup() {
    // Run an initial sweep on startup
    const serverDir = path.resolve(__dirname, '../../');
    this.cleanOldTempFiles(serverDir, ['.traineddata', '.tmp'], 7200000); // older than 2 hours

    // Interval sweep every 2 hours
    const interval = setInterval(() => {
      this.cleanOldTempFiles(serverDir, ['.traineddata', '.tmp'], 7200000);
      this.cleanOldTempFiles(os.tmpdir(), ['resume_ai_'], 3600000);
    }, 2 * 60 * 60 * 1000);

    // Prevent interval from keeping the event loop alive if everything else closes
    if (interval.unref) {
      interval.unref();
    }
  }
}

module.exports = CleanupService;
