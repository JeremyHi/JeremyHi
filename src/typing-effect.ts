interface TypingConfig {
  /** CSS selector for the container */
  selector: string
  /** Typing speed in ms per character */
  speed?: number
  /** Initial delay before typing starts */
  startDelay?: number
  /** Show a block cursor on each line while it types */
  showCursor?: boolean
  /** Selector for links to reveal once typing completes */
  linksSelector?: string
  /** Already played this session: skip typing and render the final state instantly */
  played?: boolean
}

// sessionStorage can throw in private-mode browsers — access it defensively.
function safeGet(key: string): string | null {
  try { return window.sessionStorage.getItem(key) } catch { return null }
}
function safeSet(key: string, value: string) {
  try { window.sessionStorage.setItem(key, value) } catch { /* ignore */ }
}

interface ParagraphState {
  el: HTMLParagraphElement
  text: string
  html: string
  done: boolean
}

export function initTypingEffect(config: TypingConfig) {
  const {
    selector,
    speed = 35,
    startDelay = 300,
    showCursor = true,
    played = false
  } = config

  const container = document.querySelector(selector)
  if (!container) return

  const paragraphs = Array.from(container.querySelectorAll('p')) as HTMLParagraphElement[]
  if (paragraphs.length === 0) return

  // Return visit this session: text is already in the DOM — just show the sweep
  // underline and skip the clear/type entirely so it renders instantly.
  if (played) {
    container.classList.add('typing-done')
    return
  }

  // Snapshot each paragraph, then clear it for typing. Reserve each paragraph's
  // full rendered height first (measured while the text is still present) so the
  // links sitting below don't shift downward as the intro types in.
  const contents: ParagraphState[] = paragraphs.map(p => {
    const state: ParagraphState = {
      el: p,
      text: p.textContent || '',
      html: p.innerHTML,
      done: false
    }
    p.style.minHeight = p.offsetHeight + 'px'
    p.innerHTML = ''
    return state
  })

  // Cursor style (one block cursor per line while it types).
  if (showCursor) {
    const style = document.createElement('style')
    style.textContent = `
      .typing-cursor::after {
        content: '█';
        animation: blink 1s step-end infinite;
        margin-left: 1px;
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
    `
    document.head.appendChild(style)
  }

  // Type a group of paragraphs together off a shared char index, then call onDone.
  function typeLines(group: ParagraphState[], onDone: () => void) {
    const maxLen = group.reduce((m, c) => Math.max(m, c.text.length), 0)
    let charIndex = 0

    function tick() {
      charIndex++

      for (const c of group) {
        if (c.done) continue

        if (charIndex >= c.text.length) {
          // This line just finished: restore full HTML, drop its cursor.
          c.el.innerHTML = c.html
          c.el.classList.remove('typing-cursor')
          c.done = true
        } else {
          c.el.innerHTML = reconstructHTML(c.html, c.text.slice(0, charIndex))
          if (showCursor) c.el.classList.add('typing-cursor')
        }
      }

      if (charIndex >= maxLen) {
        onDone()
        return
      }
      window.setTimeout(tick, speed)
    }

    tick()
  }

  function onComplete() {
    // Fire the momentum sweep under the intro and remember we've played this
    // session (the links reveal is handled separately, on load).
    container?.classList.add('typing-done')
    safeSet('introPlayed', '1')
  }

  // Reconstruct HTML with a partial text length, preserving inline tags (links).
  function reconstructHTML(fullHtml: string, partialText: string): string {
    if (!fullHtml.includes('<a')) {
      return partialText
    }

    const temp = document.createElement('div')
    temp.innerHTML = fullHtml

    let charCount = 0
    const targetLength = partialText.length

    function processNode(node: Node): boolean {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ''
        const remaining = targetLength - charCount

        if (remaining <= 0) {
          node.textContent = ''
          return false
        } else if (remaining < text.length) {
          node.textContent = text.slice(0, remaining)
          charCount += remaining
          return false
        } else {
          charCount += text.length
          return true
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes)
        for (const child of children) {
          if (!processNode(child)) {
            let sibling = child.nextSibling
            while (sibling) {
              const next = sibling.nextSibling
              sibling.parentNode?.removeChild(sibling)
              sibling = next
            }
            return false
          }
        }
        return true
      }
      return true
    }

    processNode(temp)
    return temp.innerHTML
  }

  // Type all intro paragraphs together, then fire the sweep on completion.
  window.setTimeout(() => typeLines(contents, onComplete), startDelay)
}

// Auto-init if data attribute present
document.addEventListener('DOMContentLoaded', () => {
  const typingContainer = document.querySelector('[data-typing-effect]')
  if (!typingContainer) return

  const played = safeGet('introPlayed') === '1'

  // The links heading + links appear right away (in parallel with the intro
  // typing), independent of the typewriter. On a return visit, show them instantly.
  const links = document.querySelector('.links-section')
  if (played) {
    links?.classList.add('links-revealed', 'no-anim')
  } else {
    // Paint the hidden state once, then trigger the rise-in transition.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => links?.classList.add('links-revealed'))
    )
  }

  initTypingEffect({
    selector: '[data-typing-effect]',
    speed: parseInt(typingContainer.getAttribute('data-typing-speed') || '35'),
    startDelay: parseInt(typingContainer.getAttribute('data-typing-delay') || '300'),
    played
  })
})
