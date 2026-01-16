# Blog Architecture Specification

## ADDED Requirements

### Requirement: Astro Framework
The blog system SHALL use Astro 5.x as the static site generator to achieve optimal performance, type safety, and modern development experience.

#### Scenario: Astro Version Compliance
- **WHEN** checking the blog's technology stack
- **THEN** Astro version MUST be 5.x or higher
- **AND** the project MUST use TypeScript configuration

#### Scenario: Build Performance
- **WHEN** running `astro build` command
- **THEN** the build process MUST complete without errors
- **AND** generated pages MUST have minimal JavaScript by default (0 JS principle)

#### Scenario: Content Collections
- **WHEN** managing blog content
- **THEN** articles MUST be stored in `src/data/blog/` directory
- **AND** content MUST be validated through Zod schema in `content.config.ts`
- **AND** frontmatter type errors MUST be caught at build time

### Requirement: AstroPaper Theme
The blog system SHALL use AstroPaper theme to provide a minimal, accessible, and SEO-friendly design with built-in features.

#### Scenario: Theme Feature Completeness
- **WHEN** viewing the blog
- **THEN** the layout MUST be responsive and adapt to screen sizes
- **AND** dark mode toggle MUST be available
- **AND** accessibility MUST meet WCAG 2.1 AA standards

#### Scenario: Built-in Features
- **WHEN** using the blog
- **THEN** Pagefind search MUST be functional
- **AND** RSS feed MUST be auto-generated
- **AND** sitemap MUST be auto-generated
- **AND** Open Graph meta tags MUST be included

### Requirement: AstroPaper Frontmatter Schema
The blog system SHALL enforce a consistent frontmatter schema for all blog posts using Zod validation.

#### Scenario: Required Frontmatter Fields
- **WHEN** creating a new blog post
- **THEN** the frontmatter MUST include:
  - `title`: string (required)
  - `author`: string (required)
  - `pubDatetime`: ISO 8601 datetime (required)
  - `slug`: string (optional, derived from filename if not provided)
  - `featured`: boolean (default: false)
  - `draft`: boolean (default: false)
  - `tags`: array of strings (required, at least one)
  - `description`: string (required, for SEO)

#### Scenario: Frontmatter Validation
- **WHEN** building the blog
- **THEN** invalid frontmatter MUST cause build failure
- **AND** error messages MUST clearly indicate which field is invalid

### Requirement: GitHub Actions CI/CD
The blog system SHALL use GitHub Actions as the sole CI/CD platform for building and deploying the blog.

#### Scenario: Automated Deployment
- **WHEN** pushing changes to the main branch
- **THEN** GitHub Actions MUST automatically trigger the build workflow
- **AND** successful builds MUST deploy to GitHub Pages automatically
- **AND** the workflow MUST use `withastro/action@v3` for optimal build

#### Scenario: CI Configuration Cleanup
- **WHEN** reviewing the repository structure
- **THEN** only `.github/workflows/` SHOULD contain CI configuration
- **AND** Drone, GitLab CI, and Jenkins configurations MUST be removed

### Requirement: URL Redirection
The blog system SHALL maintain backward compatibility with old Hexo URLs through 301 redirects.

#### Scenario: Old URL Handling
- **WHEN** accessing an old Hexo URL (e.g., `/2018/08/20/article-name.html`)
- **THEN** the system MUST return a 301 redirect
- **AND** the redirect MUST point to the new Astro URL (e.g., `/posts/article-name/`)

#### Scenario: Redirect Configuration
- **WHEN** deploying the blog
- **THEN** redirects MUST be configured in `public/_redirects`
- **AND** all preserved articles MUST have corresponding redirect rules

### Requirement: Performance Standards
The blog system SHALL achieve Lighthouse scores of 95 or higher in all categories.

#### Scenario: Performance Metrics
- **WHEN** running Lighthouse audit on the blog
- **THEN** the Performance score MUST be >= 95
- **AND** the Accessibility score MUST be >= 95
- **AND** the Best Practices score MUST be >= 95
- **AND** the SEO score MUST be >= 95

#### Scenario: Zero JavaScript by Default
- **WHEN** loading blog pages
- **THEN** pages MUST ship with 0 JavaScript by default
- **AND** JavaScript MUST only be loaded for interactive components (search, theme toggle)

## REMOVED Requirements

### Requirement: Hexo Framework
**Reason**: Hexo 3.9.0 is outdated (released 2019), lacks type safety, and has declining ecosystem activity. Astro provides better performance, TypeScript support, and modern developer experience.

**Migration**: Complete migration from Hexo to Astro. All Markdown content will be migrated with frontmatter conversion.

### Requirement: NexT Theme
**Reason**: NexT 7.0.0 is outdated and requires separate upgrade path. AstroPaper provides modern, minimal design with better accessibility and built-in features.

**Migration**: Theme configuration will be completely replaced. Custom styles need to be re-implemented in AstroPaper's system.

### Requirement: Multi-Platform CI/CD
**Reason**: Maintaining multiple CI/CD platforms (Drone, GitLab CI, Jenkins) increases complexity without benefits for a personal blog.

**Migration**: All workflows consolidated into GitHub Actions using official Astro action.

### Requirement: LeanCloud Services
**Reason**: LeanCloud Counter and comments depend on external services with potential availability issues.

**Migration**:
- Comments: Migrate to Giscus (GitHub Discussions based)
- Counter: Remove or optionally migrate to Umami

### Requirement: Coding Pages Deployment
**Reason**: Dual deployment adds complexity without significant benefit.

**Migration**: Focus on GitHub Pages. Users in China can use CDN acceleration if needed.

### Requirement: Hexo URL Structure
**Reason**: The old URL structure (`/:year/:month/:day/:title.html`) is verbose. Astro/AstroPaper uses cleaner URLs (`/posts/:slug/`).

**Migration**: All old URLs will be 301 redirected to new URLs to maintain SEO and prevent broken links.
