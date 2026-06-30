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
    linksSelector = '.links-section'
  } = config

  const container = document.querySelector(selector)
  if (!container) return

  const paragraphs = Array.from(container.querySelectorAll('p')) as HTMLParagraphElement[]
  if (paragraphs.length === 0) return

  // Snapshot each paragraph, then clear it for typing.
  const contents: ParagraphState[] = paragraphs.map(p => {
    const state: ParagraphState = {
      el: p,
      text: p.textContent || '',
      html: p.innerHTML,
      done: false
    }
    p.innerHTML = ''
    p.style.minHeight = '1.5em' // Reserve height to prevent layout shift
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
    // Fire the existing momentum sweep…
    container?.classList.add('typing-done')
    // …then reveal the links rising in from below.
    window.setTimeout(() => {
      const links = document.querySelector(linksSelector)
      links?.classList.add('links-revealed')
    }, 180)
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

  // Sequence: head lines type together → a beat → the final ("links") line types
  // alone → onComplete fires the sweep and reveals the links.
  const BEAT = 400 // ms pause after the head lines, before the final line
  const head = contents.slice(0, -1)
  const last = contents[contents.length - 1]

  window.setTimeout(() => {
    if (head.length === 0) {
      typeLines([last], onComplete)
      return
    }
    typeLines(head, () => {
      window.setTimeout(() => typeLines([last], onComplete), BEAT)
    })
  }, startDelay)
}

// Auto-init if data attribute present
document.addEventListener('DOMContentLoaded', () => {
  const typingContainer = document.querySelector('[data-typing-effect]')
  if (typingContainer) {
    initTypingEffect({
      selector: '[data-typing-effect]',
      speed: parseInt(typingContainer.getAttribute('data-typing-speed') || '35'),
      startDelay: parseInt(typingContainer.getAttribute('data-typing-delay') || '300')
    })
  }
})
