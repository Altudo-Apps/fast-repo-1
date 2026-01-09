# Global Styling Guide

# 🌐 Global Styling Guide
This document outlines the global styles that are consistently applied to components in the design system. These styles ensure visual harmony and maintain consistent spacing and coloring across the platform. These global styles are managed centrally through the main style file, ensuring consistent spacing and background themes across all components.

* * *

## 📏 Component Spacing
Component spacing is applied globally to control vertical alignment and breathing space between elements.

### 🔼 Top Spacing
Controls the **space above** the component.

**Option**

**Utility Class**

**Tailwind CSS**

Top Large Space

`.top-large-space`

`@apply mt-16;`

Top Medium Space

`.top-medium-space`

`@apply mt-10;`

Top Low Space

`.top-low-space`

`@apply mt-4;`

Top No Space

`.top-no-space`

`@apply mt-0;`

* * *

### 🔽 Bottom Spacing
Controls the **space below** the component.

**Option**

**Utility Class**

**Tailwind CSS**

Bottom Large Space

`.bottom-large-space`

`@apply mb-16;`

Bottom Medium Space

`.bottom-medium-space`

`@apply mb-10;`

Bottom Low Space

`.bottom-low-space`

`@apply mb-5;`

Bottom No Space

`.bottom-no-space`

`@apply mb-0;`

These classes can be used across components to control layout spacing responsively.

* * *

## 🎨 Background Color Options
Components can have their background colors customized using predefined theme variables. These are available as part of the styling options in the CMS.

### 🌞 Light Mode
**Style**

**CSS Variable**

**Hex Code**

Primary Background

`--primary`

`#0c4a6e`

Secondary Background

`--secondary`

`#e4e4e7`

Tertiary Background

`--accent`

`#f4f4f5`

* * *

### 🌚 Dark Mode
**Style**

**CSS Variable**

**Hex Code**

Primary Background

`--primary`

`#bae6fd`

Secondary Background

`--secondary`

`#0369a1`

Tertiary Background

`--accent`

`#075985`

* * *

## 🧩 Implementation Notes
*   These global styles are applied consistently across all components and layout elements.
    
*   The use of utility classes ensures reusability and easy maintenance.
    
*   Color variables adapt automatically based on light or dark mode, ensuring good contrast and readability.
