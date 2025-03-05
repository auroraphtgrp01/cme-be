export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return ''
  }
  return fileName.substring(lastDotIndex)
}

export function removeFileExtension(fileName: string): string {
  return fileName.split('.')[0]
}
