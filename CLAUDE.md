# Project Guidelines

## Internationalization (i18n)

This site supports English and French. When making any changes that involve user-facing text:

- Add translations to both `locales/en/` and `locales/fr/` JSON files
- Use `useTranslation` from `gatsby-plugin-react-i18next` and `t()` calls instead of hardcoded strings
- Shared translations (used across multiple pages/components) go in `common.json`
- Page-specific translations go in their respective namespace file (e.g., `projects.json`, `index.json`)
