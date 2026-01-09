#!/usr/bin/env ts-node

/**
 * Unified Figma Theme Generator for Tailwind v4
 * 
 * This script reads all-variables.json and generates a single CSS file with:
 * - @theme block containing Tailwind v4 theme tokens
 * - :root block with light mode CSS variables
 * - .dark block with dark mode CSS variables
 * - Keyframe animations
 * 
 * Usage: npm run generate-theme
 * Output: figma-theme.css
 */

import fs from 'fs';
import path from 'path';

const inputPath = path.resolve(__dirname, './all-variables.json');
const outputPath = path.resolve(__dirname, './figma-theme.css');

// ============================================================================
// Types
// ============================================================================

interface CssVar {
  name: string;
  value: string;
}

interface ThemeCategories {
  colors: CssVar[];
  colorsDark: CssVar[];
  colorsLight: CssVar[];
  fontSize: CssVar[];
  borderRadius: CssVar[];
  spacing: CssVar[];
  width: CssVar[];
  height: CssVar[];
  lineHeight: CssVar[];
  maxWidth: CssVar[];
  shadow: CssVar[];
  zIndex: CssVar[];
  other: CssVar[];
}

// Token value structure from Figma JSON
interface TokenValue {
  type: string;
  value: string | number;
}

// Nested token object structure
interface TokenObject {
  [key: string]: TokenValue | TokenObject;
}

// Variable item from Figma JSON
interface VariableItem {
  name: string;
  value?: string | number;
  groups?: Array<{
    name: string;
    value: string | number;
  }>;
}

// Variables structure from Figma JSON
interface VariablesRecord {
  [groupKey: string]: VariableItem[] | TokenObject;
}

// Mode structure from Figma JSON
interface FigmaMode {
  name: string;
  variables: VariablesRecord;
}

// Collection structure from Figma JSON
interface FigmaCollection {
  name: string;
  modes: FigmaMode[];
}

// Root JSON structure from Figma
interface FigmaData {
  collections: FigmaCollection[];
}

// ============================================================================
// Helper Functions
// ============================================================================

// Transform array format to nested object format
function transformArrayToNestedObject(variables: VariablesRecord): TokenObject {
  const result: TokenObject = {};
  
  for (const [groupKey, items] of Object.entries(variables)) {
    if (Array.isArray(items)) {
      result[groupKey] = {};
      for (const item of items as VariableItem[]) {
        if (item.groups && Array.isArray(item.groups)) {
          for (const group of item.groups) {
            if (group.name && group.value !== undefined) {
              const groupObj = result[groupKey] as TokenObject;
              if (!groupObj[item.name]) {
                groupObj[item.name] = {};
              }
              (groupObj[item.name] as TokenObject)[group.name] = {
                type: group.name,
                value: group.value
              };
            }
          }
        } else if (item.name && item.value !== undefined) {
          (result[groupKey] as TokenObject)[item.name] = {
            type: groupKey,
            value: item.value
          };
        }
      }
    } else {
      result[groupKey] = items as TokenObject;
    }
  }
  
  return result;
}

// Keys that should be suffixed with 'px'
const pxUnitPaths = [
  'font.size.', 'font-size.', 'radius.', 'border-radius.', 'border-width.',
  'width.', 'height.', 'line-height.', 'spacing.', 'letter-spacing.'
];

// Resolve token references recursively
function resolveToken(value: unknown, tokenMap: Record<string, string>, depth = 0): string {
  const str = String(value);
  if (!str.startsWith('{') || depth > 10) return str;
  const key = str.replace(/[{}]/g, '');
  const resolved = tokenMap[key];
  if (!resolved) {
    process.stderr.write(`⚠️ Unresolved: ${key}\n`);
    return str;
  }
  return resolveToken(resolved, tokenMap, depth + 1);
}

// Check if key requires 'px' suffix
function requiresPx(key: string): boolean {
  return pxUnitPaths.some((prefix) => key.startsWith(prefix));
}

// Resolve and apply px suffix if required
function resolveWithPx(key: string, tokenValue: string, tokenMap: Record<string, string>): string {
  const value = resolveToken(tokenValue, tokenMap);
  const hasUnit = /\d+(px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/.test(value);
  if (requiresPx(key) && !hasUnit && !isNaN(Number(value))) {
    return `${value}px`;
  }
  return value;
}

// Sanitize CSS variable name
function sanitizeCssVarName(name: string, context = ''): string {
  const sanitized = name.replace(/,/g, '.');
  if (!/^\d/.test(sanitized)) return sanitized;
  
  if (context === 'alpha') return `alpha-${sanitized}`;
  if (context === 'spacing') return `spacing-${sanitized}`;
  if (context === 'breakpoint') return `breakpoint-${sanitized}`;
  if (/^\d+(-\d+)?$/.test(sanitized)) return `spacing-${sanitized}`;
  return `breakpoint-${sanitized}`;
}

// Flatten tokens into a map
function flattenTokens(obj: TokenObject, tokenMap: Record<string, string>, prefix = '') {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val && typeof val === 'object' && 'type' in val && 'value' in val) {
      tokenMap[`${prefix}${key}`] = String((val as TokenValue).value);
    } else if (val && typeof val === 'object') {
      flattenTokens(val as TokenObject, tokenMap, `${prefix}${key}.`);
    }
  }
}

// ============================================================================
// Main Script
// ============================================================================

// Read and parse input
const raw = fs.readFileSync(inputPath, 'utf-8');
let tailwind: TokenObject;
let theme: TokenObject & { colors?: TokenObject };

try {
  const cleanedRaw = raw.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const data = JSON.parse(cleanedRaw) as FigmaData;
  
  if (!data.collections || !Array.isArray(data.collections)) {
    process.stderr.write('❌ Invalid format: expected collections array\n');
    process.exit(1);
  }
  
  const tailwindCollection = data.collections.find((c: FigmaCollection) => c.name === 'TailwindCSS');
  const themeCollection = data.collections.find((c: FigmaCollection) => c.name === 'Theme');
  
  if (!tailwindCollection || !themeCollection) {
    process.stderr.write('❌ Could not find TailwindCSS or Theme collections\n');
    process.exit(1);
  }
  
  const tailwindMode = tailwindCollection.modes.find((m: FigmaMode) => m.name === 'Default');
  const themeMode = themeCollection.modes.find((m: FigmaMode) => m.name === 'Default') || themeCollection.modes[0];
  
  if (!tailwindMode || !themeMode) {
    process.stderr.write('❌ Could not find Default mode in collections\n');
    process.exit(1);
  }
  
  tailwind = transformArrayToNestedObject(tailwindMode.variables);
  theme = transformArrayToNestedObject(themeMode.variables);
  
  // Rename 'color' to 'colors'
  if (theme.color) {
    theme.colors = theme.color as TokenObject;
    delete theme.color;
  }
  
  // Merge other collections
  for (const collection of data.collections) {
    if (collection.name !== 'TailwindCSS' && collection.name !== 'Theme') {
      const mode = collection.modes.find((m: FigmaMode) => m.name === 'Default') || collection.modes[0];
      if (mode?.variables) {
        Object.assign(tailwind, transformArrayToNestedObject(mode.variables));
      }
    }
  }
  
  process.stdout.write('✅ Parsed all-variables.json\n');
} catch (error) {
  process.stderr.write(`❌ Error parsing all-variables.json: ${error}\n`);
  process.exit(1);
}

// Build token map
const tokenMap: Record<string, string> = {};
flattenTokens(tailwind, tokenMap);

// ============================================================================
// Extract Variables
// ============================================================================

const categories: ThemeCategories = {
  colors: [],
  colorsDark: [],
  colorsLight: [],
  fontSize: [],
  borderRadius: [],
  spacing: [],
  width: [],
  height: [],
  lineHeight: [],
  maxWidth: [],
  shadow: [],
  zIndex: [],
  other: []
};

// Color variable names
const colorVarNames = [
  'accent', 'background', 'border', 'card', 'chart', 'destructive',
  'foreground', 'input', 'muted', 'popover', 'primary', 'ring',
  'secondary', 'sidebar', 'quaternary', 'ring-offset'
];

// Category matching rules for CSS variables
type CategoryKey = keyof ThemeCategories;
interface CategoryRule {
  category: CategoryKey;
  match: (name: string, parent: string, value: string) => boolean;
}

const categoryRules: CategoryRule[] = [
  { category: 'fontSize', match: (name) => name.startsWith('text-') && !name.includes('foreground') },
  { category: 'borderRadius', match: (name, parent) => name.startsWith('rounded') || parent === 'border-radius' },
  { category: 'spacing', match: (name, parent, value) => (name.startsWith('spacing-') || parent === 'spacing') && !value.startsWith('#') },
  { category: 'width', match: (name, parent) => name.startsWith('w-') || parent === 'width' },
  { category: 'height', match: (name, parent) => name.startsWith('h-') || parent === 'height' },
  { category: 'lineHeight', match: (name, parent) => name.startsWith('leading-') || parent === 'line-height' },
  { category: 'maxWidth', match: (name, parent) => name.startsWith('max-w-') || parent === 'max-width' },
  { category: 'shadow', match: (name, parent) => name.startsWith('shadow-') || parent === 'box-shadow' },
  { category: 'zIndex', match: (name, parent) => name.startsWith('z-') || parent === 'z-index' },
];

// Categorize a CSS variable based on its name and parent
function categorizeVariable(cssVar: CssVar, parent: string): void {
  for (const rule of categoryRules) {
    if (rule.match(cssVar.name, parent, cssVar.value)) {
      categories[rule.category].push(cssVar);
      return;
    }
  }
  categories.other.push(cssVar);
}

// Extract TailwindCSS variables
function extractTailwindVariables(obj: TokenObject, prefix = '') {
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && 'type' in val && 'value' in val) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const parts = fullKey.split('.');
      const lastName = parts[parts.length - 1];
      const parent = parts.length > 1 ? parts[parts.length - 2] : '';
      
      const shortName = sanitizeCssVarName(lastName, parent);
      if (shortName.includes('.')) continue;
      
      const tokenValue = String((val as TokenValue).value);
      const resolved = resolveWithPx(fullKey, tokenValue, tokenMap);
      
      const cssVar: CssVar = { name: shortName, value: resolved };
      categorizeVariable(cssVar, parent);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      extractTailwindVariables(val as TokenObject, prefix ? `${prefix}.${key}` : key);
    }
  }
}

// Extract theme colors
function extractThemeColors() {
  if (!theme.colors) return;
  
  for (const [key, val] of Object.entries(theme.colors)) {
    // Check if val is a TokenValue with a value property
    if (!val || typeof val !== 'object' || !('value' in val)) continue;
    
    const tokenVal = val as TokenValue;
    const resolved = resolveToken(tokenVal.value, tokenMap);
    const sanitizedKey = sanitizeCssVarName(key, 'color');
    if (sanitizedKey.includes('.')) continue;
    
    const cssVar: CssVar = { name: sanitizedKey, value: resolved };
    
    if (key.endsWith('-dark')) {
      categories.colorsDark.push(cssVar);
    } else if (key.endsWith('-light')) {
      categories.colorsLight.push(cssVar);
    } else {
      categories.colors.push(cssVar);
    }
  }
}

extractTailwindVariables(tailwind);
extractThemeColors();

// ============================================================================
// Generate Output
// ============================================================================

// Semantic colors for @theme block
const semanticColors = [
  'background', 'foreground', 'card', 'card-foreground',
  'popover', 'popover-foreground', 'primary', 'primary-foreground',
  'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
  'accent', 'accent-foreground', 'destructive', 'destructive-foreground',
  'border', 'input', 'ring', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar-background', 'sidebar-foreground', 'sidebar-primary',
  'sidebar-primary-foreground', 'sidebar-accent', 'sidebar-accent-foreground',
  'sidebar-border', 'sidebar-ring'
];

function generateThemeBlock(): string {
  const lines: string[] = ['@theme {'];
  
  // Colors
  lines.push('  /* ==========================================');
  lines.push('   * Colors - using CSS variable references');
  lines.push('   * ========================================== */');
  for (const color of semanticColors) {
    lines.push(`  --color-${color}: var(--${color});`);
  }
  
  // Font sizes
  if (categories.fontSize.length > 0) {
    lines.push('');
    lines.push('  /* ==========================================');
    lines.push('   * Font Sizes');
    lines.push('   * ========================================== */');
    for (const v of categories.fontSize) {
      const sizeName = v.name.replace('text-', '');
      lines.push(`  --font-size-${sizeName}: ${v.value};`);
    }
  }
  
  // Border radius
  if (categories.borderRadius.length > 0) {
    lines.push('');
    lines.push('  /* ==========================================');
    lines.push('   * Border Radius');
    lines.push('   * ========================================== */');
    for (const v of categories.borderRadius) {
      const name = v.name.replace('rounded-', '').replace('rounded', 'default');
      lines.push(`  --radius-${name}: ${v.value};`);
    }
  }
  
  // Spacing
  if (categories.spacing.length > 0) {
    lines.push('');
    lines.push('  /* ==========================================');
    lines.push('   * Spacing');
    lines.push('   * ========================================== */');
    for (const v of categories.spacing) {
      lines.push(`  --${v.name}: ${v.value};`);
    }
  }
  
  // Width
  if (categories.width.length > 0) {
    lines.push('');
    lines.push('  /* ==========================================');
    lines.push('   * Width');
    lines.push('   * ========================================== */');
    for (const v of categories.width) {
      const name = v.name.replace('w-', '');
      lines.push(`  --width-${name}: ${v.value};`);
    }
  }
  
  // Height
  if (categories.height.length > 0) {
    lines.push('');
    lines.push('  /* ==========================================');
    lines.push('   * Height');
    lines.push('   * ========================================== */');
    for (const v of categories.height) {
      const name = v.name.replace('h-', '');
      lines.push(`  --height-${name}: ${v.value};`);
    }
  }
  
  // Line height
  if (categories.lineHeight.length > 0) {
    lines.push('');
    lines.push('  /* ==========================================');
    lines.push('   * Line Height');
    lines.push('   * ========================================== */');
    for (const v of categories.lineHeight) {
      const name = v.name.replace('leading-', '');
      lines.push(`  --line-height-${name}: ${v.value};`);
    }
  }
  
  // Max width
  if (categories.maxWidth.length > 0) {
    lines.push('');
    lines.push('  /* ==========================================');
    lines.push('   * Max Width');
    lines.push('   * ========================================== */');
    for (const v of categories.maxWidth) {
      const name = v.name.replace('max-w-', '');
      lines.push(`  --max-width-${name}: ${v.value};`);
    }
  }
  
  // Box Shadow
  lines.push('');
  lines.push('  /* ==========================================');
  lines.push('   * Box Shadow');
  lines.push('   * ========================================== */');
  if (categories.shadow.length > 0) {
    for (const v of categories.shadow) {
      lines.push(`  --${v.name}: ${v.value};`);
    }
  } else {
    lines.push('  --shadow-sm: 0px 2px 6px rgba(0, 0, 0, 0.1);');
    lines.push('  --shadow-md: 0px 4px 12px rgba(0, 0, 0, 0.2);');
    lines.push('  --shadow-lg: 0px 8px 24px rgba(0, 0, 0, 0.3);');
    lines.push('  --shadow-xl: 0px 12px 32px rgba(0, 0, 0, 0.35);');
    lines.push('  --shadow-2xl: 0px 16px 48px rgba(0, 0, 0, 0.4);');
    lines.push('  --shadow-none: none;');
  }
  
  // Z-Index
  lines.push('');
  lines.push('  /* ==========================================');
  lines.push('   * Z-Index');
  lines.push('   * ========================================== */');
  if (categories.zIndex.length > 0) {
    for (const v of categories.zIndex) {
      lines.push(`  --z-index-${v.name.replace('z-', '')}: ${v.value};`);
    }
  } else {
    lines.push('  --z-index-0: 0;');
    lines.push('  --z-index-5: 5;');
    lines.push('  --z-index-10: 10;');
    lines.push('  --z-index-20: 20;');
    lines.push('  --z-index-30: 30;');
    lines.push('  --z-index-40: 40;');
    lines.push('  --z-index-50: 50;');
    lines.push('  --z-index-100: 100;');
  }
  
  // Animation
  lines.push('');
  lines.push('  /* ==========================================');
  lines.push('   * Animation');
  lines.push('   * ========================================== */');
  lines.push('  --animate-accordion-down: accordion-down 0.2s ease-out;');
  lines.push('  --animate-accordion-up: accordion-up 0.2s ease-out;');
  
  lines.push('}');
  return lines.join('\n');
}

function generateRootBlock(): string {
  const lines: string[] = [];
  lines.push('/* CSS Variables - Light mode defaults */');
  lines.push(':root {');
  
  // Add base semantic colors using light mode values
  // Map -light suffix values to base variable names
  for (const v of categories.colorsLight) {
    const baseName = v.name.replace('-light', '');
    lines.push(`  --${baseName}: ${v.value};`);
  }
  
  // Add -light and -dark variants for reference
  for (const v of categories.colorsLight) {
    lines.push(`  --${v.name}: ${v.value};`);
  }
  for (const v of categories.colorsDark) {
    lines.push(`  --${v.name}: ${v.value};`);
  }
  
  // Add other variables (non-color)
  for (const v of categories.other) {
    if (!colorVarNames.some(c => v.name.startsWith(c))) {
      lines.push(`  --${v.name}: ${v.value};`);
    }
  }
  
  lines.push('}');
  return lines.join('\n');
}

function generateDarkBlock(): string {
  const lines: string[] = [];
  lines.push('/* CSS Variables - Dark mode */');
  lines.push('.dark {');
  
  // Generate dark mode overrides from -dark suffix variables
  for (const v of categories.colorsDark) {
    const baseName = v.name.replace('-dark', '');
    lines.push(`  --${baseName}: ${v.value};`);
  }
  
  lines.push('}');
  return lines.join('\n');
}

function generateKeyframes(): string {
  return `
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}`;
}

// Assemble output
const output = `/**
 * Figma-Generated Tailwind v4 Theme
 * 
 * This file is auto-generated from Figma design tokens.
 * DO NOT EDIT DIRECTLY - run: npm run generate-theme
 * 
 * Usage: @import "./figma-theme.css"; in your main.css
 */

${generateThemeBlock()}

${generateRootBlock()}

${generateDarkBlock()}

${generateKeyframes()}
`;

// Write output
fs.writeFileSync(outputPath, output);
process.stdout.write('✅ Generated figma-theme.css\n');
process.stdout.write('\nUsage: Import in your main.css:\n  @import "../../figma/figma-theme.css";\n');

