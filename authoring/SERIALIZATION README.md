# Serialization Structure Readme for XM Cloud FastLane Project

This document outlines the serialization structure used in the XM Cloud FastLane project to help authors maintain consistency when creating new components. The structure is organized under the `authoring/items` directory, following Sitecore's serialization conventions for Feature, Foundation, and Project layers.

## Directory Structure

The serialization structure is organized as follows:

```
authoring
└── items
    ├── Feature
    │   └── FastLaneWebsite
    │       ├── Accordion
    │       │   └── Feature.FastLaneWebsite.Accordion.module.json
    │       ├── Banner
    │       │   └── Feature.FastLaneWebsite.Banner.module.json
    │       ├── Breadcrumb
    │       │   └── Feature.FastLaneWebsite.Breadcrumb.module.json
    │       ├── SocialLinks
    │       │   └── Feature.FastLaneWebsite.SocialLinks.module.json
    │       ├── Root
    │       │   └── Feature.FastLaneWebsite.Root.module.json
    │       └── [NewComponent]
    │           └── Feature.FastLaneWebsite.[NewComponent].module.json
    ├── Foundation
    │   └── Foundation.module.json
    └── Project
        ├── FastLaneTenant
        │   └── Project.FastLaneTenant.module.json
        └── FastLaneWebsite
            └── Project.FastLaneWebsite.module.json
```

## Guidelines for Creating New Components

To ensure consistency when adding new components to the FastLane project, follow these steps:

1. **Feature Layer for Components**:
   - All component-specific serialization files are placed under `authoring/items/Feature/FastLaneWebsite/`.
   - Each component (e.g., Accordion, Banner, SocialLinks) has its own folder named after the component.
   - Inside the component folder, create a JSON module file named `Feature.FastLaneWebsite.[ComponentName].module.json`.
     - Example: For a new component "Carousel," create:
       ```
       authoring/items/Feature/FastLaneWebsite/Carousel/Feature.FastLaneWebsite.Carousel.module.json
       ```
   - The `Feature.FastLaneWebsite.Root.module.json` file defines shared configurations for the Feature layer, such as common templates, layouts, renderings, placeholders, media, and settings. It uses rules to exclude component-specific items (e.g., Accordion, Banner) to avoid duplication.

2. **Module File Structure**:
   - The module file should follow the Sitecore serialization schema (refer to `ModuleFile.schema.json`).
   - Include the following key sections:
     - `"namespace"`: Set to `Feature.FastLaneWebsite.[ComponentName]` (e.g., `Feature.FastLaneWebsite.Carousel`).
     - `"references"`: Reference dependencies, typically `Feature.FastLaneWebsite.Root` for shared configurations.
     - `"items"`: Define the paths for templates, renderings, rendering parameters, placeholders, branches, settings, etc., under the appropriate Sitecore paths (e.g., `/sitecore/templates/Feature/FastLaneWebsite/[ComponentName]`).
   - Example structure based on `Feature.FastLaneWebsite.Tabs.module.json`:
     ```json
{
    "$schema": "../../../../../.sitecore/schemas/ModuleFile.schema.json",
    "namespace": "Feature.FastLaneWebsite.Tabs",
    "references": ["Feature.FastLaneWebsite.Root"],
    "items": {
        "path": "Tabs",
        "includes": [
			{
                "name": "branches",
                "path": "/sitecore/templates/Branches/Feature/FastLaneWebsite/Default Variants/Tabs"
            },
            {
                "name": "templates",
                "path": "/sitecore/templates/Feature/FastLaneWebsite/Renderings/Tabs"
            },            
            {
                "name": "renderings",
                "path": "/sitecore/layout/Renderings/Feature/FastLaneWebsite/Renderings/Tabs"
            },
            {
                "name": "placeholders",
                "path": "/sitecore/layout/Placeholder Settings/Feature/FastLaneWebsite/Tabs"
            },
			{
                "name": "settings",
                "path": "/sitecore/system/Settings/Feature/FastLaneWebsite/Renderings/Tabs"
            }
        ]
    }
}     ```

3. **Root Module in Feature Layer**:
   - The `Feature.FastLaneWebsite.Root.module.json` file manages shared configurations for all Feature components.
   - It includes:
     - **Templates**: `/sitecore/templates/Feature/FastLaneWebsite`
       - Rules: Ignores component-specific templates (e.g., `/Accordion`, `/Banner`, `/SocialLinks`) to prevent duplication.
     - **Branches**: `/sitecore/templates/Branches/Feature/FastLaneWebsite`
       - Rules: Ignores component-specific branch templates (e.g., `/Default Accordion Variant`).
     - **Layout**: `/sitecore/layout/Layouts/Feature/FastLaneWebsite`
     - **Renderings**: `/sitecore/layout/Renderings/Feature/FastLaneWebsite`
       - Rules: Ignores component-specific renderings (e.g., `/Accordion`, `/SocialLinks`).
     - **Placeholders**: `/sitecore/layout/Placeholder Settings/Feature/FastLaneWebsite`
     - **Media**: `/sitecore/media library/Feature/FastLaneWebsite`
     - **Settings**: `/sitecore/system/Settings/Feature/FastLaneWebsite/FastLaneWebsite Headless Site Setup`
       - Rules: Ignores component-specific settings (e.g., `/Add Accordions Data Item`, `/Rendering Variants/SocialLinks`).
   - When creating a new component, ensure its specific items are not included in the Root module by adding appropriate `ignored` rules.

4. **Foundation Layer**:
   - The `Foundation` layer is defined in `authoring/items/Foundation/Foundation.module.json` and contains shared, reusable configurations.
   - It includes:
     - **Languages**:
       - Path: `/sitecore/system/Languages`
       - Scope: `descendantsOnly` (serializes all language items except the root)
       - Rule: Excludes the `/en` language item (ignored during serialization)
     - **Content**:
       - Path: `/sitecore/content`
       - Scope: `singleItem` (serializes only the content root item)
       - Allowed Push Operations: `createAndUpdate` (allows creating and updating the content root)
   - Component authors should not modify the Foundation layer unless adding shared configurations that apply across all components (e.g., new global templates or settings).

5. **Project Layer**:
   - The `Project` layer (`authoring/items/Project`) contains tenant- and website-specific configurations under `FastLaneTenant` and `FastLaneWebsite`.
   - **FastLaneTenant** (`Project.FastLaneTenant.module.json`):
     - Namespace: `Project.FastLaneTenant`
     - References: `Foundation`
     - Includes:
       - **Settings**: `/sitecore/system/settings/Project/FastLaneTenant`
       - **Templates**: `/sitecore/templates/Project/FastLaneTenant`
       - **Branches**: `/sitecore/templates/Branches/Project/FastLaneTenant`
       - **Media**: `/sitecore/Media Library/Project/FastLaneTenant`
         - Rules: Serializes only the `/shared` folder as a single item with `CreateOnly` push operations; other items are ignored.
       - **Renderings**: `/sitecore/layout/Renderings/Project/FastLaneTenant`
       - **Placeholders**: `/sitecore/layout/Placeholder Settings/Project/FastLaneTenant`
       - **Workflows**: `/sitecore/system/Workflows`
         - Rules: Serializes `Datasource Workflow` and `Page Workflow` with descendants; other workflows are ignored.
       - **Content**: `/sitecore/content/FastLaneTenant` (single item)
   - **FastLaneWebsite** (`Project.FastLaneWebsite.module.json`):
     - Namespace: `Project.FastLaneWebsite`
     - References: `Project.FastLaneTenant`
     - Includes:
       - **Templates**: `/sitecore/Templates/Project/FastLaneWebsite`
         - Rules: Allows `CreateUpdateAndDelete` for all items and descendants.
       - **Media**: `/sitecore/Media Library/Project/FastLaneTenant/FastLaneWebsite`
         - Rules: Allows `CreateUpdateAndDelete` for all items and descendants.
       - **Site**: `/sitecore/content/FastLaneTenant/FastLaneWebsite`
         - Rules: Serializes specific folders (`/home`, `/Media`, `/Data`, `/Dictionary`, `/Presentation`, `/Settings/Site Grouping`, `/Settings`) with descendants; other items are ignored.
   - Component authors typically do not modify the Project layer unless integrating tenant-wide settings, website-specific content, or adding new templates/renderings under the respective paths.

6. **Best Practices**:
   - **Unique Naming**: Ensure the component name is unique to avoid conflicts (e.g., avoid reusing "Accordion", "Banner", or "SocialLinks").
   - **Consistent Paths**: Align Sitecore paths with the component name (e.g., `/sitecore/templates/Feature/FastLaneWebsite/Carousel` for templates).
   - **Reference Existing Components**: Review existing module files (e.g., `Feature.FastLaneWebsite.SocialLinks.module.json`) for examples of paths and configurations, such as including branches or rendering variants.
   - **Serialization Rules**: Use `scope` (e.g., `singleItem`) and `rules` (e.g., `ignored`) appropriately to control serialization behavior, as seen in the Root and Project modules.
   - **Update Root Module**: When adding a new component, update `Feature.FastLaneWebsite.Root.module.json` to include `ignored` rules for the new component's templates, renderings, branches, and settings to prevent duplication.
   - **Validation**: Validate the module file against the Sitecore schema to ensure it is correctly formatted.

7. **Serialization for Sub-Components**:
   - If a component has sub-components or related items (e.g., "Tabs" within "Tab"), include them in the same module file under the `includes` section with appropriate paths.
     - Example: For a "Tabs" sub-component under "Tab":
       ```json
       {
           "name": "tabs-templates",
           "path": "/sitecore/templates/Feature/FastLaneWebsite/Tab/Tabs"
       }
       ```

## Notes
- Example Commands: 
 1. "Feature Accordion" Pull from Sitecore Cloud in DEMO environment.
  dotnet sitecore ser pull -i "Feature.FastLaneWebsite.Accordion" -n "demo"
 2. Install or Push "Feature Accordion" changes from Local to Sitecore Cloud in DEMO environment.
  dotnet sitecore ser push -i "Feature.FastLaneWebsite.Accordion" -n "demo"
- Always test serialization changes using Sitecore's serialization tools (e.g., `sitecore ser` commands) to ensure items are correctly serialized and deserialized.
- The Root module's `ignored` rules and the Project layer's specific scopes (e.g., `CreateOnly` for shared media, `ItemAndDescendants` for website content) ensure controlled serialization. Be cautious when modifying these files to avoid unintended serialization of excluded items.
- Reference [Serialization](https://doc.sitecore.com/xmc/en/developers/xm-cloud/serialization.html) or existing component module files in the project.

By adhering to this structure, developers and authors can ensure new components integrate seamlessly into the FastLane project while maintaining consistency and scalability.