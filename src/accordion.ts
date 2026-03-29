import { prepare, layout } from '@chenglou/pretext'

interface AccordionConfig {
  selector: string
  itemSelector?: string
  initialExpanded?: number[] | 'all' | 'none'
  duration?: number
}

export function initAccordion(config: AccordionConfig) {
  const {
    selector,
    itemSelector = '.work-item',
    initialExpanded = 'none',
    duration = 250
  } = config

  const container = document.querySelector(selector)
  if (!container) return

  // Inject accordion styles
  const style = document.createElement('style')
  style.textContent = `
    .accordion-item .accordion-header {
      cursor: pointer;
      user-select: none;
    }
    .accordion-item .accordion-header:hover h3 {
      opacity: 0.85;
    }
    .accordion-toggle-icon {
      display: inline-block;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 7px solid #55aaff;
      margin-right: 10px;
      transition: transform ${duration}ms ease;
      vertical-align: middle;
    }
    .accordion-expanded .accordion-toggle-icon {
      transform: rotate(90deg);
    }
    .accordion-body {
      overflow: hidden;
      transition: height ${duration}ms ease;
    }
    .accordion-body p {
      margin-bottom: 10px;
    }
    /* Ensure copy buttons don't trigger accordion */
    .copy-link-btn {
      position: relative;
      z-index: 10;
    }
  `
  document.head.appendChild(style)

  const itemElements = container.querySelectorAll(itemSelector)

  itemElements.forEach((itemEl, index) => {
    const element = itemEl as HTMLElement
    element.classList.add('accordion-item')
    
    const h3 = element.querySelector('h3')
    if (!h3) return

    // Create header wrapper
    const header = document.createElement('div')
    header.className = 'accordion-header'
    
    // Add toggle icon
    const toggleIcon = document.createElement('span')
    toggleIcon.className = 'accordion-toggle-icon'
    
    // Wrap h3 in header
    h3.parentNode?.insertBefore(header, h3)
    header.appendChild(toggleIcon)
    header.appendChild(h3)

    // Wrap paragraphs in body
    const body = document.createElement('div')
    body.className = 'accordion-body'
    
    const paragraphs = Array.from(element.querySelectorAll('p'))
    if (paragraphs.length > 0) {
      header.parentNode?.insertBefore(body, paragraphs[0])
      paragraphs.forEach(p => body.appendChild(p))
    }

    // Measure content height using Pretext
    const computedStyle = paragraphs[0] ? getComputedStyle(paragraphs[0]) : null
    const font = computedStyle?.font || '16px monospace'
    const lineHeight = parseFloat(computedStyle?.lineHeight || '24')
    const contentWidth = element.clientWidth - 40

    let measuredHeight = 0
    paragraphs.forEach(p => {
      const text = p.textContent || ''
      if (text.trim()) {
        try {
          const prepared = prepare(text, font)
          const { height } = layout(prepared, contentWidth, lineHeight)
          measuredHeight += height + 15
        } catch {
          measuredHeight += p.scrollHeight + 15
        }
      }
    })

    let isExpanded = false

    function expand(animate: boolean) {
      isExpanded = true
      element.classList.add('accordion-expanded')
      
      if (animate) {
        body.style.height = '0px'
        const targetHeight = body.scrollHeight || measuredHeight
        requestAnimationFrame(() => {
          body.style.height = targetHeight + 'px'
        })
        setTimeout(() => {
          body.style.height = 'auto'
        }, duration)
      } else {
        body.style.height = 'auto'
      }
    }

    function collapse(animate: boolean) {
      isExpanded = false
      element.classList.remove('accordion-expanded')
      
      if (animate) {
        body.style.height = body.scrollHeight + 'px'
        requestAnimationFrame(() => {
          body.style.height = '0px'
        })
      } else {
        body.style.height = '0px'
      }
    }

    // Initial state
    const shouldExpand = 
      initialExpanded === 'all' ||
      (Array.isArray(initialExpanded) && initialExpanded.includes(index))
    
    if (shouldExpand) {
      expand(false)
    } else {
      collapse(false)
    }

    // Click handler - exclude copy buttons
    header.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.copy-link-btn')) {
        return // Don't toggle when clicking copy button
      }
      
      if (isExpanded) {
        collapse(true)
      } else {
        expand(true)
      }
    })
  })
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  const accordionContainer = document.querySelector('[data-accordion]')
  if (accordionContainer) {
    initAccordion({
      selector: '[data-accordion]',
      itemSelector: accordionContainer.getAttribute('data-accordion-items') || '.work-item',
      initialExpanded: 'none',
      duration: 250
    })
  }
})
