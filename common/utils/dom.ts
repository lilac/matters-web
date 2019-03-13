// Select
export const $ = (selector: string): any => document.querySelector(selector)
export const $$ = (selector: string): any => document.querySelectorAll(selector)

// Size
const getWindowHeight = () =>
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight
const getWindowWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

// Position
const offset = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  }
}

// copy to clipboard
const copyToClipboard = (str: string) => {
  // Create new element
  const el = document.createElement('textarea')
  // Set value (string to be copied)
  el.value = str
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  // Select text inside element
  el.select()
  // Copy text to clipboard
  document.execCommand('copy')
  // Remove temporary element
  document.body.removeChild(el)
}

export const dom = {
  $,
  $$,
  getWindowHeight,
  getWindowWidth,
  offset,
  copyToClipboard
}