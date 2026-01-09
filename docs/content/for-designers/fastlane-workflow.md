# Fastlane Workflow

This document describes a clear and practical workflow designed to manage and evolve the design system lifecycle, starting from the ShadCN base library, advancing through Fastlane customization, and resulting in client-specific deliveries. Every step is structured to be easy to understand and implement for anyone involved.

## System Architecture Overview

### 1.1 ShadCN Base Library (Source of Truth)
- Original, untouched component library—used only for receiving upstream updates.
- Maintained in versioned files (e.g., v1, v2).
- Updates are incorporated using Figmaʼs file or library swap feature; never edited directly.

### 1.2 Fastlane Core Accelerator
- Created by duplicating the most recent ShadCN base version.
- Serves as the stable, validated foundation for all internal improvements and client-specific work.
- Ongoing improvements and customizations branch out from here.

### 1.3 Branching Model
- **Fastlane Improvements Branch (Permanent)**
  - For ongoing internal upgrades, experimentation, and enhancements before merging into Fastlane main.
- **Client-Specific Branches (Temporary)**
  - Each client project gets its own branch for custom variables, components, and branding distinct to that project.

## Step-by-Step Workflow

### Step 1: Initial Setup
1. Duplicate the ShadCN base library (e.g., v1) as the Fastlane file.
2. Create a "Fastlane Improvements" branch for continuous system updates.

**Validation:** The base file remains a stable reference; active development is isolated in Fastlane.

### Step 2: System Improvements
1. Develop, test, and validate new features, fixes, and variants in the improvements branch.
2. Once changes are stable, selectively merge them into Fastlane main.

**Validation:** Ensures only tested updates become part of the working system.

### Step 3: Client Customizations
1. Create a dedicated client branch from Fastlane main for each new project.
2. Apply all client-specific changes (e.g., variables, components, styles) within this branch.
3. Present the branch for client review and approval.
4. Duplicate the branch and deliver as a standalone file to the client.

**Validation:** Keeps client work modular and separate from the core system.

### Step 4: Delivery and Feedback
1. Deliver the finalized file to the client.
2. Post-delivery, review the client branch for reusable improvements.
3. Merge valuable additions back into Fastlane improvements or main.
4. Archive or delete the client branch after project completion.

**Validation:** Leverages client work to improve the core system while maintaining clarity.

### Step 5: Updating from New ShadCN Versions
1. Receive new ShadCN version and publish in Figma.
2. Swap library in the ShadCN base and rename for clarity.
3. Compare updated base with Fastlane. Manually import necessary changes into the Fastlane Improvements branch.
4. Test and merge these updates into Fastlane main when ready.

**Validation:** Controlled updates avoid unintended breaking changes.

## File and Branch Structure

```
Design System Repository/
├── ShadCN Base v2 (Reference only; no edits)
│   └── Fastlane Main (Core working system; internal updates)
│       ├── Fastlane Improvements (Ongoing system enhancements)
│       └── client-ProjectA (Custom client work)
└── clientDeliverables (Final, isolated client files)
```

## Process Benefits
1. Controlled updates ensuring only approved changes reach clients.
2. Safe, isolated customization per client.
3. Continuous, safe experimentation without disrupting the main system.
4. Clear versioning and structured branching enabling scalability.
5. Ability to incorporate valuable client-driven improvements.

## Best Practices
1. Use clear, descriptive, versioned naming for files and branches.
2. Maintain concise changelogs for transparency and auditing.
3. Regularly review client branches for potential core enhancements.
4. Communicate updates and timelines clearly across the team.

## Near Future Improvements
1. **Visual Flow Diagram**
   - Swimlane or flowchart depicting "ShadCN → Improvements → Fastlane Main → Client Branch → Delivery."
2. **Version Changelog Template**
   - A shared table tracking version, date, summary of changes, and approver for quick visibility.
3. **Branch Naming Conventions**
   - Standardize names (e.g., improvement/v2-tokens, client/acme-redesign) for consistency and clarity.
4. **Quick Start Checklist**
   - A 3-5 item checklist for new team members: duplicate ShadCN, create improvements branch, create client branch, perform library swap.
5. **Automation & Tooling**
   - Explore Figma plugins (e.g., Library Audit) or scripts to validate library swaps, highlight overrides, and enforce token usage.
6. **Token-Driven Approach**
   - Investigate migrating to a shared token system (e.g., Style Dictionary or Token Studio for Figma) to manage theme overrides rather than separate branches, reducing duplication and manual merges.

