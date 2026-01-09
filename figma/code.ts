/// <reference types="@figma/plugin-typings" />

// This plugin allows extracting variables and styles from a Figma document
// as JSON files for design system integration.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 450, height: 700 });

// Helper function to send debug messages to UI
function sendDebug(message: string) {
  console.log('DEBUG:', message);
  figma.ui.postMessage({
    type: 'debug-message',
    message: message,
  });
}

// Simple communication test - send a message as soon as the plugin loads
sendDebug('Plugin initialization started');
figma.ui.postMessage({
  type: 'plugin-loaded',
  message: 'Plugin has loaded successfully',
});

// Load variables and styles when plugin starts
try {
  sendDebug('Loading variables and styles...');
  loadAndDisplayVariables();
  loadAndDisplayStyles();
  sendDebug('Variables and styles loaded successfully');
} catch (e) {
  sendDebug(
    `Error loading initial data: ${
      e instanceof Error ? e.message : 'Unknown error'
    }`
  );
}

// When the plugin starts, send a message to UI with current selection
try {
  const currentSelection = figma.currentPage.selection;
  sendDebug(`Initial selection: ${currentSelection.length} items`);
  figma.ui.postMessage({
    type: 'initial-selection',
    hasSelection: currentSelection.length > 0,
    selectionCount: currentSelection.length,
    selectionTypes: currentSelection.map((node) => node.type),
  });
} catch (e) {
  sendDebug(
    `Error sending initial selection: ${
      e instanceof Error ? e.message : 'Unknown error'
    }`
  );
}

// Handle selection changes
figma.on('selectionchange', () => {
  try {
    const selection = figma.currentPage.selection;
    sendDebug(`Selection changed: ${selection.length} items selected`);
    figma.ui.postMessage({
      type: 'selection-changed',
      hasSelection: selection.length > 0,
      selectionCount: selection.length,
      selectionTypes: selection.map((node) => node.type),
    });
  } catch (e) {
    sendDebug(
      `Error in selection change handler: ${
        e instanceof Error ? e.message : 'Unknown error'
      }`
    );
  }
});

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  try {
    sendDebug(`Message received from UI: ${msg.type}`);

    // Always reply with an echo to confirm receipt
    figma.ui.postMessage({
      type: 'echo-reply',
      originalMessage: msg.type,
      timestamp: Date.now(),
    });

    if (msg.type === 'ping') {
      // Simple ping/pong to test communication
      sendDebug('Received ping, sending pong...');
      figma.ui.postMessage({
        type: 'pong',
        timestamp: Date.now(),
      });
    } else if (msg.type === 'get-selection') {
      // Get current selection
      sendDebug('Handling get-selection request');
      const selection = figma.currentPage.selection;
      figma.ui.postMessage({
        type: 'selection-info',
        selection: selection.map((node) => ({
          id: node.id,
          name: node.name,
          type: node.type,
        })),
      });
    } else if (msg.type === 'analyze-selection') {
      // Send debug message to confirm we're starting analysis
      sendDebug('Starting analyze-selection request processing');

      // Simple analysis that just returns basic info
      const selection = figma.currentPage.selection;

      sendDebug(`Selection has ${selection.length} items`);

      if (selection.length === 1) {
        const node = selection[0];
        sendDebug(`Analyzing node: ${node.name} (${node.type})`);

        // Try to export a simple image if possible
        let imageData = null;
        try {
          if ('exportAsync' in node) {
            sendDebug('Node can be exported, generating preview...');

            const bytes = await (node as ExportMixin).exportAsync({
              format: 'PNG',
              constraint: { type: 'WIDTH', value: 300 },
            });
            sendDebug('Export successful, encoding image...');

            const base64 = figma.base64Encode(bytes);
            imageData = `data:image/png;base64,${base64}`;

            sendDebug('Preview generated successfully');
          } else {
            sendDebug('Node cannot be exported (no exportAsync method)');
          }
        } catch (e) {
          sendDebug(
            `Export error: ${e instanceof Error ? e.message : 'Unknown error'}`
          );
          console.error('Export error:', e);
        }

        // Get styles used by the node
        const stylesInfo = getNodeStyles(node);
        sendDebug(`Found ${stylesInfo.length} styles used by this node`);

        // Get variables used by the node
        const variablesInfo = await getNodeVariables(node);
        sendDebug(`Found ${variablesInfo.length} variables used by this node`);

        // Enhance styles with variable information
        const enhancedStylesInfo = stylesInfo.map((style) => {
          // For styles that have variable IDs, find and attach the variable information
          if (
            style.usesVariable &&
            (style.colorVariableId || style.opacityVariableId)
          ) {
            const styleWithVars = { ...style, variableInfo: [] };

            // Find color variable
            if (style.colorVariableId) {
              const colorVar = variablesInfo.find(
                (v) => v.id === style.colorVariableId
              );
              if (colorVar) {
                styleWithVars.variableInfo.push({
                  id: colorVar.id,
                  name: colorVar.name,
                  type: colorVar.type,
                  collectionName: colorVar.collectionName,
                  property: 'color',
                });
              }
            }

            // Find opacity variable
            if (style.opacityVariableId) {
              const opacityVar = variablesInfo.find(
                (v) => v.id === style.opacityVariableId
              );
              if (opacityVar) {
                styleWithVars.variableInfo.push({
                  id: opacityVar.id,
                  name: opacityVar.name,
                  type: opacityVar.type,
                  collectionName: opacityVar.collectionName,
                  property: 'opacity',
                });
              }
            }

            return styleWithVars;
          }

          return style;
        });

        // Send basic node info
        sendDebug('Sending analysis results to UI');
        figma.ui.postMessage({
          type: 'simple-analysis',
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          hasImage: !!imageData,
          imageData: imageData,
          styles: enhancedStylesInfo,
          variables: variablesInfo,
        });

        sendDebug('Analysis complete and sent to UI');
      } else {
        sendDebug(
          `Error: Need exactly one selected node (current: ${selection.length})`
        );
        figma.ui.postMessage({
          type: 'simple-analysis-error',
          message: `Please select exactly one node (current: ${selection.length})`,
        });
      }
    } else if (msg.type === 'extract-variables') {
      sendDebug('Extracting variables...');
      await extractVariables();
    } else if (msg.type === 'extract-styles') {
      sendDebug('Extracting styles...');
      await extractStyles();
    } else if (msg.type === 'get-tailwind-config') {
      sendDebug('Generating Tailwind config and CSS assets...');
      await generateTailwindAssetsAndDownload();
    } else if (msg.type === 'export-frame-analysis') {
      sendDebug('Exporting frame analysis...');
      await exportFrameAnalysis();
    } else if (msg.type === 'cancel') {
      sendDebug('Closing plugin...');
      figma.closePlugin();
    } else {
      sendDebug(`Unknown message type received: ${msg.type}`);
    }
  } catch (e) {
    sendDebug(
      `ERROR in message handler: ${
        e instanceof Error ? e.message : 'Unknown error'
      }`
    );
    console.error('Error in message handler:', e);

    // Try to send an error message back to UI
    try {
      figma.ui.postMessage({
        type: 'plugin-error',
        error: e instanceof Error ? e.message : 'Unknown error',
      });
    } catch {
      console.error('Failed to send error to UI');
    }
  }
};

// Helper function to pad strings (alternative to padStart)
function padString(str: string, length: number, char: string): string {
  while (str.length < length) {
    str = char + str;
  }
  return str;
}

async function loadAndDisplayVariables() {
  try {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const variables = await figma.variables.getLocalVariablesAsync();

    const variablesData = variables.map((variable) => {
      const collection = collections.find(
        (c) => c.id === variable.variableCollectionId
      );
      return {
        id: variable.id,
        name: variable.name,
        type: variable.resolvedType,
        collectionName: collection?.name || 'Unknown Collection',
        values: variable.valuesByMode,
      };
    });

    figma.ui.postMessage({
      type: 'variables-data',
      variables: variablesData,
    });
  } catch (error) {
    console.error('Error loading variables:', error);
    figma.ui.postMessage({
      type: 'variables-error',
      message: 'Failed to load variables',
    });
  }
}

async function loadAndDisplayStyles() {
  try {
    // Get all styles in the document using async methods
    const paintStyles = await figma.getLocalPaintStylesAsync();
    const textStyles = await figma.getLocalTextStylesAsync();

    // Process paint styles
    const paintStylesData = paintStyles.map((style) => {
      const styleDetails = {
        id: style.id,
        name: style.name,
        type: style.type,
        key: style.key,
        description: style.description || '',
        hexColor: '',
        isComplex: false,
        color: null as { r: number; g: number; b: number; a: number } | null,
      };

      // Paint style (colors)
      if (style.paints.length > 0 && style.paints[0].type === 'SOLID') {
        const solidPaint = style.paints[0] as SolidPaint;
        styleDetails.color = {
          r: solidPaint.color.r,
          g: solidPaint.color.g,
          b: solidPaint.color.b,
          a: solidPaint.opacity !== undefined ? solidPaint.opacity : 1,
        };

        // Convert to hex
        const r = Math.round(solidPaint.color.r * 255);
        const g = Math.round(solidPaint.color.g * 255);
        const b = Math.round(solidPaint.color.b * 255);
        const a = solidPaint.opacity !== undefined ? solidPaint.opacity : 1;
        styleDetails.hexColor =
          '#' +
          padString(r.toString(16), 2, '0') +
          padString(g.toString(16), 2, '0') +
          padString(b.toString(16), 2, '0');

        if (a < 1) {
          const alpha = Math.round(a * 255);
          styleDetails.hexColor += padString(alpha.toString(16), 2, '0');
        }
      } else {
        styleDetails.isComplex = true;
      }

      return styleDetails;
    });

    // Process text styles
    const textStylesData = textStyles.map((style) => {
      return {
        id: style.id,
        name: style.name,
        type: style.type,
        key: style.key,
        description: style.description || '',
        fontName: style.fontName,
        fontSize: style.fontSize,
        letterSpacing: style.letterSpacing,
        lineHeight: style.lineHeight,
        paragraphIndent: style.paragraphIndent,
        paragraphSpacing: style.paragraphSpacing,
        textCase: style.textCase,
        textDecoration: style.textDecoration,
      };
    });

    // Combine both types of styles
    const stylesData = [...paintStylesData, ...textStylesData];

    figma.ui.postMessage({
      type: 'styles-data',
      styles: stylesData,
    });
  } catch (error) {
    console.error('Error loading styles:', error);
    figma.ui.postMessage({
      type: 'styles-error',
      message: 'Failed to load styles',
    });
  }
}

type VariableValueEntry = Variable['valuesByMode'][string];

type VariableAliasReference = {
  type: 'VARIABLE_ALIAS';
  id: string;
};

type CleanVariableTokenValue = string | boolean;

type RawToken = {
  path: string[];
  value: CleanVariableTokenValue;
};

type CleanVariableExport = {
  collections: Array<{
    name: string;
    modes: Array<{
      name: string;
      variables: Record<string, unknown>;
    }>;
  }>;
};

type CleanTokenGroup = {
  name: string;
  value?: CleanVariableTokenValue;
  groups?: CleanTokenGroup[];
};

type TokenGroupNode = {
  name: string;
  value?: CleanVariableTokenValue;
  children: Map<string, TokenGroupNode>;
};

function buildCleanVariableExport(
  collections: VariableCollection[],
  variables: Variable[]
): CleanVariableExport {
  const variableMap = new Map<string, Variable>();

  for (const variable of variables) {
    variableMap.set(variable.id, variable);
  }

  const cleanCollections = collections
    .map((collection) => {
      const collectionVariables = variables.filter(
        (variable) => variable.variableCollectionId === collection.id
      );

      const modes = collection.modes
        .map((mode) => {
          const groupedVariables = groupVariablesForMode(
            collectionVariables,
            mode.modeId,
            variableMap
          );

          return {
            name: mode.name,
            variables: groupedVariables,
          };
        })
        .filter((mode) => Object.keys(mode.variables).length > 0);

      return {
        name: sanitizeCollectionName(collection.name),
        modes,
      };
    })
    .filter((collection) => collection.modes.length > 0);

  return { collections: cleanCollections };
}

function groupVariablesForMode(
  collectionVariables: Variable[],
  modeId: string,
  variableMap: Map<string, Variable>
): Record<string, unknown> {
  const grouped: Record<string, RawToken[]> = {};

  for (const variable of collectionVariables) {
    const { categoryKey, segments } = splitVariableName(variable.name);
    const resolvedValue = resolveVariableValue(variable, modeId, variableMap);

    if (resolvedValue === null || resolvedValue === undefined) {
      continue;
    }

    const formattedValue = formatVariableValue(
      variable,
      resolvedValue,
      categoryKey,
      segments
    );

    if (formattedValue === null || formattedValue === undefined) {
      continue;
    }

    if (!grouped[categoryKey]) {
      grouped[categoryKey] = [];
    }

    const tokenPath =
      segments.length > 0
        ? segments
        : [formatTokenLabel(variable.name, categoryKey)];

    grouped[categoryKey].push({
      path: tokenPath,
      value: formattedValue,
    });
  }

  const result: Record<string, unknown> = {};
  const sortedCategories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  for (const category of sortedCategories) {
    result[category] = finalizeCategoryTokens(category, grouped[category]);
  }

  return result;
}

function resolveVariableValue(
  variable: Variable,
  modeId: string,
  variableMap: Map<string, Variable>,
  visited: Set<string> = new Set()
): unknown {
  if (visited.has(variable.id)) {
    return null;
  }

  visited.add(variable.id);

  const valuesByMode = variable.valuesByMode as Record<
    string,
    VariableValueEntry | VariableAliasReference
  >;

  const explicitValue = valuesByMode[modeId];
  if (explicitValue !== undefined) {
    return resolveRawValue(explicitValue, modeId, variableMap, visited);
  }

  for (const value of Object.values(valuesByMode)) {
    const resolved = resolveRawValue(value, modeId, variableMap, visited);
    if (resolved !== null && resolved !== undefined) {
      return resolved;
    }
  }

  return null;
}

function resolveRawValue(
  value: VariableValueEntry | VariableAliasReference,
  modeId: string,
  variableMap: Map<string, Variable>,
  visited: Set<string>
): unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (isAliasReference(value)) {
    const referenced = variableMap.get(value.id);
    if (!referenced) {
      return null;
    }

    return resolveVariableValue(referenced, modeId, variableMap, visited);
  }

  return value;
}

function isAliasReference(
  value: VariableValueEntry | VariableAliasReference
): value is VariableAliasReference {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as VariableAliasReference).type === 'VARIABLE_ALIAS'
  );
}

function splitVariableName(name: string): {
  categoryKey: string;
  segments: string[];
} {
  const trimmed = name.trim();
  const parts = trimmed
    .split('/')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return { categoryKey: 'uncategorized', segments: [] };
  }

  if (parts.length === 1) {
    return {
      categoryKey: 'uncategorized',
      segments: [normalizeTokenSegment(parts[0])],
    };
  }

  const [categoryRaw, ...rest] = parts;

  return {
    categoryKey: normalizeCategoryKey(categoryRaw),
    segments: rest.map((segment) => normalizeTokenSegment(segment)),
  };
}

function normalizeCategoryKey(raw: string): string {
  const sanitized = raw.replace(/^\d+\.\s*/, '').trim();
  const kebab = sanitized
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  if (!kebab) {
    return 'uncategorized';
  }

  if (kebab === 'colors') {
    return 'color';
  }

  return kebab;
}

function normalizeTokenSegment(segment: string): string {
  const cleaned = segment
    .trim()
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-');

  if (!cleaned) {
    return 'value';
  }

  return cleaned.toLowerCase();
}

function formatTokenLabel(name: string, categoryKey: string): string {
  const cleanedName = name.replace(/^\d+\.\s*/, '').trim();

  if (cleanedName.includes('/')) {
    const parts = cleanedName.split('/');
    const last = parts[parts.length - 1]?.trim();
    if (last) {
      return normalizeTokenSegment(last);
    }
  }

  const normalized = normalizeTokenSegment(cleanedName);
  return normalized || categoryKey || 'value';
}

function finalizeCategoryTokens(
  category: string,
  tokens: RawToken[]
): unknown {
  if (category === 'tailwind-colors') {
    const groupedByName = new Map<
      string,
      { name: string; variants: Array<{ name: string; value: CleanVariableTokenValue }> }
    >();

    for (const token of tokens) {
      const [groupName, ...rest] = token.path;
      const key = groupName || 'default';

      if (!groupedByName.has(key)) {
        groupedByName.set(key, { name: key, variants: [] });
      }

      const variantName = rest.length > 0 ? rest.join('/') : key;
      const group = groupedByName.get(key)!;

      if (!group.variants.find((variant) => variant.name === variantName)) {
        group.variants.push({
          name: variantName,
          value: token.value,
        });
      }
    }

    const sortedGroups = Array.from(groupedByName.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );

    for (const group of sortedGroups) {
      group.variants.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );
    }

    return sortedGroups;
  }

  const rootGroups = new Map<string, TokenGroupNode>();

  for (const token of tokens) {
    const normalizedPath =
      token.path.length === 1 && token.path[0].includes('/')
        ? token.path[0]
            .split('/')
            .map((segment) => normalizeTokenSegment(segment))
        : token.path;

    if (normalizedPath.length === 0) {
      continue;
    }

    insertTokenGroup(rootGroups, normalizedPath, token.value);
  }

  return serializeGroupNodes(rootGroups);
}

function insertTokenGroup(
  groups: Map<string, TokenGroupNode>,
  path: string[],
  value: CleanVariableTokenValue
) {
  const [head, ...rest] = path;
  const key = head;

  if (!groups.has(key)) {
    groups.set(key, { name: key, children: new Map() });
  }

  const node = groups.get(key)!;

  if (rest.length === 0) {
    if (node.value === undefined) {
      node.value = value;
    }
    return;
  }

  if (!node.children) {
    node.children = new Map();
  }

  insertTokenGroup(node.children, rest, value);
}

function serializeGroupNodes(
  groups: Map<string, TokenGroupNode>
): CleanTokenGroup[] {
  return Array.from(groups.values())
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    )
    .map((node) => {
      const result: CleanTokenGroup = { name: node.name };

      if (node.value !== undefined) {
        result.value = node.value;
      }

      if (node.children && node.children.size > 0) {
        result.groups = serializeGroupNodes(node.children);
      }

      return result;
    });
}

function formatVariableValue(
  variable: Variable,
  resolvedValue: unknown,
  categoryKey: string,
  segments: string[]
): CleanVariableTokenValue | null {
  switch (variable.resolvedType) {
    case 'COLOR':
      if (isRgba(resolvedValue)) {
        return formatColor(resolvedValue);
      }
      return null;
    case 'FLOAT':
      if (typeof resolvedValue !== 'number') {
        return null;
      }
      return formatNumericValue(resolvedValue, categoryKey, segments);
    case 'BOOLEAN':
      return Boolean(resolvedValue);
    case 'STRING':
      return String(resolvedValue);
    default:
      try {
        return JSON.stringify(resolvedValue);
      } catch {
        return String(resolvedValue);
      }
  }
}

function isRgba(value: unknown): value is RGBA {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.r === 'number' &&
    typeof candidate.g === 'number' &&
    typeof candidate.b === 'number' &&
    typeof candidate.a === 'number'
  );
}

function formatColor(color: RGBA): string {
  const r = clampColorChannel(color.r);
  const g = clampColorChannel(color.g);
  const b = clampColorChannel(color.b);
  const a = clampAlpha(color.a);

  if (Math.abs(a - 1) < 0.0001) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(4)})`;
}

function clampColorChannel(value: number): number {
  const clamped = Math.max(0, Math.min(1, value));
  return Math.round(clamped * 255);
}

function clampAlpha(value: number): number {
  const clamped = Math.max(0, Math.min(1, value));
  return parseFloat(clamped.toFixed(4));
}

function toHex(component: number): string {
  return component.toString(16).padStart(2, '0');
}

function formatNumericValue(
  value: number,
  categoryKey: string,
  segments: string[]
): string {
  if (value === 0) {
    return '0';
  }

  const formatted = Number.isInteger(value)
    ? value.toString()
    : Number(value.toFixed(4)).toString();

  if (shouldAppendPx(categoryKey, segments)) {
    return `${formatted}px`;
  }

  return formatted;
}

function shouldAppendPx(categoryKey: string, segments: string[]): boolean {
  const pxCategories = new Set([
    'spacing',
    'breakpoint',
    'border-width',
    'width',
    'height',
    'size',
    'sizing',
    'max-width',
    'max-height',
    'min-width',
    'min-height',
    'radius',
    'padding',
    'margin',
    'gap',
  ]);

  const pxSegments = new Set([
    'font-size',
    'line-height',
    'opacity',
    'letter-spacing',
    'gap',
    'width',
    'height',
    'size',
  ]);

  if (pxCategories.has(categoryKey)) {
    return true;
  }

  switch (categoryKey) {
    case 'font':
      if (segments.length > 0 && segments[0].toLowerCase() === 'size') {
        return true;
      }
      return false;
    default:
      return segments.some((segment) => pxSegments.has(segment.toLowerCase()));
  }
}

function sanitizeCollectionName(name: string): string {
  const withoutPrefix = name.replace(/^\d+\.\s*/, '').trim();
  return withoutPrefix || 'Unnamed Collection';
}

type TailwindArtifacts = {
  tailwindConfig: string;
  mainCss: string;
};

const TAILWIND_CONFIG_TEMPLATE = `import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      zIndex: {
        '100': '100',
      },
      fontFamily: {
        satoshi: ['var(--font-satoshi)', 'sans-serif'],
        Zodiak: ['var(--font-zodiak)', 'sans-serif'],
      },
      fontSize: {
        h1: 'var(--text-5xl)',
        h2: 'var(--text-4xl)',
        h3: 'var(--text-2xl)',
        h4: 'var(--text-xl)',
        p: 'var(--text-base)',
      },
      height: {
        '41': 'var(--height-41)',
        '137': 'var(--height-137)',
        '387': 'var(--height-387)',
        '600': 'var(--height-600)',
      },
      width: {
        '600': 'var(--width-600)',
      },
      borderRadius: {
        default: 'var(--rounded)',
        sm: 'var(--rounded-sm)',
        md: 'var(--rounded-md)',
        lg: 'var(--rounded-lg)',
        xl: 'var(--rounded-xl)',
        full: 'var(--rounded-full)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        slate: 'var(--slate)',
        'sidebar-foreground': 'var(--sidebar-foreground)',

        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        tertiary: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        quaternary: {
          DEFAULT: 'var(--quaternary)',
          foreground: 'var(--quaternary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
      },
      spacing: {
        '0': 'var(--spacing-0)',
        default: 'var(--spacing-md)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-light)',
        md: 'var(--shadow-medium)',
        lg: 'var(--shadow-heavy)',
      },

      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  safelist: [
    'top-low-space',
    'top-no-space',
    'top-medium-space',
    'top-large-space',

    'bottom-low-space',
    'bottom-no-space',
    'bottom-medium-space',
    'bottom-large-space',

    'text-h1',
    'text-h2',
    'text-h3',
    'text-h4',
    'text-h5',
    'text-h6',
    'text-p',
    'text-primary',
    'text-secondary',
    'bg-primary',
    'bg-secondary',

    'basis-1/12',
    'basis-1/6',
    'basis-1/4',
    'basis-1/3',
    'basis-5/12',
    'basis-1/2',
    'basis-7/12',
    'basis-2/3',
    'basis-3/4',
    'basis-5/6',
    'basis-11/12',
    'basis-full',
    'md:basis-auto',
    'basis-0 grow',

    'sm:basis-1/12',
    'sm:basis-1/6',
    'sm:basis-1/4',
    'sm:basis-1/3',
    'sm:basis-5/12',
    'sm:basis-1/2',
    'sm:basis-7/12',
    'sm:basis-2/3',
    'sm:basis-3/4',
    'sm:basis-5/6',
    'sm:basis-11/12',
    'sm:basis-full',
    'sm:basis-auto',
    'sm:basis-0 sm:grow',

    'md:basis-1/12',
    'md:basis-1/6',
    'md:basis-1/4',
    'md:basis-1/3',
    'md:basis-5/12',
    'md:basis-1/2',
    'md:basis-7/12',
    'md:basis-2/3',
    'md:basis-3/4',
    'md:basis-5/6',
    'md:basis-11/12',
    'md:basis-full',
    'md:basis-auto',
    'md:basis-0 md:grow',

    'lg:basis-1/12',
    'lg:basis-1/6',
    'lg:basis-1/4',
    'lg:basis-1/3',
    'lg:basis-5/12',
    'lg:basis-1/2',
    'lg:basis-7/12',
    'lg:basis-2/3',
    'lg:basis-3/4',
    'lg:basis-5/6',
    'lg:basis-11/12',
    'lg:basis-full',
    'lg:basis-auto',
    'lg:basis-0 lg:grow',

    'xl:basis-1/12',
    'xl:basis-1/6',
    'xl:basis-1/4',
    'xl:basis-1/3',
    'xl:basis-5/12',
    'xl:basis-1/2',
    'xl:basis-7/12',
    'xl:basis-2/3',
    'xl:basis-3/4',
    'xl:basis-5/6',
    'xl:basis-11/12',
    'xl:basis-full',
    'xl:basis-auto',
    'xl:basis-0 xl:grow',

    '2xl:basis-1/12',
    '2xl:basis-1/6',
    '2xl:basis-1/4',
    '2xl:basis-1/3',
    '2xl:basis-5/12',
    '2xl:basis-1/2',
    '2xl:basis-7/12',
    '2xl:basis-2/3',
    '2xl:basis-3/4',
    '2xl:basis-5/6',
    '2xl:basis-11/12',
    '2xl:basis-full',
    '2xl:basis-auto',
    '2xl:basis-0 2xl:grow',

    'order-first',
    'order-last',
  ],
} satisfies Config;
`;

const MAIN_CSS_PREFIX = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* a[target='_blank']:after {
    content: '\\1F5D7';
  } */

/*
    Hides Sitecore editor markup,
    if you run the app in connected mode while the Sitecore cookies
    are set to edit mode.
  */
.scChromeData,
.scpm {
  display: none !important;
}

/*
    Styles for default JSS error components
  */
.sc-jss-editing-error,
.sc-jss-placeholder-error {
  padding: 1em;
  background-color: lightyellow;
}

/* 
    Style for default content block
  */
.contentTitle {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.2;
}

a {
  text-decoration: none;
}

a:hover {
  @apply opacity-80;
}
.text-h1 {
  @apply text-4xl font-extrabold tracking-tight lg:text-5xl leading-none;
}
.text-h2 {
  @apply text-3xl font-semibold tracking-tight;
}
.text-h3 {
  @apply text-2xl font-semibold tracking-tight;
}
.text-h4 {
  @apply text-xl font-semibold tracking-tight;
}
.text-h5 {
  font-size: 1.1rem;
  font-weight: bold;
}
.text-h6 {
  font-size: 1rem;
  font-weight: bold;
}
.text-p {
  font-size: 1rem;
  font-weight: normal;
}
/* src/styles/globals.css */
.slick-next {
  @apply right-6 !important;
}
.slick-prev {
  @apply left-6 z-10 !important;
}
@layer base {
  :root,
  .fastlanewebsite {
`;

const MAIN_CSS_LIGHT_BLOCK_TEMPLATE = `    --accent: #f4f4f5;
    --accent-foreground: #0c4a6e;
    --background: #ffffff;
    --border: #d4d4d8;
    --card: #ffffff;
    --card-foreground: #09090b;
    --destructive: #dc2626;
    --destructive-foreground: #fef2f2;
    --foreground: #18181b;
    --input: #e4e4e7;
    --muted: #e4e4e7;
    --muted-foreground: #71717a;
    --popover: #ffffff;
    --popover-foreground: #09090b;
    --primary: #0c4a6e;
    --primary-foreground: #fafafa;
    --ring: #18181b;
    --secondary: #e4e4e7;
    --secondary-foreground: #18181b;
    --chart-1: #2a9d90;
    --chart-2: #e76e50;
    --chart-3: #274754;
    --chart-4: #e8c468;
    --chart-5: #f4a462;
    --sidebar-background: #fafafa;
    --sidebar-foreground: #1D4ED8;
    --sidebar-primary: #18181b;
    --sidebar-primary-foreground: #fafafa;
    --sidebar-accent: #f4f4f5;
    --sidebar-accent-foreground: #18181b;
    --sidebar-border: #e5e7eb;
    --sidebar-ring: #a1a1aa;
    --rounded-sm: 2px;
    --rounded-md: 6px;
    --rounded-lg: 8px;
    --rounded-xl: 12px;
    --rounded-full: 9999px;
    --text-xs: 12px;
    --leading-4: 16;
    --text-sm: 14px;
    --leading-5: 20;
    --text-base: 16px;
    --leading-6: 24;
    --text-lg: 18px;
    --leading-7: 28;
    --text-xl: 20px;
    --text-2xl: 24px;
    --leading-8: 32;
    --text-3xl: 30px;
    --leading-9: 36;
    --text-4xl: 36px;
    --leading-10: 40;
    --text-5xl: 48px;
    --semibold: 600;
    --tight: -0.4000000059604645;
    --normal: 400;
    --medium: 500;
    --bold: 700;

    /* Spacing */
    --spacing-0: 0px;
    --spacing-sm: 20px;
    --spacing-md: 30px;
    --spacing-lg: 50px;
    --spacing-xl: 75px;

     /* Height */
     --height-41: 41px;
     --height-137: 137px;
     --height-387: 387px;
     --height-600: 600px;

     /* width */
     --width-600: 600px;

    /* Shadow */
    --shadow-light: 0px 2px 6px rgba(0, 0, 0, 0.1);
    --shadow-medium: 0px 4px 12px rgba(0, 0, 0, 0.2);
    --shadow-heavy: 0px 8px 24px rgba(0, 0, 0, 0.3);
    --slate: #f1f5f9;
`;

const MAIN_CSS_MIDDLE = `  }

  .dark , .dark .fastlanewebsite {
`;

const MAIN_CSS_DARK_BLOCK_TEMPLATE = `    --slate: #082f49;
    --accent: #075985;
    --accent-foreground: #fafafa;
    --background: #082f49;
    --border: #0369a1;
    --card: #082f49;
    --card-foreground: #fafafa;
    --destructive: #7f1d1d;
    --destructive-foreground: #fef2f2;
    --foreground: #fafafa;
    --input: #075985;
    --muted: #075985;
    --muted-foreground: #a1a1aa;
    --popover: #09090b;
    --popover-foreground: #fafafa;
    --primary: #bae6fd;
    --primary-foreground: #18181b;
    --ring: #d4d4d8;
    --secondary: #0369a1;
    --secondary-foreground: #fafafa;
    --chart-1: #2662d9;
    --chart-2: #e23670;
    --chart-3: #e88c30;
    --chart-4: #af57db;
    --chart-5: #2eb88a;
    --sidebar-background: #18181b;
    --sidebar-foreground: #f4f4f5;
    --sidebar-primary: #1d4ed8;
    --sidebar-primary-foreground: #ffffff;
    --sidebar-accent: #27272a;
    --sidebar-accent-foreground: #f4f4f5;
    --sidebar-border: #27272a;
    --sidebar-ring: #d4d4d8;
`;

const MAIN_CSS_SUFFIX = `  }
  * {
    @apply border-border font-satoshi;
  }
  body {
    @apply bg-background text-foreground;
  }
  h1 {
    @apply text-h1 font-Zodiak;
  }
  h2 {
    @apply text-h2 font-Zodiak;
  }
  h3 {
    @apply text-h3 font-Zodiak;
  }
  h4 {
    @apply text-h4 font-Zodiak;
  }
  h5 {
    @apply text-h5 font-Zodiak;
  }
  h6 {
    @apply text-h6 font-Zodiak;
  }
  p {
    @apply text-p font-satoshi;
  }
}
.position-center,
.position-left,
.position-right {
  @apply flex items-center;
}
.position-center {
  @apply justify-center;
}
.position-left {
  @apply justify-start;
}
.position-right {
  @apply justify-end;
}

.grid-three-tile {
  @apply grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}

.grid-image-text-split,
.grid-equal-split {
  @apply grid-cols-1;
}

/* Common styles for both arrows */
.slick-prev,
.slick-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

/* Arrow icons */
.slick-prev::before,
.slick-next::before {
  font-size: 20px;
  color: white;
  opacity: 0.8;
}

/* Left arrow */
.slick-prev {
  left: 10px;
}

.slick-prev::before {
  content: '❮';
}

/* Right arrow */
.slick-next {
  right: 10px;
}

.slick-next::before {
  content: '❯';
}

/* Hover effect */
.slick-prev:hover::before,
.slick-next:hover::before {
  opacity: 1;
}
.slick-dots {
  bottom: 25px;
}
.slick-dots li button:before,
.slick-dots li.slick-active button:before {
  @apply text-white;
}
.slick-dots li button:before {
  @apply text-base;
}
@layer base {
  @import 'plyr/dist/plyr.css';
}
.bottom-low-space {
  @apply mb-5;
}
.bottom-medium-space {
  @apply mb-10;
}
.bottom-large-space {
  @apply mb-16;
}
.bottom-no-space {
  @apply mb-0;
}
.top-low-space {
  @apply mt-4;
}
.top-medium-space {
  @apply mt-10;
}
.top-large-space {
  @apply mt-16;
}
.top-no-space {
  @apply mt-0;
}
.editing-mode .inside-editing-mode {
  @apply opacity-100 visible pointer-events-auto;
}

.inside-editing-mode {
  @apply opacity-0 invisible pointer-events-none;
}
.linklist:first-child ul a {
  @apply text-lg font-semibold leading-7;
}

.linklist:nth-of-type(2) ul a {
  @apply text-sm font-medium leading-none;
}
header .submenu:last-child ul {
  right: 0;
  left: auto;
}
header .row.component.column-splitter.basis-full .row {
  @apply flex w-full;
}
header .row.component.column-splitter.basis-full .row .basis-full {
  flex-basis: unset;
}
header .column-splitter [class~='basis-1/2']:nth-child(2) .row {
@apply md:gap-6
}
.mega-nav-container .linklist a {
  @apply text-secondary-foreground mix-blend-normal;
}
header .column-splitter [class~='basis-1/2']:nth-child(1) .row {
  justify-content: flex-start;
}
.active-menu-item .meganav-item {
  display: block;
}

/* Styling for Carousel */

.editing-mode .carouselComponent .component-content {
  display: none;
}
.editing-mode .carouselComponent .slick-slider .component-content {
  display: block;
}

.carouselComponent.zoom-effect .slick-slide {
  transition: transform 0.4s ease, opacity 0.4s ease;
  opacity: 0.6;
  transform: scale(0.9);
}

.carouselComponent.zoom-effect .slick-center {
  opacity: 1;
  transform: scale(1.05);
  z-index: 2;
}

/*  */

`;
function generateTailwindArtifacts(
  exportData: CleanVariableExport
): TailwindArtifacts {
  const tailwindCollection = getCollectionByName(exportData, 'TailwindCSS');
  const themeCollection = getCollectionByName(exportData, 'Theme');
  const modeCollection = getCollectionByName(exportData, 'Mode');

  const tailwindMap = buildTokenMapForMode(tailwindCollection, 'Default');
  const themeMap = buildTokenMapForMode(themeCollection, 'Default');
  const lightModeMap = buildTokenMapForMode(modeCollection, 'Light');
  const darkModeMap = buildTokenMapForMode(modeCollection, 'Dark');

  const { lightVariables, darkVariables } = buildCssVariableMaps(
    tailwindMap,
    themeMap,
    lightModeMap,
    darkModeMap
  );

  const updatedLightBlock = updateCssBlock(
    MAIN_CSS_LIGHT_BLOCK_TEMPLATE,
    lightVariables
  );
  const updatedDarkBlock = updateCssBlock(
    MAIN_CSS_DARK_BLOCK_TEMPLATE,
    darkVariables
  );

  const mainCss =
    MAIN_CSS_PREFIX + updatedLightBlock + MAIN_CSS_MIDDLE + updatedDarkBlock + MAIN_CSS_SUFFIX;

  return {
    tailwindConfig: TAILWIND_CONFIG_TEMPLATE,
    mainCss,
  };
}

function getCollectionByName(
  exportData: CleanVariableExport,
  targetName: string
) {
  return exportData.collections.find(
    (collection) =>
      collection.name.toLowerCase() === targetName.toLowerCase().trim()
  );
}

function buildTokenMapForMode(
  collection:
    | CleanVariableExport['collections'][number]
    | undefined,
  modeName: string
): Map<string, string> {
  if (!collection) {
    return new Map();
  }

  const mode = collection.modes.find(
    (m) => m.name.toLowerCase() === modeName.toLowerCase()
  );

  if (!mode) {
    return new Map();
  }

  return buildTokenMapFromVariables(mode.variables as Record<string, unknown>);
}

function buildTokenMapFromVariables(
  variables: Record<string, unknown>
): Map<string, string> {
  const map = new Map<string, string>();

  for (const [category, value] of Object.entries(variables ?? {})) {
    const groups = normalizeGroupArray(value);
    flattenTokenGroups(groups, [category], map);
  }

  return map;
}

function normalizeGroupArray(value: unknown): CleanTokenGroup[] {
  if (Array.isArray(value)) {
    return value as CleanTokenGroup[];
  }

  if (value && typeof value === 'object' && 'name' in (value as any)) {
    return [value as CleanTokenGroup];
  }

  return [];
}

function flattenTokenGroups(
  groups: CleanTokenGroup[],
  path: string[],
  map: Map<string, string>
) {
  for (const group of groups) {
    const newPath = [...path, group.name];

    if (group.value !== undefined) {
      map.set(newPath.join('/'), String(group.value));
    }

    if (group.groups && group.groups.length > 0) {
      flattenTokenGroups(group.groups, newPath, map);
    }
  }
}

function filterMapByPrefix(
  source: Map<string, string>,
  prefix: string
): Map<string, string> {
  const result = new Map<string, string>();

  for (const [key, value] of source.entries()) {
    if (key.startsWith(prefix)) {
      result.set(key.slice(prefix.length), value);
    }
  }

  return result;
}

function buildCssVariableMaps(
  tailwindMap: Map<string, string>,
  themeMap: Map<string, string>,
  lightModeMap: Map<string, string>,
  darkModeMap: Map<string, string>
) {
  const lightVariables = new Map<string, string>();
  const darkVariables = new Map<string, string>();

  const setLight = (key: string, value: string | undefined) => {
    if (value !== undefined) {
      lightVariables.set(key, value);
    }
  };

  const setDark = (key: string, value: string | undefined) => {
    if (value !== undefined) {
      darkVariables.set(key, value);
    }
  };

  const setBoth = (key: string, value: string | undefined) => {
    if (value !== undefined) {
      lightVariables.set(key, value);
      darkVariables.set(key, value);
    }
  };

  for (const [key, value] of lightModeMap.entries()) {
    if (key.startsWith('base/')) {
      setLight(key.slice('base/'.length), value);
    } else if (key.startsWith('alpha/')) {
      setLight(key.slice('alpha/'.length), value);
    }
  }

  for (const [key, value] of darkModeMap.entries()) {
    if (key.startsWith('base/')) {
      setDark(key.slice('base/'.length), value);
    } else if (key.startsWith('alpha/')) {
      setDark(key.slice('alpha/'.length), value);
    }
  }

  const fontSizeMap = filterMapByPrefix(tailwindMap, 'font/size/');
  for (const [name, value] of fontSizeMap.entries()) {
    setBoth(name, value);
  }

  const lineHeightMap = filterMapByPrefix(tailwindMap, 'font/line-height/');
  for (const [name, value] of lineHeightMap.entries()) {
    setBoth(name, value);
  }

  const letterSpacingMap = filterMapByPrefix(
    tailwindMap,
    'font/letter-spacing/'
  );
  for (const [name, value] of letterSpacingMap.entries()) {
    setBoth(name, value);
  }

  const fontWeightMap = filterMapByPrefix(tailwindMap, 'font/weight/');
  for (const [name, value] of fontWeightMap.entries()) {
    setBoth(name, value);
  }

  const radiusMap = filterMapByPrefix(tailwindMap, 'radius/');
  for (const [name, value] of radiusMap.entries()) {
    setBoth(name, value);
  }

  const spacingMap = filterMapByPrefix(tailwindMap, 'spacing/');
  for (const [name, value] of spacingMap.entries()) {
    const cssVar = `spacing-${name.replace(/\//g, '-')}`;
    setBoth(cssVar, value);
  }

  const spacingAliases: Record<string, string> = {
    'spacing-sm': 'spacing-small',
    'spacing-md': 'spacing-medium',
    'spacing-lg': 'spacing-large',
    'spacing-xl': 'spacing-extra-large',
  };

  const spacingZero =
    themeMap.get('spacing/spacing-none') ?? spacingMap.get('0');
  setBoth('spacing-0', spacingZero);

  for (const [cssVar, tokenName] of Object.entries(spacingAliases)) {
    const value = themeMap.get(`spacing/${tokenName}`);
    setBoth(cssVar, value);
  }

  return { lightVariables, darkVariables };
}

function updateCssBlock(
  template: string,
  values: Map<string, string>
): string {
  return template.replace(
    /([ \t]*--[a-z0-9\-_]+):\s*([^;]+);/gi,
    (_, nameWithIndent: string, existing: string) => {
      const trimmed = nameWithIndent.trim();
      const varName = trimmed.startsWith('--') ? trimmed.slice(2) : trimmed;
      const newValue = values.get(varName);

      if (newValue === undefined) {
        return `${nameWithIndent}: ${existing};`;
      }

      return `${nameWithIndent}: ${newValue};`;
    }
  );
}

async function extractVariables() {
  try {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const variables = await figma.variables.getLocalVariablesAsync();

    const cleanExport = buildCleanVariableExport(collections, variables);
    const jsonStr = JSON.stringify(cleanExport, null, 2);

    figma.ui.postMessage({
      type: 'download-file',
      content: jsonStr,
      filename: 'variables.json',
    });
  } catch (error) {
    console.error('Error extracting variables:', error);
    figma.ui.postMessage({
      type: 'extract-error',
      message: 'Failed to extract variables',
    });
  }
}

async function generateTailwindAssetsAndDownload() {
  try {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const variables = await figma.variables.getLocalVariablesAsync();

    const cleanExport = buildCleanVariableExport(collections, variables);
    const { tailwindConfig, mainCss } =
      generateTailwindArtifacts(cleanExport);

    figma.ui.postMessage({
      type: 'download-file',
      content: tailwindConfig,
      filename: 'tailwind.config.ts',
    });

    figma.ui.postMessage({
      type: 'download-file',
      content: mainCss,
      filename: 'main.css',
    });
  } catch (error) {
    console.error('Error generating Tailwind assets:', error);
    figma.ui.postMessage({
      type: 'extract-error',
      message: 'Failed to generate Tailwind configuration assets',
    });
  }
}

async function extractStyles() {
  try {
    // Get all styles in the document using async methods
    const paintStyles = await figma.getLocalPaintStylesAsync();
    const textStyles = await figma.getLocalTextStylesAsync();

    // Process paint styles
    const paintStylesData = paintStyles.map((style) => {
      const styleDetails = {
        id: style.id,
        name: style.name,
        type: style.type,
        key: style.key,
        description: style.description || '',
        hexColor: '',
        isComplex: false,
        color: null as { r: number; g: number; b: number; a: number } | null,
      };

      // Paint style (colors)
      if (style.paints.length > 0 && style.paints[0].type === 'SOLID') {
        const solidPaint = style.paints[0] as SolidPaint;
        styleDetails.color = {
          r: solidPaint.color.r,
          g: solidPaint.color.g,
          b: solidPaint.color.b,
          a: solidPaint.opacity !== undefined ? solidPaint.opacity : 1,
        };

        // Convert to hex
        const r = Math.round(solidPaint.color.r * 255);
        const g = Math.round(solidPaint.color.g * 255);
        const b = Math.round(solidPaint.color.b * 255);
        const a = solidPaint.opacity !== undefined ? solidPaint.opacity : 1;
        styleDetails.hexColor =
          '#' +
          padString(r.toString(16), 2, '0') +
          padString(g.toString(16), 2, '0') +
          padString(b.toString(16), 2, '0');

        if (a < 1) {
          const alpha = Math.round(a * 255);
          styleDetails.hexColor += padString(alpha.toString(16), 2, '0');
        }
      } else {
        styleDetails.isComplex = true;
      }

      return styleDetails;
    });

    // Process text styles
    const textStylesData = textStyles.map((style) => {
      return {
        id: style.id,
        name: style.name,
        type: style.type,
        key: style.key,
        description: style.description || '',
        fontName: style.fontName,
        fontSize: style.fontSize,
        letterSpacing: style.letterSpacing,
        lineHeight: style.lineHeight,
        paragraphIndent: style.paragraphIndent,
        paragraphSpacing: style.paragraphSpacing,
        textCase: style.textCase,
        textDecoration: style.textDecoration,
      };
    });

    // Combine both types of styles
    const stylesData = [...paintStylesData, ...textStylesData];

    // Create a download link for the JSON file
    const jsonStr = JSON.stringify(stylesData, null, 2);

    // Use Figma's file system to save the file
    figma.ui.postMessage({
      type: 'download-file',
      content: jsonStr,
      filename: 'styles.json',
    });
  } catch (error) {
    console.error('Error extracting styles:', error);
    figma.ui.postMessage({
      type: 'extract-error',
      message: 'Failed to extract styles',
    });
  }
}

// Helper function to get all styles used by a node (and its children)
function getNodeStyles(node: SceneNode): any[] {
  const styles: any[] = [];

  // Process paint styles (fill, stroke, etc.)
  if ('fillStyleId' in node && node.fillStyleId) {
    try {
      const styleIds = Array.isArray(node.fillStyleId)
        ? node.fillStyleId
        : [node.fillStyleId];

      for (const id of styleIds) {
        if (id) {
          const style = figma.getStyleById(id);
          if (style) {
            styles.push({
              id: style.id,
              name: style.name,
              type: style.type,
              key: style.key,
              description: style.description || '',
            });
          }
        }
      }
    } catch (e) {
      console.error('Error processing fill style:', e);
    }
  }

  // Direct color extraction from fills (even if not styles)
  if ('fills' in node && Array.isArray(node.fills)) {
    try {
      for (let i = 0; i < node.fills.length; i++) {
        const fill = node.fills[i];
        if (fill && fill.type === 'SOLID' && fill.visible !== false) {
          // Check if this fill uses a variable
          const usesVariable =
            fill.boundVariables &&
            (fill.boundVariables.color || fill.boundVariables.opacity);

          // Extract color information
          const r = Math.round(fill.color.r * 255);
          const g = Math.round(fill.color.g * 255);
          const b = Math.round(fill.color.b * 255);
          const a = fill.opacity !== undefined ? fill.opacity : 1;

          // Convert to hex
          const hexColor =
            '#' +
            padString(r.toString(16), 2, '0') +
            padString(g.toString(16), 2, '0') +
            padString(b.toString(16), 2, '0');

          styles.push({
            id: `color-${i}-${node.id}`,
            name: usesVariable ? 'Variable Color' : `Color ${hexColor}`,
            type: 'DIRECT_COLOR',
            hexColor: hexColor,
            opacity: (a * 100).toFixed(0) + '%',
            rgbValue: `rgb(${r}, ${g}, ${b})`,
            usesVariable: !!usesVariable,
            colorVariableId: fill.boundVariables?.color?.id || null,
            opacityVariableId: fill.boundVariables?.opacity?.id || null,
          });
        }
      }
    } catch (e) {
      console.error('Error processing direct colors:', e);
    }
  }

  // Process stroke styles
  if ('strokeStyleId' in node && node.strokeStyleId) {
    try {
      const style = figma.getStyleById(node.strokeStyleId);
      if (style) {
        styles.push({
          id: style.id,
          name: style.name,
          type: style.type,
          key: style.key,
          description: style.description || '',
        });
      }
    } catch (e) {
      console.error('Error processing stroke style:', e);
    }
  }

  // Direct stroke color extraction
  if ('strokes' in node && Array.isArray(node.strokes)) {
    try {
      for (let i = 0; i < node.strokes.length; i++) {
        const stroke = node.strokes[i];
        if (stroke && stroke.type === 'SOLID' && stroke.visible !== false) {
          // Check if this stroke uses a variable
          const usesVariable =
            stroke.boundVariables &&
            (stroke.boundVariables.color || stroke.boundVariables.opacity);

          // Extract color information
          const r = Math.round(stroke.color.r * 255);
          const g = Math.round(stroke.color.g * 255);
          const b = Math.round(stroke.color.b * 255);
          const a = stroke.opacity !== undefined ? stroke.opacity : 1;

          // Convert to hex
          const hexColor =
            '#' +
            padString(r.toString(16), 2, '0') +
            padString(g.toString(16), 2, '0') +
            padString(b.toString(16), 2, '0');

          styles.push({
            id: `stroke-${i}-${node.id}`,
            name: usesVariable ? 'Variable Stroke' : `Stroke ${hexColor}`,
            type: 'DIRECT_STROKE',
            hexColor: hexColor,
            opacity: (a * 100).toFixed(0) + '%',
            rgbValue: `rgb(${r}, ${g}, ${b})`,
            usesVariable: !!usesVariable,
            colorVariableId: stroke.boundVariables?.color?.id || null,
            opacityVariableId: stroke.boundVariables?.opacity?.id || null,
          });
        }
      }
    } catch (e) {
      console.error('Error processing direct stroke colors:', e);
    }
  }

  // Process text styles
  if ('textStyleId' in node && node.textStyleId) {
    try {
      const styleIds = Array.isArray(node.textStyleId)
        ? node.textStyleId
        : [node.textStyleId];

      for (const id of styleIds) {
        if (id) {
          const style = figma.getStyleById(id);
          if (style) {
            styles.push({
              id: style.id,
              name: style.name,
              type: style.type,
              key: style.key,
              description: style.description || '',
            });
          }
        }
      }
    } catch (e) {
      console.error('Error processing text style:', e);
    }
  }

  // Process effect styles
  if ('effectStyleId' in node && node.effectStyleId) {
    try {
      const style = figma.getStyleById(node.effectStyleId);
      if (style) {
        styles.push({
          id: style.id,
          name: style.name,
          type: style.type,
          key: style.key,
          description: style.description || '',
        });
      }
    } catch (e) {
      console.error('Error processing effect style:', e);
    }
  }

  // Process grid styles
  if ('gridStyleId' in node && node.gridStyleId) {
    try {
      const style = figma.getStyleById(node.gridStyleId);
      if (style) {
        styles.push({
          id: style.id,
          name: style.name,
          type: style.type,
          key: style.key,
          description: style.description || '',
        });
      }
    } catch (e) {
      console.error('Error processing grid style:', e);
    }
  }

  // If this is a frame or group, recursively process children
  if ('children' in node) {
    for (const child of node.children) {
      styles.push(...getNodeStyles(child));
    }
  }

  // Remove duplicates by ID
  const uniqueStyles = [];
  const seenIds = new Set();

  for (const style of styles) {
    if (!seenIds.has(style.id)) {
      seenIds.add(style.id);
      uniqueStyles.push(style);
    }
  }

  return uniqueStyles;
}

// Helper function to get all variables used by a node (and its children)
async function getNodeVariables(node: SceneNode): Promise<any[]> {
  const variables: any[] = [];
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  // Check if node has bound variables
  try {
    if ('boundVariables' in node) {
      const boundVars = node.boundVariables as Record<string, any>;

      if (boundVars) {
        // Safely iterate through all properties
        for (const property in boundVars) {
          if (Object.prototype.hasOwnProperty.call(boundVars, property)) {
            const bound = boundVars[property];

            // Handle single variable binding
            if (bound && typeof bound === 'object' && 'id' in bound) {
              try {
                const varId = bound.id;
                const variable = await figma.variables.getVariableByIdAsync(
                  varId
                );

                if (variable) {
                  const collection = collections.find(
                    (c) => c.id === variable.variableCollectionId
                  );
                  variables.push({
                    id: variable.id,
                    name: variable.name,
                    type: variable.resolvedType,
                    collectionName: collection?.name || 'Unknown Collection',
                    property: property,
                  });
                }
              } catch (e) {
                console.error('Error processing variable:', e);
              }
            }

            // Handle array of variable bindings
            else if (bound && Array.isArray(bound)) {
              for (const binding of bound) {
                try {
                  if (
                    binding &&
                    typeof binding === 'object' &&
                    'id' in binding
                  ) {
                    const varId = binding.id;
                    const variable = await figma.variables.getVariableByIdAsync(
                      varId
                    );

                    if (variable) {
                      const collection = collections.find(
                        (c) => c.id === variable.variableCollectionId
                      );
                      variables.push({
                        id: variable.id,
                        name: variable.name,
                        type: variable.resolvedType,
                        collectionName:
                          collection?.name || 'Unknown Collection',
                        property: property,
                      });
                    }
                  }
                } catch (e) {
                  console.error('Error processing variable in array:', e);
                }
              }
            }
          }
        }
      }
    }

    // Special check for paint variables
    if ('fills' in node && Array.isArray(node.fills)) {
      for (const fill of node.fills) {
        if (fill && fill.type === 'SOLID' && fill.boundVariables) {
          // Check for color variable
          if (fill.boundVariables.color) {
            try {
              const varId = fill.boundVariables.color.id;
              const variable = await figma.variables.getVariableByIdAsync(
                varId
              );

              if (variable) {
                const collection = collections.find(
                  (c) => c.id === variable.variableCollectionId
                );
                variables.push({
                  id: variable.id,
                  name: variable.name,
                  type: variable.resolvedType,
                  collectionName: collection?.name || 'Unknown Collection',
                  property: 'fill.color',
                });
              }
            } catch (e) {
              console.error('Error processing fill color variable:', e);
            }
          }
          // Check for opacity variable
          if (fill.boundVariables.opacity) {
            try {
              const varId = fill.boundVariables.opacity.id;
              const variable = await figma.variables.getVariableByIdAsync(
                varId
              );

              if (variable) {
                const collection = collections.find(
                  (c) => c.id === variable.variableCollectionId
                );
                variables.push({
                  id: variable.id,
                  name: variable.name,
                  type: variable.resolvedType,
                  collectionName: collection?.name || 'Unknown Collection',
                  property: 'fill.opacity',
                });
              }
            } catch (e) {
              console.error('Error processing fill opacity variable:', e);
            }
          }
        }
      }
    }

    // Check stroke properties
    if ('strokes' in node && Array.isArray(node.strokes)) {
      for (const stroke of node.strokes) {
        if (stroke && stroke.type === 'SOLID' && stroke.boundVariables) {
          // Check for color variable
          if (stroke.boundVariables.color) {
            try {
              const varId = stroke.boundVariables.color.id;
              const variable = await figma.variables.getVariableByIdAsync(
                varId
              );

              if (variable) {
                const collection = collections.find(
                  (c) => c.id === variable.variableCollectionId
                );
                variables.push({
                  id: variable.id,
                  name: variable.name,
                  type: variable.resolvedType,
                  collectionName: collection?.name || 'Unknown Collection',
                  property: 'stroke.color',
                });
              }
            } catch (e) {
              console.error('Error processing stroke color variable:', e);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Error processing all variables:', e);
  }

  // If this is a frame or group, recursively process children
  if ('children' in node) {
    for (const child of node.children) {
      try {
        const childVars = await getNodeVariables(child);
        variables.push(...childVars);
      } catch (e) {
        console.error('Error processing child node variables:', e);
      }
    }
  }

  // Remove duplicates by ID
  const uniqueVariables = [];
  const seenIds = new Set();

  for (const variable of variables) {
    if (!seenIds.has(variable.id)) {
      seenIds.add(variable.id);
      uniqueVariables.push(variable);
    }
  }

  return uniqueVariables;
}

// Function to export styles and variables for the selected frame/layer
async function exportFrameAnalysis() {
  try {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1) {
      figma.ui.postMessage({
        type: 'extract-error',
        message: 'Please select exactly one layer for export',
      });
      return;
    }

    const node = selection[0];
    sendDebug(`Exporting analysis for ${node.name} (${node.type})`);

    // Get styles used by the node
    const stylesInfo = getNodeStyles(node);
    sendDebug(`Found ${stylesInfo.length} styles used by this node`);

    // Get variables used by the node
    const variablesInfo = await getNodeVariables(node);
    sendDebug(`Found ${variablesInfo.length} variables used by this node`);

    // Enhance styles with variable information
    const enhancedStylesInfo = stylesInfo.map((style) => {
      // For styles that have variable IDs, find and attach the variable information
      if (
        style.usesVariable &&
        (style.colorVariableId || style.opacityVariableId)
      ) {
        const styleWithVars = { ...style, variableInfo: [] };

        // Find color variable
        if (style.colorVariableId) {
          const colorVar = variablesInfo.find(
            (v) => v.id === style.colorVariableId
          );
          if (colorVar) {
            styleWithVars.variableInfo.push({
              id: colorVar.id,
              name: colorVar.name,
              type: colorVar.type,
              collectionName: colorVar.collectionName,
              property: 'color',
            });
          }
        }

        // Find opacity variable
        if (style.opacityVariableId) {
          const opacityVar = variablesInfo.find(
            (v) => v.id === style.opacityVariableId
          );
          if (opacityVar) {
            styleWithVars.variableInfo.push({
              id: opacityVar.id,
              name: opacityVar.name,
              type: opacityVar.type,
              collectionName: opacityVar.collectionName,
              property: 'opacity',
            });
          }
        }

        return styleWithVars;
      }

      return style;
    });

    // Create JSON data
    const analysisData = {
      nodeInfo: {
        id: node.id,
        name: node.name,
        type: node.type,
      },
      styles: enhancedStylesInfo,
      variables: variablesInfo,
    };

    // Create a download link for the JSON file
    const jsonStr = JSON.stringify(analysisData, null, 2);
    const filename = `${node.name
      .replace(/\s+/g, '-')
      .toLowerCase()}-analysis.json`;

    // Use Figma's file system to save the file
    figma.ui.postMessage({
      type: 'download-file',
      content: jsonStr,
      filename: filename,
    });

    sendDebug(`Analysis exported successfully as ${filename}`);
  } catch (error) {
    console.error('Error exporting frame analysis:', error);
    figma.ui.postMessage({
      type: 'extract-error',
      message: 'Failed to export frame analysis',
    });
  }
}
