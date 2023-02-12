export const handleResponse = (res) => {
  if (
    res === undefined ||
    res.data === undefined ||
    res.data.RES_CODE === undefined ||
    res.data.RES_CODE === 'Error'
  ) {
    throw { name: 'Error', message: res.data.ERROR_MESSAGE }
  }
  if (
    res !== undefined &&
    res.data !== undefined &&
    res.data.RES_CODE !== undefined &&
    res.data.RES_CODE === 'Warning'
  )
    throw { name: 'Warning', message: res.data.WARNING_MESSAGE }
}

export const handleError = (err, mainContext) => {
  console.log('Error', err)
  if (err.name === 'Error') mainContext.showErrorToast('Something went wrong.', true)
  else if (err.name === 'Warning') mainContext.showWarningToast(err.message)
}
