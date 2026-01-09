# Create New Component - Step-by-Step Workflow

Complete workflow for creating new components from Figma designs with Sitecore integration.

## Step 1: Analyze Figma Designs (15 minutes)

1. **Open all Figma design variants** for your component
2. **Document required features** by creating a list:
   - Layout variations (vertical, horizontal, etc.)
   - Interactive elements (buttons, links, hover states)
   - Content types (text, images, rich text)
   - Responsive behavior patterns
3. **Identify required Sitecore fields**:
   - Title → Single-Line Text
   - Description → Rich Text  
   - Image → Image field
   - CTA → General Link
4. **Note required parameters**:
   - Layout options (droplist)
   - Show/hide toggles (checkboxes)
   - Styling variants (droplist)

## Step 2: Create Component Documentation (10 minutes)

1. **Create file**: `docs/pages/library/components/{component-name}.md`
2. **Add Figma URLs** to documentation:
   ```markdown
   ## Figma Design References
   https://www.figma.com/design/.../ComponentName?node-id=123-456
   https://www.figma.com/design/.../ComponentName?node-id=789-012
   ```
3. **Document fields and parameters** from Step 1 analysis
4. **Save file** - this will be referenced by the AI template

## Step 3: Configure Sitecore Template (20 minutes)

1. **Navigate to**: `/sitecore/templates/Feature/FastLane/Components/`
2. **Create new template**: `{ComponentName}`
3. **Add fields** identified in Step 1:
   - Right-click → Insert → Template Field
   - Set field name, type, and validation
   - Repeat for each field
4. **Save template**

## Step 4: Configure Sitecore Rendering (15 minutes)

1. **Navigate to**: `/sitecore/layout/Renderings/Feature/FastLane/`
2. **Create rendering definition**: `{ComponentName}`
3. **Link to template** created in Step 3
4. **Add rendering parameters** via Builder tab:
   - Create parameter template
   - Add each parameter from Step 1 analysis
   - Set droplist source values as needed
5. **Save rendering definition**

## Step 5: Prepare Development Environment (5 minutes)

1. **Start development server**: `npm run dev`
2. **Verify Figma MCP connection** (if using Figma designs)
3. **Confirm prerequisites** are complete from previous steps

## Step 6: Use AI Template (10 minutes)

1. **Copy template**: Go to [Create Component Template](../../component-development/ai-prompts/templates/create-component)
2. **Edit customization section only**:
   ```markdown
   **Component Name:** ProductCard
   **Component Documentation:** @product-card.md
   **Required Features:**
   - [List from Step 1]
   **Required Parameters:**  
   - [List from Step 1]
   **Required Fields:**
   - [List from Step 1]
   ```
3. **Leave everything below `---` unchanged**
4. **Paste into AI assistant** and execute

## Step 7: Save Generated Component (5 minutes)

1. **Save output** to `src/components/{ComponentName}.tsx`
2. **Verify TypeScript compilation**: Check for errors
3. **Confirm component-map.ts updated** automatically

## Step 8: Test Component (15 minutes)

1. **Functional testing**:
   - Component renders without errors
   - All parameters work in Experience Editor
   - All fields are editable
2. **Visual testing**:
   - Matches Figma designs
   - Responsive behavior correct
   - Interactive states work
3. **Sitecore testing**:
   - Component appears in toolbox
   - Fields editable in Content Editor
   - All page modes work (edit/preview/normal)

## Step 9: Final Validation (10 minutes)

1. **Code quality**: No TypeScript or linting errors
2. **Documentation**: Component docs are complete and accurate
3. **Test content**: Create sample content items for demonstration
4. **Accessibility**: Basic keyboard navigation and contrast validation

---

**Total Time: ~1.75 hours**

**Success Criteria:**
- ✅ Component renders all Figma design variants accurately
- ✅ All Sitecore parameters and fields function correctly  
- ✅ TypeScript compilation succeeds without errors
- ✅ Component works seamlessly in Experience Editor