export const filterObject = (obj: object, keysToRemove: string[]): any => {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => filterObject(item, keysToRemove))
  }

  for (const key in obj) {
    if (keysToRemove.includes(key)) {
      delete obj[key]
    } else if (obj[key] && typeof obj[key] === 'object') {
      obj[key] = filterObject(obj[key], keysToRemove)
    }
  }
  return obj
}
