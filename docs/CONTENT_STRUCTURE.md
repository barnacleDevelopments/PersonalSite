# MDX Content Structure

This guide explains how to create and structure MDX content for blog posts, projects, and books.

## Table of Contents
- [What is MDX?](#what-is-mdx)
- [Content Types](#content-types)
- [Blog Posts](#blog-posts)
- [Projects](#projects)
- [Books](#books)
- [Images and Assets](#images-and-assets)
- [Custom Components](#custom-components)
- [Best Practices](#best-practices)

## What is MDX?

MDX allows you to write JSX (React components) directly in Markdown files. This enables:

- Interactive content with React components
- Importing and using custom components
- Accessing props passed from templates
- Rich, dynamic content experiences

## Content Types

The site supports three main content types:

```
content/
├── blog/           # Blog posts (.md, .mdx)
├── projects/       # Project showcases (.mdx)
├── books/          # Book reviews (.md, .mdx)
└── resumes/        # Resume content (.md)
```

## Blog Posts

### Location
`content/blog/`

### File Naming
Use kebab-case with descriptive names:
- ✅ `intro-to-prototypes.md`
- ✅ `deploy-express-app-to-kubernetes-on-azure.md`
- ❌ `post1.md`
- ❌ `My New Post.md`

### Frontmatter Schema

```yaml
---
title: "Your Post Title"                    # Required
date: 2025-01-01T15:13:45.129Z             # Required (ISO 8601 format)
category: "programming"                     # Required (lowercase)
thumbnail: assets/featured-image.png        # Optional
keywords: "javascript, react, tutorial"     # Optional (comma-separated)
draft: false                                # Required (true/false)
description: "Brief post description"       # Optional
---
```

### Example Blog Post

```markdown
---
title: Intro to JavaScript Prototypes
date: 2020-04-03T15:13:45.129Z
category: programming
thumbnail: assets/logo_2.png
keywords: javascript, prototypes, oop, inheritance
draft: false
---

## Introduction

Prototypes are a fundamental concept in JavaScript...

### Code Example

\`\`\`javascript
Array.prototype.customMethod = function() {
  return this.length;
};

const arr = [1, 2, 3];
arr.customMethod(); // 3
\`\`\`

## Conclusion

Understanding prototypes helps you write better JavaScript.
```

### Categories

Available categories (must match exactly):
- `programming`
- `web development`
- `devops`
- `career`

### Draft Status

- `draft: true` - Post won't appear on site
- `draft: false` - Post is published

## Projects

### Location
`content/projects/`

### File Naming
Use descriptive names with company/project prefix:
- `brewersinsight-planning-and-forecasting.mdx`
- `myboards-kanban-app.mdx`

### Frontmatter Schema

```yaml
---
title: "Project Name"                       # Required
image1: assets/screenshot-1.png             # Required
image2: assets/screenshot-2.png             # Optional
image3: assets/screenshot-3.png             # Optional
technologies:                               # Required (array)
  - name: "React"
    image: "../tech_logos/react.png"
  - name: "Node.js"
    image: "../tech_logos/nodejs.png"
URL: "https://example.com"                  # Optional
githubURL: "https://github.com/user/repo"  # Optional
startDate: 2024-01-01T12:13:10.205Z        # Required
endDate: 2024-12-31T12:13:10.205Z          # Optional
status: complete                            # Required (complete/in-progress)
keywords: "react, fullstack, web app"       # Optional
draft: false                                # Required
---
```

### Example Project File

```mdx
---
title: BrewersInsight - Planning and Forecasting
image1: assets/planning-1.png
image2: assets/planning-2.png
image3: assets/planning-3.png
technologies:
  - name: "Angular"
    image: "../tech_logos/angular.png"
  - name: "Azure Functions"
    image: "../tech_logos/azure-functions.png"
  - name: "CosmosDB"
    image: "../tech_logos/cosmos-db.png"
URL: "https://app.brewersinsight.com/"
startDate: 2024-01-01T12:13:10.205Z
status: complete
draft: false
---

<ProjectSection image={props.pageContext.frontmatter.image1} imageAlt={"Planning view"}>

## Overview

This feature helps brewers manage materials according to production plans.
The solution includes a Gantt chart for planning and a forecasting table
for material shortages.

</ProjectSection>

<ProjectSection image={props.pageContext.frontmatter.image2} imageAlt={"Forecasting view"} alignment="right">

## Tech Stack

Built with Angular, Azure Functions, CosmosDB, and MSSQL. The system
integrates with existing brewery management software to provide
real-time forecasting.

</ProjectSection>

<ProjectSection image={props.pageContext.frontmatter.image3} imageAlt={"Integration view"}>

## Features

- Gantt chart production planning
- Material shortage forecasting
- Real-time inventory integration
- Automated alerts for shortages

</ProjectSection>
```

### Technology Stack Array

Each technology requires:
```yaml
- name: "Technology Name"           # Display name
  image: "../tech_logos/logo.png"  # Path to logo
```

Available tech logos in `content/tech_logos/`:
- `azure.png`
- `react.png`
- `nodejs.png`
- `angular.png`
- `typescript.png`
- `postgresql.png`
- And many more...

## Books

### Location
`content/books/`

### Frontmatter Schema

```yaml
---
title: "Book Title"                         # Required
author: "Author Name"                       # Required
image: assets/book-cover.jpg                # Required
rating: 5                                   # Required (1-5)
dateRead: 2024-01-01T12:13:10.205Z         # Required
keywords: "technology, fiction, history"    # Optional
draft: false                                # Required
---
```

### Example Book Review

```markdown
---
title: "Sapiens: A Brief History of Humankind"
author: "Yuval Noah Harari"
image: assets/sapiens.jpg
rating: 5
dateRead: 2024-06-15T12:00:00.000Z
keywords: "history, anthropology, civilization"
draft: false
---

## Overview

Sapiens explores the history of humanity from the Stone Age to modern times...

## Key Takeaways

- The Cognitive Revolution enabled abstract thinking
- Agricultural Revolution changed human society
- Scientific Revolution accelerated progress

## Recommendation

Highly recommended for anyone interested in understanding human history
and societal development.
```

## Images and Assets

### Storage Location

Store assets relative to content:

```
content/
├── blog/
│   ├── my-post.md
│   └── assets/
│       ├── image1.jpg
│       └── image2.png
├── projects/
│   ├── my-project.mdx
│   └── assets/
│       └── screenshot.png
└── books/
    ├── my-book.md
    └── assets/
        └── cover.jpg
```

### Referencing Images

#### In Frontmatter
```yaml
# Relative to the content file
thumbnail: assets/image.jpg
image1: assets/screenshot-1.png

# Reference parent directory
image: "../tech_logos/react.png"
```

#### In Markdown
```markdown
![Alt text](assets/image.jpg)
```

#### In MDX with Components
```mdx
<ProjectSection image={props.pageContext.frontmatter.image1} imageAlt="Description">
  Content here...
</ProjectSection>
```

### Image Optimization

All images are automatically optimized by Gatsby:
- Responsive image generation
- WebP conversion
- Lazy loading
- Blur-up placeholders

### Supported Formats
- JPEG/JPG
- PNG
- WebP
- SVG (for icons/logos)

## Custom Components

### Available Components in MDX

Projects can use these custom components:

#### ProjectSection

```mdx
<ProjectSection
  image={props.pageContext.frontmatter.image1}
  imageAlt="Description"
  alignment="left"  // or "right"
>
  ## Section Title

  Content goes here...
</ProjectSection>
```

**Props:**
- `image`: Image data from frontmatter
- `imageAlt`: Alt text for accessibility
- `alignment`: "left" or "right" (default: "left")

### Accessing Frontmatter in MDX

Projects receive frontmatter via props:

```mdx
{props.pageContext.frontmatter.title}
{props.pageContext.frontmatter.image1}
{props.pageContext.frontmatter.technologies}
```

### Importing Components

You can import React components into MDX:

```mdx
import { Button } from "theme-ui"
import CustomComponent from "../components/CustomComponent"

<Button variant="primary">Click Me</Button>
<CustomComponent data={someData} />
```

## Code Blocks

### Syntax Highlighting

Use fenced code blocks with language specification:

````markdown
```javascript
const greeting = "Hello, World!";
console.log(greeting);
```

```typescript
interface User {
  name: string;
  age: number;
}
```

```bash
npm install gatsby
gatsby develop
```
````

### Supported Languages
- JavaScript/TypeScript
- Python
- Bash/Shell
- JSON
- YAML
- CSS/SCSS
- And many more via PrismJS

## Best Practices

### Writing Guidelines

✅ **Do:**
- Use descriptive, SEO-friendly titles
- Add relevant keywords
- Include high-quality images
- Write clear, concise descriptions
- Use proper heading hierarchy (H2 → H3 → H4)
- Add alt text for all images
- Keep frontmatter consistent

❌ **Don't:**
- Use generic titles like "New Post"
- Leave draft status as `true` for published content
- Use extremely large images (>2MB)
- Skip categories or important metadata
- Nest headings incorrectly (H2 → H4)
- Hardcode dates in content (use frontmatter)

### SEO Optimization

1. **Title**: Clear, descriptive, keyword-rich
2. **Description**: 150-160 characters
3. **Keywords**: 5-10 relevant terms
4. **Images**: Descriptive filenames and alt text
5. **Headings**: Proper hierarchy with keywords
6. **URL**: Generated from title (automatic)

### Content Organization

#### File Naming
```
✅ deploy-app-to-kubernetes.md
✅ intro-to-react-hooks.md
❌ post-1.md
❌ New Post.md
```

#### Asset Naming
```
✅ kubernetes-architecture-diagram.png
✅ react-component-lifecycle.jpg
❌ image1.png
❌ Screen Shot 2024-01-01.png
```

### Date Formatting

Always use ISO 8601 format:
```yaml
date: 2025-01-01T15:30:00.000Z
```

Generate in JavaScript:
```javascript
new Date().toISOString()
// "2025-01-01T15:30:00.000Z"
```

### Testing Content

Before publishing:

1. **Check draft status**: Set `draft: false`
2. **Validate frontmatter**: All required fields present
3. **Test images**: All images load correctly
4. **Review locally**: Run `gatsby develop` to preview
5. **Check links**: Verify all external links work
6. **Proofread**: Check for typos and formatting

### Creating New Content

#### Blog Post Template

```bash
# Create new blog post
touch content/blog/my-new-post.md
```

```markdown
---
title: "My New Post"
date: 2025-01-01T12:00:00.000Z
category: "programming"
thumbnail: assets/featured.jpg
keywords: "keyword1, keyword2"
draft: false
---

## Introduction

Your content here...
```

#### Project Template

```bash
# Create new project
touch content/projects/my-project.mdx
mkdir content/projects/assets
```

```mdx
---
title: "My Project"
image1: assets/screenshot-1.png
technologies:
  - name: "React"
    image: "../tech_logos/react.png"
startDate: 2024-01-01T12:00:00.000Z
status: complete
draft: false
---

<ProjectSection image={props.pageContext.frontmatter.image1} imageAlt="Main view">

## Project Description

Your content here...

</ProjectSection>
```

## Troubleshooting

### Common Issues

**Images not appearing:**
- Check file path is correct
- Ensure image is in `assets/` folder
- Verify image format is supported

**Content not showing:**
- Check `draft: false` in frontmatter
- Verify required frontmatter fields
- Rebuild with `gatsby clean && gatsby develop`

**Build errors:**
- Validate YAML frontmatter syntax
- Check for unclosed JSX tags in MDX
- Ensure all imported components exist

### GraphQL Debugging

Query content in GraphiQL:
```
http://localhost:8000/___graphql
```

Example query:
```graphql
{
  allMdx(filter: {internal: {contentFilePath: {regex: "/content/blog/"}}}) {
    edges {
      node {
        frontmatter {
          title
          date
          category
        }
        fields {
          slug
        }
      }
    }
  }
}
```
