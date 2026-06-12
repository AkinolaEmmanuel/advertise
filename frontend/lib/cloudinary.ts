import { apiFetch } from "@/lib/api";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export type CloudinaryUploadPurpose = "product_image" | "brand_logo";

interface UploadSignature {
  api_key: string;
  cloud_name: string;
  folder: string;
  signature: string;
  timestamp: number;
  upload_url: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: {
    message?: string;
  };
}

export function validateImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 5 MB or smaller");
  }
}

export async function uploadCloudinaryImage(
  file: File,
  purpose: CloudinaryUploadPurpose,
  onProgress?: (progress: number) => void
) {
  validateImageFile(file);

  const signature = await apiFetch<UploadSignature>("/api/dashboard/uploads/signature", {
    method: "POST",
    body: JSON.stringify({ purpose }),
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.api_key);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const result = await uploadWithProgress(signature.upload_url, formData, onProgress);
  if (!result.secure_url) {
    throw new Error("Cloudinary did not return an image URL");
  }

  return result.secure_url;
}

function uploadWithProgress(
  uploadUrl: string,
  formData: FormData,
  onProgress?: (progress: number) => void
) {
  return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      const response = parseCloudinaryResponse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve(response);
        return;
      }

      reject(new Error(response.error?.message || "Image upload failed"));
    };

    xhr.onerror = () => reject(new Error("Image upload failed"));
    xhr.open("POST", uploadUrl);
    xhr.send(formData);
  });
}

function parseCloudinaryResponse(text: string): CloudinaryUploadResponse {
  try {
    return JSON.parse(text) as CloudinaryUploadResponse;
  } catch {
    return {};
  }
}
