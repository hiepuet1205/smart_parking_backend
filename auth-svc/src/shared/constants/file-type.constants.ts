// image/avif
// image/jpeg (.jpg, .jpeg, .jfif, .pjpeg, .pjp) [19]
// image/png
// image/svg+xml (.svg)
// image/tiff

export enum FileTypes {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  AVIF = 'image/avif',
  SVG = 'image/svg+xml',
  TIFF = 'image/tiff',
}

export const ImageTypes = [FileTypes.PNG, FileTypes.JPEG, FileTypes.AVIF, FileTypes.SVG, FileTypes.TIFF];
