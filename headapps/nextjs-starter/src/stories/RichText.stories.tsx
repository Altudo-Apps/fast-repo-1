import type { Meta, StoryObj } from '@storybook/react';
import { Default as RichText } from 'components/sxa/RichText';
import { canvasWithin, expect } from './testUtils';

// Extend the type to include figmaUrl
type RichTextStoryArgs = Parameters<typeof RichText>[0] & {
  figmaUrl?: string;
  markup?: string;
};

const meta: Meta<RichTextStoryArgs> = {
  title: 'Components/RichText',
  component: RichText,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    markup: {
      control: {
        type: 'text',
      },
      description: 'HTML/markup content to display in the rich text component',
      table: {
        category: 'Content',
      },
    },
    figmaUrl: {
      control: 'text',
      description: 'Figma design URL for this component',
      table: {
        category: 'Design',
      },
    },
  },
};

export default meta;

type Story = StoryObj<RichTextStoryArgs>;

// Default markup example
const defaultMarkup =
  '<h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3> <p>This is a <strong>rich text</strong> component with some <em>formatted</em> content.</p>';

export const Interactive: Story = {
  args: {
    params: {
      styles: 'rich-text-default',
      RenderingIdentifier: 'rich-text-interactive',
    },
    fields: {
      Text: {
        value: defaultMarkup,
      },
    },
    markup: defaultMarkup,
    figmaUrl:
      'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1543&p=f&t=gHsDYoHhRsZYOrFI-0',
  },
  render: (args) => {
    // Use custom markup if provided, otherwise use default
    const markupToUse = args.markup || defaultMarkup;

    // Create a modified version of fields with the current markup
    const modifiedFields = {
      ...args.fields,
      Text: {
        value: markupToUse,
      },
    };

    return (
      <div>
        <RichText
          rendering={{
            componentName: 'RichText',
            dataSource: '',
            uid: 'rich-text-1',
            placeholders: {},
            params: {},
          }}
          params={args.params}
          fields={modifiedFields}
        />
      </div>
    );
  },
};
Interactive.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1651&t=UMEjrtOKmNdHlXif-4',
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const heading = await canvas.findByRole('heading', { name: /lorem ipsum dolor sit amet/i });
  await expect(heading).toBeVisible();
  const paragraph = await canvas.findByText(/this is a/i);
  await expect(paragraph).toBeVisible();
};

export const Default: Story = {
  args: {
    params: {
      styles: 'rich-text-default',
      RenderingIdentifier: 'rich-text-1',
    },
    fields: {
      Text: {
        value:
          '<h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo sapiente numquam sequi porro autem odit, vero provident consequuntur hic exercitationem.</h3> <p>This is a <strong>rich text</strong> component with some <em>formatted</em> content.</p>',
      },
    },
    figmaUrl:
      'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1651&t=UMEjrtOKmNdHlXif-4',
  },
};
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1651&t=UMEjrtOKmNdHlXif-4',
  },
};
export const WithHeading: Story = {
  args: {
    params: {
      styles: 'rich-text-default',
      RenderingIdentifier: 'rich-text-2',
    },
    fields: {
      Text: {
        value: '<h1>Title</h1><p>This is a heading applied through props.</p>',
      },
    },
  },
};
WithHeading.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1651&t=UMEjrtOKmNdHlXif-4',
  },
};

export const WithLists: Story = {
  args: {
    params: {
      styles: 'rich-text-default',
      RenderingIdentifier: 'rich-text-3',
    },
    fields: {
      Text: {
        value:
          '<h3>Lists Example</h3><ul><li>Unordered item 1</li><li>Unordered item 2</li><li>Unordered item 3</li></ul><ol><li>Ordered item 1</li><li>Ordered item 2</li><li>Ordered item 3</li></ol>',
      },
    },
  },
};
WithLists.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1651&t=UMEjrtOKmNdHlXif-4',
  },
};

export const WithLinks: Story = {
  args: {
    params: {
      styles: 'rich-text-default',
      RenderingIdentifier: 'rich-text-4',
    },
    fields: {
      Text: {
        value:
          '<h3>Links Example</h3><p>Visit our <a href="https://www.example.com">website</a> for more information or check out our <a href="https://www.example.com/blog">blog</a>.</p>',
      },
    },
    figmaUrl: 'https://www.figma.com/file/rich-text-links-design',
  },
};
WithLinks.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1651&t=UMEjrtOKmNdHlXif-4',
  },
};

export const WithTables: Story = {
  args: {
    params: {
      styles: 'rich-text-default',
      RenderingIdentifier: 'rich-text-5',
    },
    fields: {
      Text: {
        value:
          '<h3>Table Example</h3><table border="1"><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Row 1, Cell 1</td><td>Row 1, Cell 2</td><td>Row 1, Cell 3</td></tr><tr><td>Row 2, Cell 1</td><td>Row 2, Cell 2</td><td>Row 2, Cell 3</td></tr></tbody></table>',
      },
    },
  },
};
WithTables.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1651&t=UMEjrtOKmNdHlXif-4',
  },
};
export const Complex: Story = {
  args: {
    params: {
      styles: 'rich-text-default',
      RenderingIdentifier: 'rich-text-6',
    },
    fields: {
      Text: {
        value:
          '<h2>Complex Example</h2><p>This example includes <strong>bold text</strong>, <em>italic text</em>, and <u>underlined text</u>.</p><h3>Feature List</h3><ul><li>Feature with <a href="#">link</a></li><li>Feature with <code>inline code</code></li><li>Feature with <mark>highlighted text</mark></li></ul><blockquote>This is a blockquote that demonstrates how quoted text appears in the component.</blockquote>',
      },
    },
  },
};
Complex.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=352-1651&t=UMEjrtOKmNdHlXif-4',
  },
};
