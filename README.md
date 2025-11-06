# Portfolio Site

A modern portfolio website built with GatsbyJS, featuring blog posts, project showcases, and MDX content management. This site showcases full-stack development and DevOps expertise.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run develop
```

Visit `http://localhost:8000` to view the site.

### Build

```bash
npm run build
```

### Serve Production Build

```bash
npm run serve
```

## 📁 Project Structure

```
.
├── content/               # MDX content files
│   ├── blog/             # Blog posts
│   ├── books/            # Book reviews
│   ├── projects/         # Project showcases
│   ├── resumes/          # Resume content
│   └── tech_logos/       # Technology logos
├── src/
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── templates/        # Page templates
│   ├── theme/            # Theme-UI configuration
│   ├── css/              # Global styles
│   ├── images/           # Static images
│   └── hooks/            # Custom React hooks
├── static/               # Static assets
├── gatsby-config.js      # Gatsby configuration
├── gatsby-node.js        # Node API customization
└── gatsby-browser.js     # Browser API customization
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage

```bash
npm run test:coverage
```

## 🎨 Tech Stack

- **Framework:** GatsbyJS v5
- **UI Library:** React 18
- **Styling:** Theme-UI
- **Content:** MDX
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier
- **Deployment:** Netlify

## 📝 Content Management

### Adding Blog Posts

Create a new `.md` or `.mdx` file in `content/blog/`:

```markdown
---
title: "Your Post Title"
date: "2025-01-01"
category: "Category Name"
draft: false
description: "Post description"
featuredImage: "./assets/image.jpg"
---

Your content here...
```

### Adding Projects

Create a new `.md` or `.mdx` file in `content/projects/`:

```markdown
---
title: "Project Name"
category: "Project Type"
techStack: ["React", "Node.js", "Azure"]
description: "Project description"
featuredImage: "./assets/project-image.png"
---

Project details...
```

## 🛠️ Development

### Code Style

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Environment Variables

Create `.env.development` and `.env.production` files:

```env
# Add environment-specific variables here
```

## 🚢 Deployment

The site is configured for Netlify deployment:

1. Push to main branch
2. Netlify automatically builds and deploys
3. RSS feed available at `/rss.xml`

### Build Configuration

- Build command: `gatsby build`
- Publish directory: `public`
- Node version: 18+

## 📦 Key Features

- **SEO Optimized:** React Helmet, sitemap, RSS feed
- **PWA Ready:** Manifest configuration
- **Security:** Content Security Policy (CSP) headers
- **Performance:** Image optimization with gatsby-plugin-image
- **Responsive:** Mobile-first design
- **Syntax Highlighting:** PrismJS integration
- **Smooth Scrolling:** Anchor link navigation

## 🔧 Configuration Files

- `gatsby-config.js` - Site metadata and plugins
- `gatsby-node.js` - Dynamic page generation
- `jest.config.js` - Test configuration
- `eslint.config.mjs` - Linting rules
- `.claudeignore` - Claude Code exclusions

## 📚 Additional Resources

- [Gatsby Documentation](https://www.gatsbyjs.com/docs)
- [Theme-UI Documentation](https://theme-ui.com)
- [MDX Documentation](https://mdxjs.com)

## 📄 License

This project is private and proprietary.
