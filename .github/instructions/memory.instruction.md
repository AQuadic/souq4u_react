---
applyTo: "**"
---

# User Memory

## User Preferences

- Programming languages: javascript/ typescript/ next js
- Code style preferences: prettier
- Development environment: vs code
- Communication style: concise

## Project Context

- Current project type: web app (React + Vite + TypeScript)
- Tech stack: React, react-router, react-query (@tanstack/react-query), axios, i18n
- Key requirements: product listing filters and URL-driven behavior

## Coding Patterns

- Prefer URL query parameters to control product listing filters
- Use React Query for data fetching and caching

## Context7 Research History

- (empty)

## Conversation History

- Task: Fix removal of "lapel" (chip) for most-viewed / only-discount filters so closing the chip redirects to the full products listing and API queries respect query params.
- Files edited: src/features/products/components/product-listing/ProductsGrid.tsx

- Task: Use API image in notifications list and dropdown, fall back to local logo when missing.
- Files edited: src/shared/components/layout/header/notifications/NotificationDropdown.tsx, src/features/notifications/NotificationsPage.tsx

## Notes

- When user clicks "View All" from home sections, links use `/products?is_most_view=true` and `/products?only_discount=1`.
- ProductsGrid previously didn't forward `is_most_view` or `only_discount` correctly to the API. Removal handlers preserved other params; updated to navigate to `/products`.
- Notifications: updated both dropdown and notifications page to use `notification.image?.url` with `/logo.png` fallback; alt attributes set to notification title when available.
