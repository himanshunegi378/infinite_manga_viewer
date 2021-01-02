export function isAboveTopEdge(yValue: number): boolean {
  return yValue < 0
}

export function isBelowTopEdge(yValue: number): boolean {
  return yValue > 0
}

export function isAboveBottomEdge(yValue: number, window: Window): boolean {
  return yValue < window.innerHeight
}

export function isBelowBottomEdge(yValue: number, window: Window): boolean {
  return yValue > window.innerHeight
}

export function isTopInViewport(element: HTMLElement, window: Window): boolean {
  const position = element.getBoundingClientRect()

  const topInViewport =
    isBelowTopEdge(position.top) && isAboveBottomEdge(position.top, window)
  return topInViewport
}

export function isBottomInViewPort(
  element: HTMLElement,
  window: Window
): boolean {
  const position = element.getBoundingClientRect()
  const bottomInViewPort =
    isBelowTopEdge(position.bottom) &&
    isAboveBottomEdge(position.bottom, window)
  return bottomInViewPort
}

export function isInsideViewPort(
  element: HTMLElement,
  window: Window
): boolean {
  return isTopInViewport(element, window) && isBottomInViewPort(element, window)
}
export function isAllOverViewPort(
  element: HTMLElement,
  window: Window
): boolean {
  const position = element.getBoundingClientRect()
  return (
    isAboveTopEdge(position.top) && isBelowBottomEdge(position.bottom, window)
  )
}

export function isNotInViewPort(element: HTMLElement, window: Window): boolean {
  const position = element.getBoundingClientRect()
  return (
    isBelowBottomEdge(position.top, window) || isAboveTopEdge(position.bottom)
  )
}

const getVisbilityPercentage = (
  element: HTMLElement,
  window: Window
): number => {
  const position = element.getBoundingClientRect()
  if (isNotInViewPort(element, window)) return 0
  if (isAllOverViewPort(element, window) || isInsideViewPort(element, window)) {
    return 100
  }
  if (isBottomInViewPort(element, window)) {
    const visbilityPercentage = (position.bottom / window.innerHeight) * 100
    return visbilityPercentage
  }
  if (isTopInViewport(element, window)) {
    const visbilityPercentage =
      ((window.innerHeight - position.top) / window.innerHeight) * 100
    return visbilityPercentage
  }
  throw new Error('It should not be able to come here')
}

export default getVisbilityPercentage
