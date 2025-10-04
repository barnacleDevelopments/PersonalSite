# Component Patterns

This guide documents the component patterns and conventions used throughout the portfolio site.

## Table of Contents
- [Component Structure](#component-structure)
- [Styling Patterns](#styling-patterns)
- [Common Patterns](#common-patterns)
- [Component Examples](#component-examples)
- [Testing Patterns](#testing-patterns)

## Component Structure

### File Organization

Components follow a feature-based folder structure:

```
src/components/
├── ComponentName/
│   ├── ComponentName.jsx       # Component implementation
│   ├── ComponentName.test.jsx  # Component tests
│   └── index.js                # (Optional) Barrel export
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard`, `PostCard`)
- **Files**: Match component name exactly
- **Props**: camelCase
- **Event Handlers**: `handle` prefix (e.g., `handleClick`)

## Styling Patterns

### Theme-UI JSX Pragma

All styled components use the Theme-UI JSX pragma:

```jsx
/** @jsx jsx */
import { jsx } from "theme-ui";
```

This enables the `sx` prop for inline theming.

### The `sx` Prop

The `sx` prop provides constraint-based styling with access to theme tokens:

```jsx
<Box
  sx={{
    color: "primary",          // References theme.colors.primary
    fontSize: 2,               // References theme.fontSizes[2]
    p: 3,                      // Padding from theme.space[3]
    bg: "white",              // Background color
    borderRadius: 10,         // Direct pixel value
  }}
/>
```

### Responsive Styling

Use array syntax for responsive values (mobile-first):

```jsx
sx={{
  flexDirection: [
    "column",      // Mobile
    "column",      // Tablet
    "column",      // Small desktop
    "row"          // Large desktop
  ],
  fontSize: [1, 2, 3, 4],  // Scales up with breakpoints
  padding: [1, 2, 3],       // Can use fewer values
}}
```

### Theme Variants

Use predefined variants for consistency:

```jsx
// Text variants
<Text variant="hero">Large heading</Text>
<Text variant="subheading1">Section heading</Text>
<Text variant="regular">Body text</Text>
<Text variant="small">Small text</Text>

// Button variants
<Button variant="primary">Primary action</Button>
<Button variant="secondary">Secondary action</Button>

// Link variants
<Link variant="nav">Navigation link</Link>
<Link variant="footer">Footer link</Link>

// Card variants
<Card variant="primary">Content card</Card>
```

### Theme Token Reference

Available in `src/theme/theme.js`:

```javascript
// Colors
colors: {
  primary: "#292E29",
  secondary: "#eeeeee",
  orange: "#FFA630",
  white: "#f5f5f5",
  blue: "#2A5F6A"
}

// Font Sizes
fontSizes: [
  "1rem",       // 0
  "1.125rem",   // 1
  "1.25rem",    // 2
  "1.5rem",     // 3
  "1.875rem",   // 4
  "2.875rem",   // 5
]

// Spacing (uses Tailwind preset)
space: [0, 4, 8, 16, 32, 64, 128, 256, 512]
```

## Common Patterns

### 1. Layout Components

**Pattern**: Structural components that arrange child components

**Location**: `src/components/app/`

**Example**: `Layout.jsx`

```jsx
/** @jsx jsx */
import { jsx, ThemeUIProvider } from "theme-ui";
import { MDXProvider } from "@mdx-js/react";

const Layout = ({ children }) => {
  return (
    <ThemeUIProvider theme={theme}>
      <MDXProvider components={components}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </MDXProvider>
    </ThemeUIProvider>
  );
};
```

**Key Features**:
- Wraps application in theme provider
- Provides MDX component mapping
- Consistent header/footer across pages

### 2. Card Components

**Pattern**: Reusable content containers with consistent styling

**Examples**: `ProjectCard`, `PostCard`, `BookCard`

**Structure**:
```jsx
const ProjectCard = ({ project }) => {
  return (
    <Card
      variant="primary"
      sx={{
        backgroundColor: "primary",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Flex sx={{ flexDirection: ["column", "row"] }}>
        <Box sx={{ padding: 3 }}>
          <Heading variant="subheading1">{project.title}</Heading>
          <Text variant="regular">{project.description}</Text>
          <Button variant="secondary">View</Button>
        </Box>
        <Box>
          <GatsbyImage image={getImage(project.image)} />
        </Box>
      </Flex>
    </Card>
  );
};
```

**Key Features**:
- Accept data object as prop
- Use Theme-UI Card component
- Responsive layout with Flex/Box
- GatsbyImage for optimized images
- Consistent button placement

### 3. Image Handling

**Pattern**: Use GatsbyImage for all dynamic images

```jsx
import { GatsbyImage, getImage } from "gatsby-plugin-image";

// In component
<GatsbyImage
  placeholder="blurred"           // Blur-up effect
  image={getImage(imageData)}     // Process image data
  alt="Descriptive alt text"      // Accessibility
/>
```

**Benefits**:
- Automatic responsive images
- Lazy loading
- Blur-up placeholders
- WebP conversion
- Performance optimization

### 4. Links and Navigation

**Pattern**: Use Theme-UI Link with Gatsby Link

```jsx
import { Link } from "theme-ui";

// Internal navigation
<Link href="/about" variant="nav">About</Link>

// External links
<Link href="https://example.com" target="_blank" rel="noopener noreferrer">
  External
</Link>
```

### 5. Form Components

**Pattern**: Controlled components with validation

```jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email().required(),
  message: yup.string().required(),
});

const ContactForm = () => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("email")} variant="primary" />
      <Button type="submit" variant="primary">Submit</Button>
    </form>
  );
};
```

### 6. SEO Component

**Pattern**: Reusable metadata component

```jsx
import { Helmet } from "react-helmet";

const Seo = ({ title, description, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  );
};
```

**Usage**:
```jsx
<Seo
  title="Page Title | Site Name"
  description="Page description"
  image="/path/to/image.jpg"
/>
```

## Component Examples

### Minimal Component Template

```jsx
/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Text } from "theme-ui";

const ComponentName = ({ data }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Text variant="regular">{data.content}</Text>
    </Box>
  );
};

export default ComponentName;
```

### Component with State

```jsx
/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";
import { Button, Box } from "theme-ui";

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Text>Count: {count}</Text>
      <Button
        variant="primary"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </Button>
    </Box>
  );
};

export default Counter;
```

### Component with GraphQL

```jsx
/** @jsx jsx */
import { jsx } from "theme-ui";
import { useStaticQuery, graphql } from "gatsby";

const SiteTitle = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return <Text>{data.site.siteMetadata.title}</Text>;
};
```

## Testing Patterns

### Basic Component Test

```jsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  it("renders without crashing", () => {
    render(<ComponentName />);
  });

  it("displays the correct text", () => {
    render(<ComponentName text="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Testing with Theme Provider

```jsx
import { ThemeUIProvider } from "theme-ui";
import theme from "../../theme/theme";

const renderWithTheme = (component) => {
  return render(
    <ThemeUIProvider theme={theme}>
      {component}
    </ThemeUIProvider>
  );
};

it("renders with theme", () => {
  renderWithTheme(<ComponentName />);
});
```

### Testing User Interactions

```jsx
import { render, screen, fireEvent } from "@testing-library/react";

it("handles click events", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByText("Click me"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Best Practices

### ✅ Do

- Use Theme-UI components (`Box`, `Flex`, `Text`, etc.)
- Reference theme tokens in `sx` prop
- Use responsive arrays for breakpoints
- Keep components small and focused
- Extract reusable logic to hooks
- Use meaningful prop names
- Provide default props where appropriate
- Add prop validation or TypeScript types

### ❌ Don't

- Mix CSS modules with Theme-UI
- Use inline styles outside `sx` prop
- Hardcode colors/sizes (use theme tokens)
- Create deeply nested components (>3 levels)
- Put business logic in presentation components
- Forget accessibility attributes
- Skip error boundaries for complex components

## Custom Hooks

### Location
`src/hooks/`

### Example: Window Hook

```jsx
// src/hooks/use-window.jsx
import { useState, useEffect } from "react";

export const useWindow = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
```

**Usage**:
```jsx
const { width } = useWindow();
const isMobile = width < 768;
```

## Accessibility Guidelines

- Always provide `alt` text for images
- Use semantic HTML elements (`nav`, `main`, `footer`)
- Ensure sufficient color contrast
- Support keyboard navigation
- Add ARIA labels where needed
- Test with screen readers

## Performance Tips

- Use `React.memo()` for expensive components
- Lazy load heavy components with `React.lazy()`
- Optimize images with GatsbyImage
- Avoid unnecessary re-renders
- Use `useMemo` and `useCallback` appropriately
- Keep bundle size small
