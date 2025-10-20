// Year stamp
document.getElementById('year').textContent = new Date().getFullYear()

// Contact Panel logic with accessibility considerations
const overlay = document.getElementById('overlay')
const panel = document.getElementById('contactPanel')
const openers = [ 'openContact', 'openContact2', 'openContact3' ]
  .map(id => document.getElementById(id))
const closer = document.getElementById('closeContact')

let lastFocused = null

function openPanel(){
  lastFocused = document.activeElement
  overlay.hidden = false
  overlay.setAttribute('aria-hidden', 'false')
  panel.hidden = false
  panel.dataset.open = 'true'
  // focus first field
  const firstInput = panel.querySelector('input, textarea, button')
  if(firstInput) firstInput.focus()
  trapFocus(panel)
}

function closePanel(){
  overlay.setAttribute('aria-hidden', 'true')
  panel.dataset.open = 'false'
  // wait for transition end then hide
  setTimeout(()=>{
    overlay.hidden = true
    panel.hidden = true
    if(lastFocused) lastFocused.focus()
  }, 320)
  releaseFocus()
}

openers.forEach(btn => btn && btn.addEventListener('click', openPanel))
closer.addEventListener('click', closePanel)
overlay.addEventListener('click', closePanel)

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && panel.dataset.open === 'true'){ closePanel() }
})

// Basic focus trap
let focusHandler = null
function trapFocus(container){
  const selectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  const focusables = Array.from(container.querySelectorAll(selectors))
  if(!focusables.length) return

  function handler(e){
    if(e.key !== 'Tab') return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if(e.shiftKey){
      if(document.activeElement === first){
        e.preventDefault(); last.focus()
      }
    } else {
      if(document.activeElement === last){
        e.preventDefault(); first.focus()
      }
    }
  }
  focusHandler = handler
  container.addEventListener('keydown', focusHandler)
}
function releaseFocus(){
  if(focusHandler){
    panel.removeEventListener('keydown', focusHandler)
    focusHandler = null
  }
}
