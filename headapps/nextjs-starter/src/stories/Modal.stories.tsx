import React from 'react';
import type { Meta, StoryContext, StoryFn } from '@storybook/react';
import ModalComponent from 'src/components/Modal';
import type { ModalProps } from 'src/types/Modal.types';
import {
  ComponentParams,
  ComponentRendering,
  NextjsContentSdkComponent,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import { Default as FLRichText } from 'src/components/FLRichText';
import { apiStub, mockPage } from './stubs';
import { canvasWithin, expect, userEvent } from './testUtils';

type StoryProps = ModalProps;

const componentFactory = new Map<string, NextjsContentSdkComponent>([
  ['FLRichText', FLRichText],
  ['Modal', ModalComponent],
]);

const modalParams: ComponentParams = {
  DynamicPlaceholderId: 'content',
  ButtonStyle: 'primary',
  Styles: 'position-center',
  RenderingIdentifier: 'storybook-modal',
  styles: 'position-center',
};

const modalContentPlaceholder: ComponentRendering[] = [
  {
    uid: 'modal-richtext-1',
    componentName: 'FLRichText',
    params: { styles: 'text-sm text-muted-foreground space-y-3' },
    fields: {
      Text: {
        value:
          '<p>This modal content is powered by Sitecore placeholder rendering.</p><p>You can add any component to the placeholder to build rich experiences in the dialog body.</p>',
      },
    },
  },
  {
    uid: 'modal-richtext-2',
    componentName: 'FLRichText',
    params: { styles: 'text-sm text-muted-foreground space-y-2' },
    fields: {
      Text: {
        value:
          '<ul><li>Composable layout driven by placeholder</li><li>Supports text, images, and CTAs</li><li>Matches the real XM Cloud modal experience</li></ul>',
      },
    },
  },
] as ComponentRendering[];

const modalRendering: ComponentRendering & { params: ComponentParams } = {
  componentName: 'Modal',
  dataSource: '{11111111-1111-1111-1111-111111111111}',
  uid: 'storybook-modal-rendering',
  params: modalParams,
  placeholders: {
    'modal-content': modalContentPlaceholder,
  },
};

const baseFields: StoryProps['fields'] = {
  Title: { value: 'Stay in the loop' },
  ButtonText: { value: 'Open modal' },
};

const Template: StoryFn<StoryProps> = (args: StoryProps) => (
  <SitecoreProvider componentMap={componentFactory} api={apiStub} page={mockPage}>
    <div className="flex justify-center items-start p-8">
      <ModalComponent {...args} />
    </div>
  </SitecoreProvider>
);

const meta: Meta<typeof ModalComponent> = {
  title: 'Components/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    params: { control: 'object' },
    fields: { control: 'object' },
  },
};

export default meta;

export const Default = Template.bind({});
Default.args = {
  rendering: modalRendering,
  params: modalParams,
  fields: baseFields,
};
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=366-372&t=BsOOMRsPFkuNiXem-4',
  },
  a11y: {
    config: {
      rules: [
        {
          // Radix UI Dialog pattern: hidden elements may contain focusable elements when closed
          id: 'aria-hidden-focus',
          enabled: false,
        },
      ],
    },
  },
};

Default.play = async ({ canvasElement }: StoryContext<StoryProps>) => {
  const canvas = canvasWithin(canvasElement);

  // Find and click the open button
  const openButton = await canvas.findByRole('button', { name: /open modal/i });
  await expect(openButton).toBeVisible();
  await userEvent.click(openButton);

  // Dialog renders in a portal outside canvasElement, so query from document.body
  const body = canvasWithin(document.body);
  const dialog = await body.findByRole('dialog');
  await expect(dialog).toBeVisible();

  // Verify title is visible in the dialog
  await expect(body.getByText(/stay in the loop/i)).toBeVisible();
};

export const OutlineButton = Template.bind({});
OutlineButton.args = {
  ...Default.args,
  params: {
    ...modalParams,
    ButtonStyle: 'outline',
    Styles: 'position-right',
    styles: 'position-right',
  },
  fields: {
    ...baseFields,
    ButtonText: { value: 'Show outline modal' },
  },
};

export const WithMinimalContent = Template.bind({});
WithMinimalContent.args = {
  ...Default.args,
  fields: {
    Title: { value: 'Need more info?' },
    ButtonText: { value: 'Quick view' },
  },
  rendering: {
    ...modalRendering,
    placeholders: {
      'modal-content': [
        {
          uid: 'modal-minimal',
          componentName: 'FLRichText',
          params: { styles: 'text-sm text-muted-foreground' },
          fields: {
            Text: { value: '<p>This modal has a single paragraph of content.</p>' },
          },
        },
      ],
    },
  },
};
