# Sitecore Component Prerequisites Guide

## 🎯 Purpose

**Complete this Sitecore setup BEFORE using AI prompts to generate or enhance components.** 

This guide ensures all Sitecore infrastructure is ready, preventing failed AI generations and integration issues.

## 🛠️ Development Environment Setup

### Prerequisites
- Node.js (version specified in `.nvmrc`)
- Git
- A code editor (VS Code or Cursor recommended)

### Quick Setup

1. **Clone the FastLane repository**
   ```bash
   git clone https://github.com/altudo-dev/xmc-fast-lane.git
   cd xmc-fast-lane
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Configuration

Follow [Sitecore's official guide](https://doc.sitecore.com/xmc/en/developers/xm-cloud/get-the-environment-variables-for-a-site.html) to configure your `.env.local` file with:

- Sitecore XM Cloud connection details
- Content SDK configuration
- Local development settings

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage
npm run lint             # Run ESLint
npm run bootstrap        # Initialize project after clone
```

### Troubleshooting

**Common Issues:**
1. **Build fails** - Ensure all dependencies are installed: `npm install`
2. **Environment variables not working** - Check `.env.local` file exists and restart dev server
3. **Sitecore serialization issues** - Verify Sitecore CLI is installed and authenticated

## 📋 Workflow Types & Prerequisites

### **🆕 New Component Creation**
Complete Sitecore setup for brand new components:

#### Data Template Setup
1. **Navigate to:** `/sitecore/templates/Feature/[YourFeature]/`
2. **Create new template** based on component requirements
3. **Add field sections** with proper field types:
   ```
   Content Fields:
   ├── Title (Single-Line Text)
   ├── Description (Rich Text)  
   ├── Image (Image)
   └── CallToAction (General Link)
   ```
4. **Configure field validation** and help text
5. **Set Standard Values** with default content

#### Rendering Parameters Template
1. **Navigate to:** `/sitecore/templates/Feature/[YourFeature]/Renderings/[ComponentName]/`
2. **Create "Rendering Parameters" template**
3. **Use Builder tab** to add parameter fields:
   ```
   Layout Parameters:
   ├── Orientation (Droplist) → Source: query:/sitecore/system/Settings/Project/FastLane/RenderingParameterSettings/Orientation/*
   ├── ImageOrder (Droplist)
   └── HeaderTag (Droplist)
   
   Display Options:
   ├── HideImage (Checkbox)
   ├── HideBorder (Checkbox)
   └── CustomStyling (Single-Line Text)
   ```

#### Parameter Settings (For Droplist Options)
1. **Navigate to:** `/sitecore/system/Settings/Project/FastLane/RenderingParameterSettings/`
2. **Create parameter option containers** (if they don't exist)
3. **Add individual option items** using appropriate templates:
   ```
   CardOrientation/
   ├── vertical (Name: vertical)
   ├── horizontal (Name: horizontal)
   └── wide (Name: wide)
   ```

#### Rendering Item Configuration
1. **Navigate to:** `/sitecore/layout/Renderings/Feature/[YourFeature]/`
2. **Create rendering item** with:
   - **Component Name:** Exact match to TypeScript component file
   - **Parameters Template:** Link to rendering parameters template
   - **Datasource Template:** Link to component data template
   - **Datasource Location:** Default content location

---

### **🔧 Existing Component Enhancement**
Add new features to existing components:

#### Add New Template Fields
1. **Open existing data template** in Content Editor
2. **Click "Builder" tab** (not Content tab)
3. **Add new fields** to appropriate sections:
   ```
   Right-click section → Insert New Field
   ├── Field Name: NewFeatureField
   ├── Type: [Checkbox|Single-Line Text|Image|etc.]
   ├── Title: Display Name
   └── Help Text: Field description
   ```

#### Add New Rendering Parameters
1. **Open rendering parameters template** in Content Editor
2. **Builder tab → Add new parameter fields**:
   ```
   Parameter Fields:
   ├── HideNewFeature (Checkbox)
   ├── NewOrientation (Droplist)
   └── CustomOption (Single-Line Text)
   ```

#### Create New Parameter Options (For Droplist Fields)
1. **Navigate to parameter settings location**
2. **Right-click parameter folder**
3. **Insert → Insert from template**:
   ```
   Select: /sitecore/templates/Project/FastLane/General Components/[ParameterType]/[ParameterType]
   Name: newoptionvalue
   Set Name field: newoptionvalue
   ```

#### Update Existing Rendering Item
1. **Review rendering configuration** for any needed updates
2. **Verify parameter template** reference is still correct
3. **Test parameter inheritance** in Experience Editor

---

### **📊 GraphQL List Component Setup**
For components that use Sitecore Component GraphQL:

#### GraphQL Query Development
1. **Open Sitecore GraphQL Playground** (usually at `/sitecore/api/graphql/playground`)
2. **Write and test query** to fetch your data:
   ```graphql
   query FeaturedArticles {
     search(where: { template: "Article" }, first: 4) {
       results {
         id
         title { value }
         image { src alt }
         description { value }
       }
     }
   }
   ```
3. **Test query thoroughly** - verify data structure and performance
4. **Copy final working query**

#### Component GraphQL Configuration
1. **Create rendering item** for your list component
2. **Navigate to rendering item** in Content Editor
3. **Find "Component GraphQL" field**
4. **Paste your tested GraphQL query** into this field
5. **Save and publish**

#### List Component Template Setup
1. **Create data template** for list component:
   ```
   List Fields:
   ├── Title (Single-Line Text) - List heading
   ├── Subtitle (Single-Line Text) - Optional description
   └── [Additional list-specific fields]
   ```
2. **Configure rendering parameters** for list behavior:
   ```
   List Parameters:
   ├── ItemCount (Single-Line Text) - Max items to show
   ├── SortOrder (Droplist) - How to sort results
   └── ShowHeader (Checkbox) - Show/hide list title
   ```

---

### **🎨 Customer Component Styling**
Minimal Sitecore changes for visual customization:

#### Review Current Configuration
1. **Validate existing templates** are sufficient for customer needs
2. **Check rendering parameters** cover all customization needs
3. **Confirm parameter options** support customer variations

#### Add Customer-Specific Options (If Needed)
1. **Add new parameter options** for customer-specific variants:
   ```
   CustomerStyles/
   ├── brand-primary (Name: brand-primary)
   ├── brand-secondary (Name: brand-secondary)
   └── brand-accent (Name: brand-accent)
   ```

---

## 🔍 Validation Checklist

Before using AI prompts, verify:

### **Template Validation**
- [ ] **Data template exists** with all required fields
- [ ] **Field types are correct** (Image vs Rich Text vs Single-Line Text)
- [ ] **Field validation works** (required fields, formats)
- [ ] **Standard values set** for fallback content
- [ ] **Template inheritance** follows FastLane patterns

### **Rendering Parameters Validation**
- [ ] **Parameters template created** with Builder tab
- [ ] **Parameter fields configured** with proper types
- [ ] **Droplist sources point** to correct settings locations
- [ ] **Default values set** for parameters
- [ ] **Help text provided** for content authors

### **Parameter Settings Validation**  
- [ ] **Parameter option containers** exist in settings
- [ ] **Individual option items** created with correct templates
- [ ] **Name fields populated** with exact values code expects
- [ ] **Display names** are author-friendly

### **Rendering Item Validation**
- [ ] **Rendering item created** in correct location
- [ ] **Component name matches** TypeScript file name exactly
- [ ] **Template references correct** (data + parameters)
- [ ] **Datasource location** appropriate for content structure

### **GraphQL Validation** (For list components)
- [ ] **GraphQL query tested** in Playground and returns expected data
- [ ] **Query pasted** into rendering item's Component GraphQL field
- [ ] **Data structure** matches what component expects
- [ ] **Query optimized** for performance (specific fields only)

### **Integration Testing**
- [ ] **Create test content item** using data template
- [ ] **Add component to page** in Experience Editor
- [ ] **Test all parameters** work correctly
- [ ] **Verify field editing** works in Page Editor
- [ ] **Check error handling** for empty/missing fields

---

## 🚨 Common Setup Issues

### **Issue 1: AI Can't Find Fields**
**Cause:** Data template missing or fields incorrectly typed
**Prevention:** 
- Always use Builder tab for template creation
- Match field types to component requirements exactly
- Test template with actual content before AI generation

### **Issue 2: Parameters Don't Appear**
**Cause:** Rendering parameters not linked to rendering item
**Prevention:**
- Verify Parameters Template field on rendering item
- Check template inheritance chain
- Test parameters in Experience Editor first

### **Issue 3: Droplist Options Missing**
**Cause:** Parameter settings not created or incorrectly referenced  
**Prevention:**
- Create parameter option items first
- Verify Source field uses correct query path
- Test parameter options in Experience Editor

### **Issue 4: Component Registration Fails**
**Cause:** Rendering item name doesn't match component file
**Prevention:**
- Match rendering item name to TypeScript component file exactly
- Use PascalCase consistently
- Verify component-map.ts registers correctly

### **Issue 5: GraphQL Query Fails**
**Cause:** Query syntax errors or incorrect field references
**Prevention:**
- Always test queries in GraphQL Playground first
- Use exact field names and template names
- Verify permissions and security settings

---

## 🎯 Success Indicators

You're ready for AI generation when:

### **In Sitecore Content Editor:**
- ✅ **Template validates** - No missing field errors
- ✅ **Parameters work** - All options appear in Experience Editor
- ✅ **Test content renders** - Component displays without errors
- ✅ **Field editing works** - Authors can modify content inline

### **In Experience Editor:**
- ✅ **Component adds successfully** from toolbox
- ✅ **All parameters visible** in component properties
- ✅ **Field editing works** with inline editing
- ✅ **No rendering errors** or missing field messages

### **In GraphQL Playground:** (For list components)
- ✅ **Query executes** without syntax errors
- ✅ **Returns expected data** structure and fields
- ✅ **Performance acceptable** (< 2 seconds for typical queries)
- ✅ **Handles edge cases** (no results, missing fields)

### **In FastLane Codebase:**
- ✅ **TypeScript interfaces** align with Sitecore field types
- ✅ **Component registration** matches rendering item name
- ✅ **Parameter handling** covers all defined options
- ✅ **Fallback content** handles empty/missing fields

---

## 🔄 Workflow Integration

### **After Completing Prerequisites:**

#### For New Components:
1. ✅ **Prerequisites complete** (this guide)
2. 🎯 **Use AI Prompt:** [Create Component](../../component-development/ai-prompts/templates/create-component)
3. 🧪 **Follow Testing:** [Component Testing Guide](../../component-development/fastlane/testing)

#### For Component Enhancement:
1. ✅ **Prerequisites complete** (this guide)  
2. 📝 **Update documentation** (component .md file)
3. 🎯 **Use AI Prompt:** [Enhance Existing Component](../../component-development/ai-prompts/templates/enhance-existing-component)
4. 🧪 **Follow Testing:** [FastLane Testing Guide](../../component-development/fastlane/testing)

#### For GraphQL List Components:
1. ✅ **Prerequisites complete** (this guide)
2. 🎯 **Use AI Prompt:** [Create GraphQL List Component](../../component-development/ai-prompts/templates/create-sitecore-graphql-list-component)
3. 🧪 **Follow Testing:** [Component Testing Guide](../../component-development/fastlane/testing)


---

## 📚 Related Resources

- **[FastLane Component Development](../../component-development/fastlane/component-development)** - Code patterns and best practices
- **[Content SDK Integration](../../tools-and-advanced/content-sdk/)** - Field rendering and page context
- **[Component Testing](../../component-development/fastlane/testing)** - Validation and quality assurance
- **[Team Workflow](../../../getting-started/team-workflow)** - Process integration with team practices

---

**💡 Pro Tip:** Always complete Sitecore setup first, then test manually before using AI generation. This prevents hours of debugging AI-generated code that fails due to missing Sitecore infrastructure.
