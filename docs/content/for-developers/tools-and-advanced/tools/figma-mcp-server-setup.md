# Figma MCP Server Setup Guide

## Overview

The Figma MCP (Model Context Protocol) Server brings Figma directly into your development workflow by providing design information and context to AI agents in Cursor. This enables seamless design-to-code generation using Figma files.

🎯 **What You'll Achieve**: Direct integration between Figma designs and Cursor for AI-powered component generation.

## Prerequisites

- **Figma Desktop App** (latest version) - The MCP server only works with the desktop app, not the web version
- **Cursor IDE** with MCP support enabled
- **Figma Plan**: Dev or Full seat on Professional, Organization, or Enterprise plans
- **Design File Access**: Figma Design files you want to generate code from

## Step 1: Enable the Figma MCP Server

### 1.1 Update Figma Desktop App
1. Download and install the latest version of [Figma Desktop App](https://www.figma.com/downloads/)
2. Launch the Figma desktop application
3. Ensure you're signed in to your Figma account

### 1.2 Enable the MCP Server
1. **Open any Figma Design file** (the server needs an active design context)
2. **Access Figma menu** in the upper-left corner of the application
3. **Navigate to Preferences** from the dropdown menu
4. **Enable local MCP Server"** option (on some figma it will be showing as enable local MCP Server)
5. **Confirm activation** - You should see a confirmation message at the bottom of the screen


![screenshot](/images/guides/figma-setting-mcp-server.png "screenshot")
*Figma MCP Server option*

![screenshot](/images/guides/figma-mcp-server.png "screenshot")
*Figma MCP Server successfully enabled and running with "Local server" status*

✅ **Success Indicator**: The server will run locally at `http://127.0.0.1:3845/sse`

### 1.3 Verify Server Status
Check that the MCP server is running properly:
- The confirmation message should indicate the server is "enabled and running"
- Keep the Figma desktop app open while using the MCP server
- The server automatically stops when Figma is closed


## Step 2: Configure Cursor for MCP Integration

### 2.1 Access Cursor MCP Settings
1. **Open Cursor IDE**
2. **Navigate to Settings**:
   - Mac: `Cursor → Settings → Cursor Settings` or `⌘,`
   - Windows/Linux: `File → Preferences → Settings` or `Ctrl+,`
3. Navigate to the appropriate tab in the settings panel — this will be either the **MCP tab** or the **Tools & Integrations tab**, depending on your Cursor version — and click on Add Custom MCP.

### 2.2 Add Figma MCP Server
1. **Click "+ Add new global MCP server"**
2. **Enter the server configuration**:
   ```json
   {
     "mcpServers": {
       "Figma": {
         "url": "http://127.0.0.1:3845/mcp"
       }
     }
   }
   ```
3. **Save the configuration**

![screenshot](/images/guides/cursor-settings-mcp-figma.png "screenshot")
*Cursor MCP configuration showing the Figma server setup with the correct URL*

### 2.3 Verify Connection
1. **Restart Cursor** to ensure the configuration loads properly
2. **Check Tools & Integrations** in Cursor settings
3. **Confirm Figma MCP tools are available**:
   - `get_code` - Generate React + Tailwind code from Figma selections
   - `get_variable_defs` - Extract design tokens and variables
   - `get_code_connect_map` - Map Figma components to code components
   - `get_image` - Generate images from Figma selections
   - `create_design_system_rules` - Generate design system guidelines

![screenshot](/images/guides/cursor-settings-tools-integrations-mcp.png "screenshot")
*Tools & Integrations showing Figma MCP server enabled with all available tools*

✅ **Success Indicator**: You should see the Figma MCP server listed as "Connected" with available tools.

## Step 3: Test the Integration

### 3.1 Selection-Based Testing
1. **Open a Figma design file** in the desktop app
2. **Select a frame or component** you want to generate code for
3. **Switch to Cursor** and start a chat session
4. **Prompt the AI**: "Generate a React component from my current Figma selection"
5. **Verify**: The AI should access your Figma selection and generate appropriate code

### 3.2 Link-Based Testing
1. **Copy a Figma frame link**:
   - Right-click on any frame in Figma
   - Select "Copy link to frame"
2. **In Cursor**, prompt: "Generate code for this Figma design: [paste link]"
3. **Verify**: The AI should fetch the design from the provided URL

## Available MCP Tools

The Figma MCP Server provides several specialized tools:

### `get_code`
- **Purpose**: Generate structured React + Tailwind code from Figma selections
- **Use**: Primary tool for component generation
- **Output**: Ready-to-use React component code

### `get_variable_defs`
- **Purpose**: Extract design tokens, colors, spacing, typography
- **Use**: Ensure generated code uses your design system tokens
- **Output**: Variable definitions and style mappings

### `get_code_connect_map`
- **Purpose**: Map Figma components to existing codebase components
- **Use**: Reuse existing components instead of creating new ones
- **Output**: Component mapping for consistent code generation

### `get_image`
- **Purpose**: Extract images and assets from Figma
- **Use**: Include actual design assets in generated code
- **Output**: Image URLs and asset references

### `create_design_system_rules`
- **Purpose**: Generate design system guidelines for the repository
- **Use**: Create consistent styling rules across the project
- **Output**: Design system documentation and rules

## Best Practices for Optimal Results

### Figma File Structure
- **Use components** for reusable elements (buttons, cards, inputs)
- **Link components to code** via Code Connect when possible
- **Use variables** for spacing, colors, typography, and border radius
- **Name layers semantically** (e.g., `ButtonPrimary`, not `Rectangle 1`)
- **Use Auto Layout** to communicate responsive behavior
- **Add annotations** for complex interactions or behaviors

### Effective Prompting
- **Be specific** about framework preferences: "Generate React component using ShadCN UI"
- **Reference design tokens**: "Use Figma variables for colors and spacing"
- **Specify file organization**: "Add this to `/components/ui/`"
- **Request existing component usage**: "Use existing Button component from the design system"

### Component Generation Tips
- **Select smaller sections** for better, faster results
- **Generate components incrementally** rather than entire pages
- **Test responsive behavior** by resizing frames in Figma first
- **Use Code Connect** mappings when available for consistency

## Troubleshooting

### Common Issues and Solutions

#### MCP Server Not Connecting
- **Verify Figma desktop app is running** and has a design file open
- **Check server URL** is exactly `http://127.0.0.1:3845/sse`
- **Restart both Figma and Cursor** to refresh connections
- **Ensure latest versions** of both applications

#### No Tools Available in Cursor
- **Confirm MCP server is enabled** in Figma preferences
- **Check Cursor MCP configuration** is saved properly
- **Restart Cursor** after configuration changes
- **Verify Figma plan permissions** (requires Dev or Full seat)

#### Generated Code Quality Issues
- **Improve Figma file structure** following best practices above
- **Be more specific in prompts** about requirements and constraints
- **Use Code Connect** to map components to existing codebase
- **Generate smaller selections** for more manageable outputs

#### Connection Drops
- **Keep Figma desktop app open** during development sessions
- **Avoid switching between multiple Figma files** rapidly
- **Close and reopen design files** if connection becomes unstable

## Security and Privacy

- **Local Server**: The MCP server runs locally on your machine (`127.0.0.1:3845`)
- **No External Data**: Design data stays on your local machine
- **Authentication**: Uses your existing Figma account authentication
- **File Access**: Only accesses files you have permission to view in Figma

## Next Steps

Once you have the Figma MCP Server properly configured:

1. **Practice with simple components** to understand the workflow
2. **Set up Code Connect** mappings for your existing components
3. **Use the create-component.md prompt** for systematic component generation
4. **Establish team guidelines** for Figma file structure and naming conventions

---

**Related Resources:**
- [Using the create-component.md Prompt Guide](../../component-development/ai-prompts/guide-using-create-component-prompt.md) - How to generate components systematically
- [All Developer Prompts](../../component-development/ai-prompts/) - Complete prompt library for development
- [Figma Official MCP Documentation](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server) - Official setup guide

📋 **Pro Tip**: The Figma MCP Server is a prerequisite for using AI-powered component generation prompts. Ensure this setup is complete before attempting to generate components from Figma designs. 
