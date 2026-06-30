import { prepare, layout } from '@chenglou/pretext'

interface TypingConfig {
  /** CSS selector for the container */
  selector: string
  /** Typing speed in ms per character */
  speed?: number
  /** Initial delay before typing starts */
  startDelay?: number
  /** Delay between paragraphs */
  paragraphDelay?: number
  /** Show cursor */
  showCursor?: boolean
}

export function initTypingEffect(config: TypingConfig) {
  const {
    selector,
    speed = 35,
    startDelay = 300,
    paragraphDelay = 200,
    showCursor = true
  } = config

  const container = document.querySelector(selector)
  if (!container) return

  // Get all paragraphs
  const paragraphs = Array.from(container.querySelectorAll('p'))
  if (paragraphs.length === 0) return

  // Store original content and prepare for typing
  const contents: { el: HTMLParagraphElement; text: string; html: string }[] = []
  
  paragraphs.forEach(p => {
    contents.push({
      el: p as HTMLParagraphElement,
      text: p.textContent || '',
      html: p.innerHTML
    })
    p.innerHTML = ''
    p.style.minHeight = '1.5em' // Prevent layout shift
  })

  // Add cursor style
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

  // Use Pretext to measure and verify text fits
  const font = getComputedStyle(paragraphs[0]).font || '16px monospace'
  
  let currentParagraph = 0
  let currentChar = 0
  let timeoutId: number | null = null

  function typeNextChar() {
    if (currentParagraph >= contents.length) {
      // Done typing - remove cursor from last paragraph
      const lastP = contents[contents.length - 1].el
      lastP.classList.remove('typing-cursor')
      container?.classList.add('typing-done')
      return
    }

    const current = contents[currentParagraph]
    const { el, html } = current
    
    // Remove cursor from previous paragraph if moving to new one
    if (currentChar === 0 && currentParagraph > 0) {
      contents[currentParagraph - 1].el.classList.remove('typing-cursor')
    }

    if (currentChar === 0) {
      el.classList.add('typing-cursor')
    }

    // Type character by character, preserving HTML tags
    currentChar++
    
    // Simple approach: extract text, type it, but preserve link structure
    const textOnly = current.text
    const typed = textOnly.slice(0, currentChar)
    
    // Reconstruct HTML with typed portion
    el.innerHTML = reconstructHTML(html, typed)
    
    if (showCursor) {
      el.classList.add('typing-cursor')
    }

    if (currentChar >= textOnly.length) {
      // Finished this paragraph
      el.innerHTML = html // Restore full HTML
      currentParagraph++
      currentChar = 0
      
      if (currentParagraph < contents.length) {
        timeoutId = window.setTimeout(typeNextChar, paragraphDelay)
      } else {
        // Last paragraph finished - drop cursor and fire the momentum sweep
        el.classList.remove('typing-cursor')
        container?.classList.add('typing-done')
      }
    } else {
      timeoutId = window.setTimeout(typeNextChar, speed)
    }
  }

  // Reconstruct HTML with partial text
  function reconstructHTML(fullHtml: string, partialText: string): string {
    // For simple cases, just return partial text
    // For links, we need smarter handling
    if (!fullHtml.includes('<a')) {
      return partialText
    }

    // Parse and reconstruct with partial content
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
            // Remove remaining siblings
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

  // Start typing after delay
  setTimeout(typeNextChar, startDelay)
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
