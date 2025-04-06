export const MAX_FILE_SIZE_BYTES = 10000000; // 10MB

const PHOTO_MIME_TYPES = [
  'image/jpeg', // .jpg, .jpeg
  'image/png', // .png
  'image/gif', // .gif
  'image/webp', // .webp
  'image/svg+xml', // .svg
];

const VIDEO_MIME_TYPES = [
  'video/mp4', // .mp4
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/x-matroska', // .mkv
];

const DOCUMENT_MIME_TYPES = [
  'application/pdf', // .pdf
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain', // .txt
  'text/csv', // .csv
];

export const ALLOWED_MIME_TYPES = [
  ...PHOTO_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
  ...DOCUMENT_MIME_TYPES,
];
