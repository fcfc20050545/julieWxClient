export const DESIGN_WIDTH = 375

export function toDesignPx(physicalPx: number, windowWidth: number) {
  if (!windowWidth) return physicalPx
  return (physicalPx * DESIGN_WIDTH) / windowWidth
}

export function stageLayout(windowHeight: number, windowWidth: number) {
  const height = toDesignPx(windowHeight, windowWidth)
  const clockHalf = 42
  const buttonHalf = 74
  const gap = 24
  const confirmBelow = 36
  const preferredButton = Math.max(height * 0.78, height * 0.5 + clockHalf + gap + buttonHalf)
  const maxButton = height - 8 - buttonHalf - confirmBelow
  const buttonTop = Math.min(preferredButton, Math.max(buttonHalf, maxButton))
  const maxClock = buttonTop - buttonHalf - gap - clockHalf
  const clockTop = Math.min(height * 0.5, Math.max(clockHalf, maxClock))
  return { height, clockTop, buttonTop }
}
