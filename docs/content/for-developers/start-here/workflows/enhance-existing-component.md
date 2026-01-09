# Enhance Existing Component - Step-by-Step Workflow

Complete workflow for adding new features to existing components while preserving all current behavior.

## Step 1: Analyze Current Component (15 minutes)

1. **Open existing component files**:
   - Main wrapper: `src/components/{ComponentName}.tsx`
   - Implementation files: Check for sub-components or molecules
   - Type definitions: Look for `.type.ts` files
2. **Document current capabilities**:
   - List all existing parameters and their options
   - Note all current field types and rendering patterns  
   - Identify existing layout orientations/variants
   - Record current conditional logic patterns
3. **Test current functionality** to establish baseline

## Step 2: Analyze New Figma Designs (15 minutes)

1. **Review new Figma design variants** for the component
2. **Compare with existing capabilities** from Step 1
3. **Identify new features needed**:
   - New layout orientations
   - New show/hide options
   - New styling variants
   - New field types or interactions
4. **Plan integration strategy**: How new features work with existing ones

## Step 3: Update Component Documentation (10 minutes)

1. **Open existing documentation**: `docs/pages/library/components/{component-name}.md`
2. **Add new Figma URLs** for new design variants:
   ```markdown
   ## Figma Design References
   [Existing URLs...]
   https://www.figma.com/design/.../NewVariant?node-id=123-456
   ```
3. **Document new features** you plan to add:
   - New parameters and their options
   - New fields (if any)
   - New component behaviors
4. **Save documentation** - AI template will reference this

## Step 4: Update Sitecore Configuration (20 minutes)

### A. Add New Template Fields (if needed):
1. **Navigate to existing template**: `/sitecore/templates/Feature/FastLane/Components/{ComponentName}`
2. **Add new fields** identified in Step 2
3. **Set appropriate field types** and validation

### B. Update Rendering Parameters:
1. **Open rendering definition**: `/sitecore/layout/Renderings/Feature/FastLane/{ComponentName}`
2. **Go to Builder tab** → Controls section
3. **Add new parameters**:
   - For droplist: Add new options to existing droplists
   - For new parameters: Create new parameter fields
4. **Save changes**

## Step 5: Prepare Development Environment (5 minutes)

1. **Ensure `npm run dev` is running**
2. **Test existing component** still works in development
3. **Have documentation open** for reference during AI usage

## Step 6: Use AI Enhancement Template (10 minutes)

1. **Copy template**: Go to [Enhance Component Template](../../component-development/ai-prompts/templates/enhance-existing-component)
2. **Edit customization section only**:
   ```markdown
   **Component Name:** ContentCard
   **Component Documentation:** @content-card.md
   **Files to analyze:**
   - @ContentCard.tsx  (main wrapper)
   **New features to add:**
   1. verticalwide orientation option
   2. HideImage boolean parameter
   3. [Additional features from Step 2]
   ```
3. **Leave everything below `---` unchanged**
4. **Paste into AI assistant** and execute

## Step 7: Review Generated Changes (15 minutes)

1. **Check all modified files**: Verify changes are applied correctly
2. **Verify existing functionality preserved**:
   - All current parameters still work
   - All existing conditional logic intact
   - No breaking changes to interfaces
3. **Test TypeScript compilation**: Fix any errors
4. **Spot-check new features**: Basic functionality verification

## Step 8: Comprehensive Testing (20 minutes)

### A. Backward Compatibility Testing:
1. **Test existing content** without new parameters
2. **Test all existing parameter combinations**
3. **Verify existing responsive behavior unchanged**

### B. New Feature Testing:
1. **Test new parameters** in Experience Editor
2. **Test new feature combinations** with existing features
3. **Verify new Figma designs** match implementation

### C. Integration Testing:
1. **All page modes work** (edit/preview/normal)
2. **Field editing unchanged** for content authors
3. **No performance regression**

## Step 9: Final Validation (10 minutes)

1. **Code quality**: No TypeScript or linting errors
2. **Documentation**: Updated docs reflect all new features
3. **Accessibility**: New features meet accessibility standards
4. **Create test content**: Demonstrate new capabilities

---

**Total Time: ~1.75 hours**

**Success Criteria:**
- ✅ **Backward Compatible**: All existing functionality works exactly as before
- ✅ **New Features Work**: All new capabilities function as specified
- ✅ **Integration Success**: Sitecore parameters and fields work correctly
- ✅ **Quality Maintained**: No errors, performance maintained, accessibility preserved