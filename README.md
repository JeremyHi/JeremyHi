# Jeremy's Personal Website

This is my personal website built with Jekyll and hosted on GitHub Pages. The site showcases my professional experience, skills, and interests in a clean, modern interface.

## 🚀 Quick Start

### Prerequisites

- Ruby (2.6.0 or higher)
- RubyGems
- Bundler

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/JeremyHi/JeremyHi.git
   cd JeremyHi
   ```

2. Install dependencies:
   ```bash
   bundle install --path vendor/bundle
   ```

3. Start the local development server:
   ```bash
   bundle exec jekyll serve
   ```

4. View the site at: `http://localhost:4000`

The site will automatically refresh when you make changes to the source files.

## 📁 Project Structure

```
.
├── _layouts/          # Jekyll layout templates
├── assets/           
│   └── css/          # Stylesheets
├── Files/            # Resume and other documents
├── _config.yml       # Jekyll configuration
├── Gemfile          # Ruby dependencies
├── index.html       # Main content
└── CNAME            # Custom domain configuration
```

## 🛠 Development

- The site uses Jekyll, a static site generator
- Styles are written in CSS with a dark theme
- The layout is responsive and card-based
- Interactive elements include hover effects and dynamic gradients

## 🚀 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. The live site can be viewed at: [jeremyhi.us](https://jeremyhi.us)

## 📝 Content Updates

To update the site content:

1. Edit `index.html` for main content changes
2. Update styles in `assets/css/style.css`
3. Add new files to the `Files/` directory as needed
4. Test changes locally using `bundle exec jekyll serve`
5. Commit and push changes to deploy

## 📄 License

This project is open source and available under the MIT License. 
