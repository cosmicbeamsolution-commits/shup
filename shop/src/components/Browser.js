export const getBrowser = () => {
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
    return 'opera'
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'chrome'
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    return 'safari'
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'firefox'
  } else if ((navigator.userAgent.indexOf('MSIE') !== -1) || (!!document.documentMode === true)) {
    return 'ie'
  } else {
    return 'unknown'
  }
}

export const getOS = () => {
  if (navigator.appVersion.indexOf('Win') !== -1) {
    return 'windows'
  } else if (navigator.appVersion.indexOf('Mac') !== -1) {
    return 'mac'
  } else if (navigator.appVersion.indexOf('X11') !== -1) {
    return 'unix'
  } else if (navigator.appVersion.indexOf('Linux') !== -1) {
    return 'linux'
  } else {
    return 'unknown'
  }
}

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
