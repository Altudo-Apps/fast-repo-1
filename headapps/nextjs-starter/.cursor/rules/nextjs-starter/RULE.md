---
alwaysApply: true
---

# Next.js Starter Rules

You are working in the `headapps/nextjs-starter` directory. These rules must be followed for all changes in this project.

1.  **Storybook Requirement**: 
    - Any new component created in `src/components/` MUST have a corresponding story file in `src/stories/`.
    - Ensure stories cover various states of the component.

2.  **Test Coverage**: 
    - Any new component MUST have at least 80% test coverage.
    - Write unit tests using the project's testing framework (e.g., Vitest/Jest and React Testing Library).

3.  **Component Structure**:
    - `src/components/`: Use this directory ONLY for Sitecore components (components that map to Sitecore renderings).
    - `src/core/`: Use this directory for the atomic structure. Create generic UI components (atoms, molecules, organisms) here.
    - Do not create non-Sitecore components in `src/components/`.

4.  **Type Safety**: 
    - The usage of the `any` type is STRICTLY FORBIDDEN. 
    - Always define and use proper TypeScript types and interfaces.
    - Use specific types for props, state, and event handlers.

5.  **Sitecore XM Cloud & Next.js Best Practices**:
    -   **Field Helpers**: Always use Sitecore JSS field helper components (`Text`, `RichText`, `Image`, `Link`, `Date`, etc.) from `@sitecore-jss/sitecore-jss-nextjs` for rendering content. This ensures full support for inline editing in Sitecore Pages/Experience Editor.
    -   **Datasource Handling**: Use `withDatasourceCheck` for components that strictly require a datasource to prevent rendering empty components.
    -   **Component Props**: Define component props extending `ComponentProps` with the specific fields interface. Example: `type MyComponentProps = ComponentProps & { fields: MyComponentFields }`.
    -   **Placeholders**: Use the `Placeholder` component from `@sitecore-jss/sitecore-jss-nextjs` to support nested Sitecore renderings. Name placeholders semantically (e.g., `headless-main`, `headless-header`).
    -   **Styling**: We can use only Tailwind CSS for styling to maintain component isolation.
    -   **Dictionary/Translations**: Use the `useI18n` hook or `Text` helper for static labels to ensure they are translatable via the Sitecore Dictionary Service.

6.  **Client-Side Data Fetching**:
    -   **React Query**: Use TanStack React Query for all client-side data fetching operations.
    -   **No useEffect for Fetching**: Avoid using `useEffect` for data fetching logic.
    -   **Custom Hooks**: Encapsulate data fetching logic and queries within custom hooks (e.g., `useMyData`).
    -   **Query Keys**: Use consistent and structured query keys (arrays) for proper caching and invalidation strategies.
