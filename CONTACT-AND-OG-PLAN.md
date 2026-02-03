# Plan: Contact Page + Site-Wide OG Tags

## Part 1: Contact Page

### 1.1 Homepage Addition
Add a new link to index.html:
```html
<div class="link-item">
  <span class="link-description"><a href="/contact">contact</a> - get in touch</span>
</div>
```

### 1.2 Contact Page Design (`contact.html`)

**Style:** Matches existing pages (socials, crypto) - minimalist, dark theme, lowercase aesthetic

**Content Structure:**
```
← back

contact

get in touch

For inquiries about building something together, integrations, 
or professional opportunities, email is the best way to reach me.

[Email Section]
jh@jeremyhi.us
- Clickable mailto link
- Copy button for convenience

[Social]
You can also find me on X: @ruhroh (hyperlinked)

[Note]
I try to respond within a few days. For urgent matters, 
DM me on X.
```

**Key Elements:**
- mailto: link for email
- Copy-to-clipboard button (matches crypto page pattern)
- X profile link
- Clean, minimal layout matching site style

### 1.3 Contact Page Technical Specs
- Layout: `home`
- Permalink: `/contact/`
- Title: "Contact - Jeremy"

---

## Part 2: Site-Wide OG Tags

### 2.1 Pages Needing OG Tags

| Page | Title | Description | Image |
|------|-------|-------------|-------|
| index.html | Jeremy Hi | Developer building complex systems and MVPs. Working at Gemini on KYC/onboarding, managing Propheseer for prediction markets. | og/home.png |
| contact.html | Contact - Jeremy | Get in touch for collaborations, integrations, or professional opportunities. | og/contact.png |
| socials.html | Socials - Jeremy | Follow Jeremy on X (@ruhroh) and other platforms. | og/socials.png |
| crypto.html | Crypto - Jeremy | Crypto addresses for tips and donations - ETH, BTC, SOL. | og/crypto.png |
| work.html | Work - Jeremy | Portfolio of projects including Gemini, Propheseer, and more. | og/work.png |

### 2.2 Update Home Layout (`_layouts/home.html`)

Add OG meta tags support:
```html
<head>
  ...
  <!-- Open Graph -->
  <meta property="og:title" content="{{ page.og_title | default: page.title }}">
  <meta property="og:description" content="{{ page.og_description | default: site.description }}">
  <meta property="og:url" content="{{ site.url }}{{ page.url }}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Jeremy Hi">
  <meta property="og:locale" content="en_US">
  {% if page.og_image %}
  <meta property="og:image" content="{{ site.url }}{{ page.og_image }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  {% endif %}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="{% if page.og_image %}summary_large_image{% else %}summary{% endif %}">
  <meta name="twitter:title" content="{{ page.og_title | default: page.title }}">
  <meta name="twitter:description" content="{{ page.og_description | default: site.description }}">
  {% if page.og_image %}
  <meta name="twitter:image" content="{{ site.url }}{{ page.og_image }}">
  {% endif %}
</head>
```

### 2.3 OG Image Design

**Style (matching existing work section images):**
- Dark gradient background (#0d0d0d to #1a1a1a)
- Subtle blue grid overlay
- Monospace title
- Description text in gray
- Blue accent dot
- "jeremyhi.us" domain footer
- 1200x630px, PNG, <100KB

**Images to Generate:**
1. `home.png` - "jeremy hi" + tagline about building things
2. `contact.png` - "contact" + reach out message
3. `socials.png` - "socials" + follow me message
4. `crypto.png` - "crypto" + addresses for tips
5. `work.png` - "work" + portfolio message

---

## Part 3: Implementation Steps

### Phase 1: Layout Update
1. Update `_layouts/home.html` with OG tag support

### Phase 2: Contact Page
1. Create `contact.html` with content and frontmatter
2. Add contact link to `index.html`

### Phase 3: OG Tags for All Pages
1. Add `og_title`, `og_description`, `og_image` frontmatter to:
   - index.html
   - contact.html
   - socials.html
   - crypto.html
   - work.html

### Phase 4: OG Images
1. Generate 5 OG images using existing script pattern
2. Place in `/assets/og/`

### Phase 5: Testing
1. Deploy to feature branch
2. Test with Facebook/Twitter validators
3. Verify contact page functionality
4. Merge to main

---

## File Changes Summary

| File | Action |
|------|--------|
| `_layouts/home.html` | Add OG meta tags |
| `index.html` | Add contact link + OG frontmatter |
| `contact.html` | CREATE - new contact page |
| `socials.html` | Add OG frontmatter |
| `crypto.html` | Add OG frontmatter |
| `work.html` | Add OG frontmatter |
| `assets/og/home.png` | CREATE - OG image |
| `assets/og/contact.png` | CREATE - OG image |
| `assets/og/socials.png` | CREATE - OG image |
| `assets/og/crypto.png` | CREATE - OG image |
| `assets/og/work.png` | CREATE - OG image |
| `scripts/generate-og-image.js` | UPDATE - add new pages |

---

## Contact Page Copy (Final)

```
contact

the best way to reach me

For building something together, integrations, consulting,
or professional opportunities - email works best.

📧 jh@jeremyhi.us

You can also find me on X where I'm fairly active:
→ @ruhroh

I typically respond within a few days.
```
