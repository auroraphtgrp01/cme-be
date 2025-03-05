export const shouldCacheData = (data: any) => {
  const maxSizeInBytes = 1024 * 1024
  const dataSizeInBytes = Buffer.byteLength(JSON.stringify(data), 'utf8')
  if (dataSizeInBytes <= maxSizeInBytes) {
    return true
  }
  return false
}
