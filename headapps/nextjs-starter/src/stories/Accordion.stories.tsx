import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Accordion from 'src/components/Accordion';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  Page,
  SitecoreProvider,
  LayoutServicePageState,
} from '@sitecore-content-sdk/nextjs';
import { AccordionProps } from 'src/types/MyAccordion';
import { apiStub, mockLayoutData, mockRoute } from './stubs';
import componentMap from '../../.sitecore/component-map';
import { canvasWithin, expect, userEvent } from './testUtils';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type AccordionStoryFields = AccordionProps['fields'] & {
  id?: string;
};

interface ExtendedAccordionProps extends Omit<AccordionProps, 'fields'> {
  fields?: AccordionStoryFields;
}

const accordionParams: ComponentParams = {
  DynamicPlaceholderId: '8',
  FieldNames: 'Default',
  styles: 'lg:order-0 lg:ml-0 lg:mr-auto position-left',
  Styles: 'position-left',
  GridParameters: 'lg:order-0 lg:ml-0 lg:mr-auto',
  RenderingIdentifier: 'storybook-accordion',
};

const accordionPanels: ComponentRendering[] = [
  {
    uid: 'accordion-panel-1',
    componentName: 'AccordionPanel',
    dataSource: '{11111111-1111-1111-1111-111111111111}',
    params: { DynamicPlaceholderId: 'panel-1' },
    fields: {
      AccordionPanelTitle: { value: 'Residency Training Requirements' } as Field<string>,
    },
    placeholders: {
      'accordcontent-panel-1': [
        {
          uid: 'accordion-panel-1-content',
          componentName: 'FLRichText',
          params: { styles: 'text-sm space-y-2' },
          fields: {
            Text: {
              value:
                '<p>One of the requirements for sitting for the Specialty Qualifying Exam is a signed Residency Training Affidavit.</p><p>Use this accordion item to communicate key eligibility criteria.</p>',
            },
          },
        },
      ],
    },
  },
  {
    uid: 'accordion-panel-2',
    componentName: 'AccordionPanel',
    dataSource: '{22222222-2222-2222-2222-222222222222}',
    params: { DynamicPlaceholderId: 'panel-2' },
    fields: {
      AccordionPanelTitle: { value: 'Handling Transfers' } as Field<string>,
    },
    placeholders: {
      'accordcontent-panel-2': [
        {
          uid: 'accordion-panel-2-content',
          componentName: 'FLRichText',
          params: { styles: 'text-sm space-y-2' },
          fields: {
            Text: {
              value:
                '<p>Provide guidance for managing residents who transfer or withdraw mid-program.</p><ul><li>Update residency dates promptly</li><li>Notify accreditation leads</li><li>Capture documentation</li></ul>',
            },
          },
        },
      ],
    },
  },
];

const accordionRendering: ComponentRendering & { params: ComponentParams } = {
  componentName: 'Accordion',
  uid: 'storybook-accordion-rendering',
  dataSource: '{D1D99364-11DB-4406-AEE2-4BD0DD4EA57F}',
  params: accordionParams,
  placeholders: {
    'accord-{*}': accordionPanels,
    [`accord-${accordionParams.DynamicPlaceholderId}`]: accordionPanels,
  },
};

type Story = StoryFn<ExtendedAccordionProps>;

const storyRoute = {
  ...(mockRoute ?? {}),
  placeholders: {
    ...((mockRoute && mockRoute.placeholders) || {}),
    [`accord-${accordionParams.DynamicPlaceholderId}`]: accordionPanels,
  },
  name: mockRoute?.name ?? 'accordion-story',
  itemId: mockRoute?.itemId ?? 'accordion-story-item',
};

const storyPage: Page = {
  layout: {
    ...mockLayoutData,
    sitecore: {
      ...mockLayoutData.sitecore,
      context: {
        ...mockLayoutData.sitecore.context,
        pageEditing: false,
      },
      route: storyRoute,
    },
  },
  locale: mockLayoutData.sitecore.context.language ?? 'en',
  mode: {
    name: LayoutServicePageState.Normal,
    isNormal: true,
    isPreview: false,
    isEditing: false,
    isDesignLibrary: false,
    designLibrary: {
      isVariantGeneration: false,
    },
  },
};

const Template: Story = (args) => {
  const componentArgs = args;

  const safeFields: AccordionStoryFields & { id: string } = {
    ...(componentArgs.fields ?? { items: [] }),
    id: componentArgs.fields?.id ?? 'storybook-accordion',
  };

  const safeArgs = {
    ...componentArgs,
    rendering: componentArgs.rendering ?? accordionRendering,
    fields: safeFields,
    params: componentArgs.params ?? accordionParams,
  } as AccordionProps;

  return (
    <SitecoreProvider componentMap={componentMap} api={apiStub} page={storyPage}>
      <Accordion {...safeArgs} />
    </SitecoreProvider>
  );
};

export const Default = Template.bind({});
const defaultFigmaUrl =
  'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=59-429&t=Vc3qd11g1zwPq73Y-4';
Default.args = {
  rendering: accordionRendering,
  fields: {
    id: 'storybook-default-accordion',
    items: [],
  },
  params: accordionParams,
} as ExtendedAccordionProps;

Default.parameters = {
  design: {
    type: 'figma',
    url: defaultFigmaUrl,
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  const residencyTrigger = await canvas.findByRole('button', {
    name: /residency training requirements/i,
  });
  const handlingTrigger = await canvas.findByRole('button', {
    name: /handling transfers/i,
  });

  await expect(residencyTrigger).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(residencyTrigger);
  await expect(residencyTrigger).toHaveAttribute('aria-expanded', 'true');

  await userEvent.click(handlingTrigger);
  await expect(canvas.getByText(/provide guidance for managing residents/i)).toBeVisible();
  await expect(residencyTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(handlingTrigger).toHaveAttribute('aria-expanded', 'true');
};
