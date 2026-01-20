## ADDED Requirements

### Requirement: View Source Link

The system SHALL provide a "View Source" link on article detail pages that opens the raw Markdown file in the GitHub repository (blob view, not edit mode).

#### Scenario: User clicks View Source link

- **WHEN** user clicks the "View Source" link on an article page
- **THEN** a new tab opens with the GitHub blob URL for the article's Markdown file
- **AND** the URL format is `https://github.com/{owner}/{repo}/blob/{branch}/{filePath}`

#### Scenario: View Source link visibility

- **WHEN** `SITE.viewSource.enabled` is `true`
- **THEN** the View Source link is displayed on the article page
- **WHEN** `SITE.viewSource.enabled` is `false`
- **THEN** the View Source link is hidden

### Requirement: CC License Declaration

The system SHALL display a Creative Commons license declaration (CC BY-NC-SA 4.0) at the bottom of each article's content area.

#### Scenario: License display position

- **WHEN** an article page is rendered
- **THEN** the CC license declaration appears after the article content
- **AND** before the share links section

#### Scenario: License content elements

- **WHEN** the license component is rendered
- **THEN** it displays:
  - The CC BY-NC-SA 4.0 license icon/badge
  - A brief license description in Chinese
  - A link to the full license text on Creative Commons website

#### Scenario: License visibility control

- **WHEN** `SITE.license.enabled` is `true`
- **THEN** the license declaration is displayed
- **WHEN** `SITE.license.enabled` is `false`
- **THEN** the license declaration is hidden

### Requirement: Configuration Options

The system SHALL provide configuration options in `src/config.ts` for View Source and License features.

#### Scenario: viewSource configuration

- **WHEN** configuring the View Source feature
- **THEN** the following options are available:
  - `enabled`: boolean to show/hide the link
  - `text`: display text for the link (default: "查看原文")
  - `url`: base URL for the repository blob path

#### Scenario: license configuration

- **WHEN** configuring the License feature
- **THEN** the following options are available:
  - `enabled`: boolean to show/hide the license
  - `type`: license type identifier (e.g., "CC BY-NC-SA 4.0")
  - `url`: URL to the full license text
