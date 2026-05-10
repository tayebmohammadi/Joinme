/**
 * Scroll to the public Dartmouth Google sign-in card (see `DartmouthGoogleAuthCard`).
 * Waits briefly so (1) React can commit after `navigate`, and (2) the tap that opened
 * this flow doesn’t end up as a click on “Continue with Dartmouth Google” once the
 * page scrolls (common on touch devices).
 */
export function focusDartmouthSignIn() {
  window.setTimeout(() => {
    const el = document.getElementById('dartmouth-sign-in')
    if (!el) return

    el.style.pointerEvents = 'none'
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => {
      el.style.pointerEvents = ''
    }, 700)
  }, 100)
}
