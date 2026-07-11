/**
 * services/cloudinary.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable client-side helper function to upload images directly to Cloudinary.
 *
 * Requirements:
 * - VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET configured in .env.
 * - An unsigned upload preset must be active on your Cloudinary dashboard.
 */

export async function uploadToCloudinary(file: File | string): Promise<string> {
  const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').replace(/['"]/g, '').trim();
  const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').replace(/['"]/g, '').trim();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary configuration missing! Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file."
    );
  }

  // Create form data payload for the upload request
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error?.message || `Status code: ${response.status}`;
      throw new Error(
        `Cloudinary Upload Error: "${errMsg}" (using Cloud Name: "${cloudName}" and Preset: "${uploadPreset}")`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    throw new Error(err.message || "Network error occurred while uploading to Cloudinary.");
  }
}
