# OG Image Validation & Testing Plan

## Overview
Testing that each shared link produces a preview with the correct image and content.

---

## Phase 1: Local Validation (Pre-Deploy)

### 1.1 HTML Structure Check
```bash
# Build the site locally
bundle exec jekyll build

# Verify each redirect page has correct og:image tag
for section in gemini propheseer propheseer-marketing jhipro edmunds cryptosym bcg-dappathon; do
  echo "=== $section ==="
  grep -E "og:image|og:title|og:description" _site/work/$section/index.html
done
```

**Expected:** Each page shows:
- `og:image` pointing to `/og/{section}.png`
- `og:title` matching the section title
- `og:description` matching the section description

### 1.2 Image File Validation
```bash
# Check all images exist and have correct dimensions
for img in assets/og/*.png; do
  echo "$img: $(file $img | grep -o '[0-9]* x [0-9]*')"
done
```

**Expected:** All images are 1200x630 PNG

### 1.3 File Size Check
```bash
# Images should be under 300KB for fast loading
ls -lh assets/og/*.png
```

**Expected:** Each file < 300KB

---

## Phase 2: Staging Validation (Post-Deploy to Branch)

### 2.1 Deploy to Feature Branch
```bash
# Push feature branch - GitHub Pages will deploy to preview
git push origin feature/og-images
```

### 2.2 Direct URL Testing
Visit each redirect page directly and verify:
- [ ] Page loads (even if briefly before redirect)
- [ ] View page source shows correct `og:image` URL
- [ ] Image URL is accessible (paste in browser)

**URLs to test:**
- https://jeremyhi.com/work/gemini/
- https://jeremyhi.com/work/propheseer/
- https://jeremyhi.com/work/propheseer-marketing/
- https://jeremyhi.com/work/jhipro/
- https://jeremyhi.com/work/edmunds/
- https://jeremyhi.com/work/cryptosym/
- https://jeremyhi.com/work/bcg-dappathon/

---

## Phase 3: Platform Preview Testing

### 3.1 Facebook Sharing Debugger
**URL:** https://developers.facebook.com/tools/debug/

Test each URL. Verify:
- [ ] og:image appears correctly
- [ ] og:title matches expected
- [ ] og:description matches expected
- [ ] No warnings/errors

### 3.2 Twitter Card Validator
**URL:** https://cards-dev.twitter.com/validator

Test each URL. Verify:
- [ ] Card preview renders
- [ ] Image displays correctly
- [ ] Title/description correct

### 3.3 LinkedIn Post Inspector
**URL:** https://www.linkedin.com/post-inspector/

Test each URL. Verify:
- [ ] Preview generates
- [ ] Image appears
- [ ] Metadata correct

### 3.4 Manual Platform Tests

#### iMessage (Primary Target)
1. Send link to yourself (or test contact)
2. Wait for preview to generate
3. Verify image appears in bubble
4. Verify title/description text

#### Slack
1. Paste link in test channel/DM
2. Verify unfurl shows image
3. Check title/description

#### Discord
1. Paste link in test server
2. Verify embed shows image
3. Check metadata

---

## Phase 4: Content Accuracy Matrix

| Section | Expected Title | Expected Image Shows | Verified |
|---------|---------------|---------------------|----------|
| gemini | Work - Gemini | "gemini" + crypto exchange desc | ☐ |
| propheseer | Work - Propheseer | "propheseer" + API desc | ☐ |
| propheseer-marketing | Work - Propheseer Marketing | "propheseer marketing" + twitter desc | ☐ |
| jhipro | Work - JHI Pro | "jhi pro" + climbing gym desc | ☐ |
| edmunds | Work - Edmunds | "edmunds" + automotive desc | ☐ |
| cryptosym | Work - Cryptosym | "cryptosym" + trading sim desc | ☐ |
| bcg-dappathon | Work - BCG DAppathon | "bcg dappathon" + blockchain desc | ☐ |

---

## Phase 5: Cache Busting (If Needed)

If old previews persist after changes:

1. **Facebook:** Use debugger's "Scrape Again" button
2. **Twitter:** Validator auto-refreshes on each check
3. **LinkedIn:** Inspector has refresh option
4. **iMessage/Slack:** Add `?v=2` to URL temporarily, share that version
5. **Wait:** Most caches expire within 24-48 hours

---

## Rollback Plan

If issues found:
```bash
# Revert to master
git checkout master

# Delete feature branch (optional)
git branch -D feature/og-images
git push origin --delete feature/og-images
```

Site will immediately return to previous state (no og:image tags, text-only previews).

---

## Sign-Off Checklist

- [ ] All 7 sections have unique, correctly-matched images
- [ ] Images are 1200x630 and under 300KB
- [ ] Facebook debugger shows no errors
- [ ] Twitter card validator passes
- [ ] iMessage preview looks correct
- [ ] At least one other platform (Slack/Discord/LinkedIn) verified
- [ ] Redirect still works (user lands on correct section)
- [ ] Main site unchanged (no visible images)

**Approved by:** _________________ **Date:** _________
