## ADDED Requirements

### Requirement: Sidebar Table of Contents

The blog system SHALL display a sidebar Table of Contents (TOC) for article pages on large screens.

#### Scenario: TOC displays on large screens
- **WHEN** a user views an article page on a screen width >= 1280px
- **AND** the article has 2 or more headings (h2-h4)
- **AND** `SITE.showToc` is enabled
- **AND** the article frontmatter does not have `hideToc: true`
- **THEN** a sidebar TOC SHALL be displayed on the right side of the article

#### Scenario: TOC hidden on small screens
- **WHEN** a user views an article page on a screen width < 1280px
- **THEN** the sidebar TOC SHALL NOT be displayed

#### Scenario: TOC hidden for short articles
- **WHEN** an article has fewer than 2 headings
- **THEN** the sidebar TOC SHALL NOT be displayed

#### Scenario: TOC disabled via frontmatter
- **WHEN** an article has `hideToc: true` in frontmatter
- **THEN** the sidebar TOC SHALL NOT be displayed for that article

### Requirement: TOC Current Section Highlighting

The TOC SHALL highlight the current reading section as the user scrolls through the article.

#### Scenario: Highlight updates on scroll
- **WHEN** a user scrolls through the article
- **AND** a heading enters the viewport
- **THEN** the corresponding TOC item SHALL be visually highlighted
- **AND** previously highlighted items SHALL be unhighlighted

### Requirement: TOC Click Navigation

The TOC SHALL support click-to-navigate functionality with smooth scrolling.

#### Scenario: Click TOC item to navigate
- **WHEN** a user clicks on a TOC item
- **THEN** the page SHALL smooth-scroll to the corresponding heading
- **AND** the URL hash SHALL be updated to reflect the heading anchor

### Requirement: TOC Configuration

The system SHALL provide configuration options to control TOC behavior.

#### Scenario: Global TOC toggle
- **WHEN** `SITE.showToc` is set to `false` in config
- **THEN** sidebar TOC SHALL NOT be displayed on any article page

#### Scenario: Per-article TOC toggle
- **WHEN** an article frontmatter contains `hideToc: true`
- **THEN** sidebar TOC SHALL NOT be displayed for that specific article
- **AND** other articles without this flag SHALL still display TOC (if enabled globally)
