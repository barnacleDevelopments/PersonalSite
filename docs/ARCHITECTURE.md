# Architecture Overview

This document outlines the architecture and design decisions for the portfolio site.

## Technology Stack

### Core Framework
- **GatsbyJS v5**: Static site generator built on React
- **React 18**: Component-based UI library
- **GraphQL**: Data query language for content

### Styling
- **Theme-UI**: Constraint-based styling system
- **Tailwind Preset**: Base design tokens from Tailwind
- **PrismJS**: Syntax highlighting for code blocks

### Content Management
- **MDX**: Markdown with JSX support for interactive content
- **gatsby-source-filesystem**: File-based content sourcing
- **gatsby-transformer-remark**: Markdown processing

### Testing
- **Jest**: Test runner
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom DOM matchers

## Architecture Patterns

### Static Site Generation (SSG)

The site uses Gatsby's SSG approach:

1. **Build Time**: Content is processed and pages are generated
2. **Deploy**: Static HTML/CSS/JS files are deployed
3. **Runtime**: Client-side hydration enables React interactivity

### File-Based Routing

Pages are created through two mechanisms:

1. **Automatic**: Files in `src/pages/` become routes
   - `src/pages/index.jsx` → `/`
   - `src/pages/about.jsx` → `/about`
   - `src/pages/blog.jsx` → `/blog`

2. **Programmatic**: Dynamic pages created in `gatsby-node.js`
   - Blog posts: `/blog/{slug}`
   - Projects: `/projects/{slug}`
   - Categories: `/blog/{category}`

### Data Flow

```
Content Files (MDX)
    ↓
gatsby-source-filesystem
    ↓
GraphQL Layer
    ↓
React Components
    ↓
Static HTML
```

## Project Structure

### Content Organization

```
content/
├── blog/           # Blog posts
│   ├── assets/     # Blog images
│   └── *.md        # Post files
├── books/          # Book reviews
│   ├── assets/     # Book covers
│   └── *.md        # Review files
├── projects/       # Project showcases
│   ├── assets/     # Project screenshots
│   └── *.md        # Project files
├── resumes/        # Resume content
└── tech_logos/     # Technology logos
```

### Component Hierarchy

```
src/
├── components/
│   ├── app/              # Core layout components
│   │   ├── Layout.jsx    # Main layout wrapper
│   │   ├── Navbar.jsx    # Top navigation
│   │   ├── Footer.jsx    # Site footer
│   │   └── SideNav.jsx   # Mobile navigation
│   ├── ProjectCard/      # Feature components
│   ├── PostCard/
│   ├── BookCard/
│   └── Seo/              # SEO metadata
├── pages/                # Route pages
├── templates/            # Dynamic page templates
├── theme/                # Theme-UI configuration
│   ├── theme.js          # Design tokens
│   └── components.js     # Component styles
└── hooks/                # Custom React hooks
```

## Page Generation Process

### Blog Posts (`gatsby-node.js:126-162`)

1. Query all MDX files in `content/blog/`
2. Filter out drafts (`draft: false`)
3. Create page for each post using `BlogPostPage.js` template
4. Generate slug from file path

### Projects (`gatsby-node.js:41-103`)

1. Query all MDX files in `content/projects/`
2. Include frontmatter with images and tech stack
3. Create page using `ProjectPage.js` template
4. Pass frontmatter as page context

### Categories (`gatsby-node.js:105-124`)

1. Extract distinct categories from blog posts
2. Create page for each category using `CategoryPage.js` template
3. Pass category as context for filtering

## Data Querying Strategy

### Static Queries
- Use `useStaticQuery` for reusable components
- Query data once at build time
- Example: Site metadata, navigation items

### Page Queries
- Use page-level GraphQL queries
- Automatically available as `data` prop
- Example: Individual blog posts, project details

## Build Process

1. **Source Nodes**: Read content files from filesystem
2. **Transform Nodes**: Convert MDX to queryable format
3. **Create Pages**: Generate static pages programmatically
4. **Build**: Compile React components to HTML
5. **Optimize**: Process images, minify assets
6. **Deploy**: Output to `public/` directory

## Performance Optimizations

### Image Handling
- **gatsby-plugin-image**: Optimized responsive images
- **gatsby-plugin-sharp**: Image transformations
- Lazy loading with blur-up placeholders

### Code Splitting
- Automatic route-based code splitting
- Dynamic imports for heavy components
- Vendor bundle separation

### SEO Features
- **gatsby-plugin-react-helmet**: Dynamic meta tags
- **gatsby-plugin-sitemap**: XML sitemap generation
- **gatsby-plugin-feed**: RSS feed for blog posts
- Open Graph Protocol support

## Security

### Content Security Policy
Configured in `gatsby-config.js:163-176`:
- Restricts script sources
- Controls image loading
- Limits frame embedding
- Font source restrictions

## Deployment Architecture

```
Git Repository (GitHub)
    ↓
Push to main branch
    ↓
Netlify Build
    ↓
gatsby build
    ↓
Deploy to CDN
```

### Build Configuration
- **Platform**: Netlify
- **Build Command**: `gatsby build`
- **Publish Directory**: `public`
- **Node Version**: 18+

## Key Design Decisions

### Why Gatsby?
- Static site performance
- Rich plugin ecosystem
- Built-in GraphQL layer
- Image optimization
- SEO capabilities

### Why Theme-UI?
- Constraint-based design system
- Theme provider for consistent styling
- Responsive design tokens
- Easy theme customization

### Why MDX?
- Mix Markdown with React components
- Interactive content capabilities
- Reusable component embedding
- Better developer experience

### Why File-Based Content?
- Version control for content
- Simple content management
- No database required
- Fast build times
- Easy content migration

## Future Considerations

### Potential Improvements
- TypeScript migration for type safety
- Component library extraction
- E2E testing with Playwright
- Content preview environment
- Analytics integration
- Search functionality
- Comments system

### Scalability
- Current architecture supports ~1000s of posts
- Build time scales linearly with content
- Consider incremental builds for larger sites
- Cache optimization for faster rebuilds
