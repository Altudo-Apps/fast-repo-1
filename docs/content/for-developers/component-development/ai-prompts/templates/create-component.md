# Create {ComponentName} Component from Figma Design

## CUSTOMIZATION SECTION - EDIT THESE VALUES

**Component Name:** {ComponentName}
**Component Documentation:** @{component-name}.md
**File Location:** `src/components/{ComponentName}.tsx`

**Required Features:**
- [Feature 1 description]
- [Feature 2 description] 
- [Additional features as needed]

**Required Parameters:**
- [Parameter 1: Type and description]
- [Parameter 2: Type and description]
- [Additional parameters as needed]

**Required Fields:**
- [Field 1: Field type and description]
- [Field 2: Field type and description] 
- [Additional fields as needed]

---

## COMPONENT CREATION TASK - READ FIRST
You are creating a NEW {ComponentName} component from scratch based on Figma designs.

CRITICAL: Ensure ALL Figma variants are accounted for in all of the options available
CRITICAL: FIRST!!!! use the Figma MCP Server to explore the designs. The Figma Design Reference links are in the {ComponentName} documentation above
CRITICAL: For each Figma URL, execute the figma mcp server tool get_code

IMPORTANT: The expectation is that the developer is running `npm run dev` while this prompt is being executed - as such - the `component-map.ts` file will get generated automatically once you complete generating the new component.

Create a production-ready component using the requirements specified in the customization section above.

CRITICAL: Follow guidelines @core-requirements.md documentation.
CRITICAL: Reference the component documentation above for all business logic, field definitions, and Figma design links.
