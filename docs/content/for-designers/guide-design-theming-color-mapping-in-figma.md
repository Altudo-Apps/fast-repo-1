# Guide: Design Theming / Color Mapping in Figma

# 📍Purpose
To consistently and efficiently map customer brand colors into Tailwind-compatible tokens using Figma Token Studio—preserving design intent, minimizing duplication, and exporting clean CSS variables for use in Next.js projects.

# 📁 Token Studio Collections Overview
| **Collection** | **Purpose** |
|-----|-------|
| **TailwindCss** | Stores raw customer brand colors (e.g., #005DAA) |
| **Theme** | Maps Tailwind \`color/\` tokens and defines extra usage tokens when needed |
| **Mode** | Defines final \`base/\` tokens exported to \`main.css\` (Tailwind-compatible) |


# 🛠️ Step-by-Step Instructions
The following instructions use the BSW Health project and theming as an example.

## 1️⃣ TailwindCss Collection → Define Raw Brand Colors
What to do:

*   Create a variable for each raw customer color.
    
*   Use the format: TailwindCss/customer/\[color-name\]
    

✅ Example:  
TailwindCss/customer/blue-500 = #005DAA  
TailwindCss/customer/gray-100 = #F7F7F7  
TailwindCss/customer/red-600  = #D32F2F

## 2️⃣ Theme Collection → Map to Tailwind \`color\` Tokens and Define Extra Intents If Needed
What to do:

A. Map to existing color/ tokens:

*   Update values in Theme/color/ to reference TailwindCss/customer/ values.
    

✅ Example:  
Theme/color/primary.DEFAULT     = TailwindCss/customer/blue-500  
Theme/color/text.error          = TailwindCss/customer/red-600  
Theme/color/background.default  = TailwindCss/customer/gray-100

B. Add extra-intents/ if needed:

*   If the desired usage is not covered by color/, add a new token under Theme/extra-intents/.
    
*   Use intent-driven names like button/background, card/header-bg, etc.
    

✅ Example:  
Theme/extra-intents/button/background = TailwindCss/customer/blue-500  
Theme/extra-intents/button/foreground = TailwindCss/customer/white  
Theme/extra-intents/button/border     = TailwindCss/customer/blue-700

## 3️⃣ Mode Collection → Define \`base/\` Tokens for Tailwind Export
What to do:

*   In Mode, define all base/ tokens for CSS export.
    
*   Map to Theme/color/ or Theme/extra-intents/ values.
    
*   If you define any extra-intents, you must define matching base/ tokens.
    

✅ Example:  
Mode/base/primary           = Theme/color/primary.DEFAULT  
Mode/base/text-error        = Theme/color/text.error  
Mode/base/button-primary    = Theme/extra-intents/button/background  
Mode/base/button-foreground = Theme/extra-intents/button/foreground  
Mode/base/button-border     = Theme/extra-intents/button/border

## 🚫 Do Not Modify Base Tokens in Components
*   Do not override base tokens like base/primary inside components.
    
*   Define a new base token in Mode (e.g., base/button-secondary) and use it in the component override.
    

## ✅ Final Export Path Example
Mode/base.button-primary → Theme/extra-intents/button/background → TailwindCss/customer/blue-500 → #005DAA

## 🎯 When to Use \`extra-intents/\`
Use extra-intents/ if:

*   The needed intent is not covered by Theme/color/.
    
*   You want to define a new token like button/border, card/header-bg, etc.
    

Do not add new custom tokens to Theme/color/. That group should mirror Tailwind semantics.

# ✅ QA Checklist
*   TailwindCss: All raw colors are defined and named consistently.
    
*   Theme/color: Tailwind tokens overridden correctly with customer colors.
    
*   Theme/extra-intents: Only used for additional, unmapped intents.
    
*   Mode/base: All exported tokens defined—including all extra-intents.
    
*   Components: Use only base/ tokens. Never override directly.
    
*   Token Studio: No broken or unresolved tokens.
    

# 🧠 Designer Tips

| **Tip** | **Why It Matters** |
|-----|-------|
| **Start with Theme/color/** | Reuse existing Tailwind tokens first |
| **Only use extra-intents when needed** | Keeps the system clean and scalable |
| **Always add base/ tokens for extra-intents** | Ensures everything is exported properly |
| **Never override base/ in components** | Preserves portability and flexibility |
| **Use Token Studio Inspect mode** | Confirms all tokens are linked correctly  |
