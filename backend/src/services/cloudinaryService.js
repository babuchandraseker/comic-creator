import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log('☁️ Cloudinary image storage configured securely.');
} else {
  console.warn(
    '[WARNING] Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not set. Falling back to base64 Data URLs.'
  );
}

// Allowed MIME types for comic panels
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_BASE64_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export class CloudinaryService {
  /**
   * Checks if Cloudinary credentials are configured in the environment.
   * @returns {boolean}
   */
  static isConfigured() {
    return isCloudinaryConfigured;
  }

  /**
   * Validates if the image input is a safe and supported format.
   * @param {string} imageInput
   * @returns {{ isValid: boolean, error?: string }}
   */
  static validateImageInput(imageInput) {
    if (!imageInput || typeof imageInput !== 'string') {
      return { isValid: false, error: 'Image input must be a non-empty string.' };
    }

    // Check size
    if (imageInput.length > MAX_BASE64_SIZE_BYTES * 1.37) { // Base64 encoding overhead
      return { isValid: false, error: 'Image input exceeds maximum allowed size (10MB).' };
    }

    // If Base64 data URL, validate MIME type header
    if (imageInput.startsWith('data:')) {
      const match = imageInput.match(/^data:([^;]+);base64,/);
      if (match) {
        const mime = match[1].toLowerCase();
        if (!ALLOWED_IMAGE_MIMES.includes(mime)) {
          return { isValid: false, error: `Unsupported image MIME type: ${mime}. Allowed: JPEG, PNG, WEBP.` };
        }
      }
    }

    return { isValid: true };
  }

  /**
   * Uploads a comic panel image (base64 Data URL or remote URL) to Cloudinary.
   *
   * @param {string} imageInput - Base64 data URL or image string
   * @param {Object} [options]
   * @param {string} [options.folder] - Target Cloudinary folder
   * @param {number} [options.panelNumber] - Panel number for tagging/metadata
   * @param {string} [options.comicTitle] - Comic title
   * @returns {Promise<{ success: boolean, secureUrl: string, publicId?: string, isCloudinary: boolean, error?: string }>}
   */
  static async uploadPanelImage(imageInput, options = {}) {
    const validation = this.validateImageInput(imageInput);
    if (!validation.isValid) {
      return {
        success: false,
        secureUrl: imageInput || '',
        error: validation.error,
        isCloudinary: false,
      };
    }

    // If Cloudinary is not configured or input is an SVG data URL (fallback), return input directly
    if (!isCloudinaryConfigured || imageInput.startsWith('data:image/svg+xml')) {
      return {
        success: true,
        secureUrl: imageInput,
        isCloudinary: false,
      };
    }

    const folder = 'ai-comic-generator/panels';
    const panelNumber = Math.max(1, parseInt(options.panelNumber, 10) || 1);

    try {
      const uploadResult = await cloudinary.uploader.upload(imageInput, {
        folder,
        resource_type: 'image',
        tags: ['ai-comic', `panel-${panelNumber}`],
        transformation: [
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
      });

      return {
        success: true,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        isCloudinary: true,
      };
    } catch (err) {
      console.error(`[CloudinaryService] Upload failed for panel ${panelNumber}:`, err.message || err);
      // Fallback gracefully to original data URL so comic rendering is not interrupted
      return {
        success: false,
        secureUrl: imageInput,
        error: `Cloudinary upload failed: ${err.message || 'Network error'}`,
        isCloudinary: false,
      };
    }
  }

  /**
   * Deletes an image from Cloudinary (used for cleanup or replacement during panel regeneration).
   *
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<boolean>}
   */
  static async deleteImage(publicId) {
    if (!isCloudinaryConfigured || !publicId || typeof publicId !== 'string') return false;

    // Sanitize publicId (only allow standard alphanumeric, slashes, underscores, hyphens)
    if (!/^[a-zA-Z0-9_\-\/]+$/.test(publicId)) {
      console.warn(`[CloudinaryService] Invalid publicId rejected for deletion: ${publicId}`);
      return false;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (err) {
      console.error(`[CloudinaryService] Cleanup failed for public_id ${publicId}:`, err.message || err);
      return false;
    }
  }

  /**
   * Uploads multiple comic panel images sequentially to Cloudinary.
   *
   * @param {Array<Object>} panels - Array of panel objects containing imageUrl
   * @param {string} [comicTitle] - Comic title for folder organization
   * @returns {Promise<Array<Object>>} Enriched panels with secure Cloudinary URLs
   */
  static async uploadAllPanels(panels = [], comicTitle = '') {
    if (!isCloudinaryConfigured) {
      return panels;
    }

    const updatedPanels = [];

    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      const panelNumber = panel.panelNumber || i + 1;

      if (panel.imageUrl && !panel.imageUrl.startsWith('data:image/svg+xml')) {
        console.log(`[CloudinaryService] Uploading Panel #${panelNumber} to Cloudinary...`);
        const uploadRes = await this.uploadPanelImage(panel.imageUrl, {
          panelNumber,
          comicTitle,
        });

        updatedPanels.push({
          ...panel,
          imageUrl: uploadRes.secureUrl,
          cloudinaryPublicId: uploadRes.publicId || null,
          isCloudinaryHosted: uploadRes.isCloudinary,
        });
      } else {
        updatedPanels.push(panel);
      }
    }

    return updatedPanels;
  }
}
