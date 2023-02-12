export const removeAllWhiteSpace = (str) => {
  return str.replaceAll(/\s/g, '')
}

export const compareStr = (str1, str2, isRemoveAllWhiteSpace = false) => {
  if (!str1 || !str2) return false
  if (isRemoveAllWhiteSpace)
    return removeAllWhiteSpace(str1).toLowerCase() === removeAllWhiteSpace(str2).toLowerCase()
  else return str1.toLowerCase() === str2.toLowerCase()
}

/**
 * Urdaa - temdeg tavibal urvuugaar ni erembelene
 */
export const sortBy = (property, toLowerCase = true) => {
  var sortOrder = 1
  if (property[0] === '-') {
    sortOrder = -1
    property = property.substr(1)
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result = toLowerCase
      ? a[property].toLowerCase() < b[property].toLowerCase()
        ? -1
        : a[property].toLowerCase() > b[property].toLowerCase()
        ? 1
        : 0
      : a[property] < b[property]
      ? -1
      : a[property] > b[property]
      ? 1
      : 0
    return result * sortOrder
  }
}

/**
 * Urdaa - temdeg tavibal urvuugaar ni erembelene
 */
export const sortByMultiple = (args) => {
  /*
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  var properties = args
  return function (obj1, obj2) {
    var i = 0,
      result = 0,
      numberOfProperties = properties.length
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(properties[i])(obj1, obj2)
      i++
    }
    return result
  }
}

export const validateIpAddress = (ipAddress) => {
  const regEx =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if (ipAddress.match(regEx)) {
    return true
  } else {
    return false
  }
}
