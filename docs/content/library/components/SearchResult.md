# Search Results Component

## Overview
A blank rendering component that acts as a container for search widget components.

## Component Location
- **File Path**: `headapps/nextjs-starter/src/components/SearchResults.tsx`

## Purpose
This is a page-level container component where the SearchInput template and related search widget components are integrated. It serves as a blank canvas for composing the complete search functionality.

## Key Responsibility
- Acts as a container for search widget components
- Manages view mode state (grid/list)
- Renders the SearchResultsInput widget

## Main Child Component
- **SearchResultsInput Widget**: [Search Input Component Documentation](../search/search-input-template-prompt.md)

## What It Contains
This component integrates multiple search widget components including:
- Search input with button
- Search results display (grid/list views)
- Search facets
- Pagination
- Sort order controls
- Card view switcher
- Query results summary

All search functionality is delegated to the SearchResultsInput widget component.
