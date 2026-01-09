import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';

// Component under test (loaded dynamically after mocks)
let AccordionPanel: typeof import('./AccordionPanel').AccordionPanel;

// Mock Sitecore Content SDK components used by AccordionPanel
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: vi.fn(({ field }: any) => <span data-testid="accordionpanel-title">{field?.value}</span>),
  Placeholder: vi.fn(({ name }: any) => <div data-testid="accordionpanel-placeholder">{name}</div>),
  withDatasourceCheck: () => (Component: any) => Component,
}));

// Use the real Accordion primitives? For unit tests we mock to inspect class/value
vi.mock('src/core/ui/accordion', () => ({
  AccordionItem: vi.fn(({ value, className, children }: any) => (
    <div data-testid="accordion-item" data-value={value} className={className}>
      {children}
    </div>
  )),
  AccordionTrigger: vi.fn(({ className, children }: any) => (
    <button data-testid="accordion-trigger" className={className}>
      {children}
    </button>
  )),
  AccordionContent: vi.fn(({ className, children }: any) => (
    <div data-testid="accordion-content" className={className}>
      {children}
    </div>
  )),
}));

type Field<T> = { value: T };

type Fields = {
  id: string;
  AccordionPanelTitle?: Field<string>;
};

type ComponentParams = { [key: string]: string };
type ComponentRendering = { uid?: string; params: ComponentParams } & {
  componentName: string;
};

type NeoTabProps = {
  params: ComponentParams;
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

const makeProps = (
  dynamicPlaceholderId?: string,
  title: string = 'My Title',
  uid?: string
): NeoTabProps => ({
  params: dynamicPlaceholderId ? { DynamicPlaceholderId: dynamicPlaceholderId } : {},
  fields: { id: 'accordionpanel-1', AccordionPanelTitle: { value: title } },
  rendering: {
    uid,
    params: dynamicPlaceholderId ? { DynamicPlaceholderId: dynamicPlaceholderId } : {},
    componentName: 'AccordionPanel',
  },
});

describe('AccordionPanel (accordion-based)', () => {
  beforeEach(async () => {
    mockCn();
    vi.clearAllMocks();
    const module = await import('./AccordionPanel');
    AccordionPanel = module.AccordionPanel;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with required props and passes correct values/classes', async () => {
    const props = makeProps('abc', 'Accordion Panel Title', 'uid-1');

    render(<AccordionPanel {...(props as any)} />);

    const item = screen.getByTestId('accordion-item');
    expect(item).toHaveAttribute('data-value', 'item-accordcontent-abc');
    expect(item).toHaveClass('border-b', 'border-muted');

    const trigger = screen.getByTestId('accordion-trigger');
    expect(trigger).toHaveClass(
      'px-4',
      'text-p',
      'font-medium',
      'hover:no-underline',
      '!font-satoshi'
    );
    expect(screen.getByTestId('accordionpanel-title')).toHaveTextContent('Accordion Panel Title');

    const content = screen.getByTestId('accordion-content');
    expect(content).toHaveClass('px-4');
    expect(screen.getByTestId('accordionpanel-placeholder')).toHaveTextContent('accordcontent-abc');
  });

  it('handles missing DynamicPlaceholderId gracefully', async () => {
    const props = makeProps(undefined, 'No ID');

    render(<AccordionPanel {...(props as any)} />);

    const item = screen.getByTestId('accordion-item');
    expect(item).toHaveAttribute('data-value', 'item-accordcontent-undefined');
    expect(screen.getByTestId('accordionpanel-placeholder')).toHaveTextContent(
      'accordcontent-undefined'
    );
  });

  it('handles missing title field gracefully', async () => {
    const props = makeProps('zzz', '', 'uid-x');
    (props as any).fields = { id: 'accordionpanel-2', AccordionPanelTitle: { value: '' } };

    render(<AccordionPanel {...(props as any)} />);

    expect(screen.getByTestId('accordionpanel-title')).toHaveTextContent('');
  });
});
