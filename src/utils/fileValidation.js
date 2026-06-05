import toast from "react-hot-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const validateImageFile = (file) => {
  if (!file) {
    return false;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error("Only JPG, PNG, WEBP and GIF images are allowed");
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("File size must be less than 5 MB");
    return false;
  }

  return true;
};