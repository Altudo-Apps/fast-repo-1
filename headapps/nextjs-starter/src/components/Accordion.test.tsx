import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import React from 'react';

// Mock Sitecore Content SDK components used by Accordion
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: vi.fn(({ name }: any) => <div data-testid="accordion-placeholder">{name}</div>),
  withDatasourceCheck: () => (Component: any) => Component,
  useSitecore: vi.fn(() => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  })),
}));

// Mock the UI Accordion component
vi.mock('src/core/ui/accordion', () => ({
  Accordion: vi.fn(({ type, className, collapsible, defaultValue, children }: any) => (
    <div
      data-testid="ui-accordion"
      data-type={type}
      data-collapsible={collapsible}
      data-default-value={defaultValue?.join?.(',') || ''}
      className={className}
    >
      {children}
    </div>
  )),
}));

type Field<T> = { value: T };

type Fields = {
  id: string;
};

type ComponentParams = { [key: string]: string };
type ComponentRendering = {
  uid?: string;
  params: ComponentParams;
  componentName: string;
  placeholders?: Record<string, any[]>;
};

type AccordionProps = {
  params: ComponentParams;
  fields: Fields;
  rendering: ComponentRendering;
};

describe('Accordion', () => {
  let useSitecore: any;
  let Accordion: any;

  beforeEach(async () => {
    mockCn();
    vi.clearAllMocks();

    // Get the mocked useSitecore
    const sdk = await import('@sitecore-content-sdk/nextjs');
    useSitecore = sdk.useSitecore;

    // Import the component
    const module = await import('./Accordion');
    Accordion = module.Accordion;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with required props in non-editing mode', () => {
    useSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
    });

    const props: AccordionProps = {
      params: { DynamicPlaceholderId: 'test-id', styles: 'custom-class' },
      fields: { id: 'accordion-1' },
      rendering: {
        uid: 'accordion-uid',
        params: { DynamicPlaceholderId: 'test-id' },
        componentName: 'Accordion',
      },
    };

    render(<Accordion {...props} />);

    const accordion = screen.getByTestId('ui-accordion');
    expect(accordion).toBeInTheDocument();
    expect(accordion).toHaveAttribute('data-type', 'single');
    expect(accordion).toHaveAttribute('data-collapsible', 'true');
    expect(accordion).toHaveClass('w-full', 'font-satoshi');

    const placeholder = screen.getByTestId('accordion-placeholder');
    expect(placeholder).toHaveTextContent('accord-test-id');
  });

  it('renders with required props in editing mode', () => {
    useSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: true,
        },
      },
    });

    const props: AccordionProps = {
      params: { DynamicPlaceholderId: 'edit-id', styles: 'edit-styles' },
      fields: { id: 'accordion-2' },
      rendering: {
        uid: 'accordion-edit-uid',
        params: { DynamicPlaceholderId: 'edit-id' },
        componentName: 'Accordion',
      },
    };

    render(<Accordion {...props} />);

    const accordion = screen.getByTestId('ui-accordion');
    expect(accordion).toBeInTheDocument();
    expect(accordion).toHaveAttribute('data-type', 'multiple');
    expect(accordion).not.toHaveAttribute('data-collapsible');
    expect(accordion).toHaveClass('w-full', 'font-satoshi');
  });

  it('handles placeholders with items in editing mode', () => {
    useSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: true,
        },
      },
    });

    const props: AccordionProps = {
      params: { DynamicPlaceholderId: 'placeholder-id', styles: '' },
      fields: { id: 'accordion-3' },
      rendering: {
        uid: 'accordion-placeholder-uid',
        params: { DynamicPlaceholderId: 'placeholder-id' },
        componentName: 'Accordion',
        placeholders: {
          'accord-{*}': [
            { params: { DynamicPlaceholderId: 'item-1' } },
            { params: { DynamicPlaceholderId: 'item-2' } },
            { params: { DynamicPlaceholderId: 'item-3' } },
          ],
        },
      },
    };

    render(<Accordion {...props} />);

    const accordion = screen.getByTestId('ui-accordion');
    expect(accordion).toBeInTheDocument();

    const defaultValue = accordion.getAttribute('data-default-value');
    expect(defaultValue).toContain('item-accordcontent-item-1');
    expect(defaultValue).toContain('item-accordcontent-item-2');
    expect(defaultValue).toContain('item-accordcontent-item-3');
  });

  it('handles empty placeholders in editing mode', () => {
    useSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: true,
        },
      },
    });

    const props: AccordionProps = {
      params: { DynamicPlaceholderId: 'empty-id', styles: 'test-class' },
      fields: { id: 'accordion-4' },
      rendering: {
        uid: 'accordion-empty-uid',
        params: { DynamicPlaceholderId: 'empty-id' },
        componentName: 'Accordion',
        placeholders: {},
      },
    };

    render(<Accordion {...props} />);

    const accordion = screen.getByTestId('ui-accordion');
    expect(accordion).toBeInTheDocument();
    expect(accordion.getAttribute('data-default-value')).toBe('');
  });

  it('handles placeholders with items without DynamicPlaceholderId', () => {
    useSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: true,
        },
      },
    });

    const props: AccordionProps = {
      params: { DynamicPlaceholderId: 'mixed-id', styles: '' },
      fields: { id: 'accordion-5' },
      rendering: {
        uid: 'accordion-mixed-uid',
        params: { DynamicPlaceholderId: 'mixed-id' },
        componentName: 'Accordion',
        placeholders: {
          'accord-{*}': [
            { params: { DynamicPlaceholderId: 'valid-1' } },
            { params: {} }, // No DynamicPlaceholderId
            { params: { DynamicPlaceholderId: 'valid-2' } },
            {}, // No params
          ],
        },
      },
    };

    render(<Accordion {...props} />);

    const accordion = screen.getByTestId('ui-accordion');
    const defaultValue = accordion.getAttribute('data-default-value');

    // Should only include items with valid DynamicPlaceholderId
    expect(defaultValue).toContain('item-accordcontent-valid-1');
    expect(defaultValue).toContain('item-accordcontent-valid-2');
  });

  it('applies custom styles from params', () => {
    useSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
    });

    const props: AccordionProps = {
      params: { DynamicPlaceholderId: 'style-id', styles: 'my-custom-class bg-primary' },
      fields: { id: 'accordion-6' },
      rendering: {
        uid: 'accordion-style-uid',
        params: { DynamicPlaceholderId: 'style-id' },
        componentName: 'Accordion',
      },
    };

    const { container } = render(<Accordion {...props} />);

    const wrapper = container.querySelector('.my-custom-class');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('bg-primary');
  });

  it('handles missing DynamicPlaceholderId', () => {
    useSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
    });

    const props: AccordionProps = {
      params: { styles: 'test' },
      fields: { id: 'accordion-7' },
      rendering: {
        uid: 'accordion-no-id',
        params: {},
        componentName: 'Accordion',
      },
    };

    render(<Accordion {...props} />);

    const placeholder = screen.getByTestId('accordion-placeholder');
    expect(placeholder).toHaveTextContent('accord-undefined');
  });
});
