import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCn } from 'src/test-utils';
import Modal from './Modal';

// Explicitly mock @sitecore-jss/sitecore-jss-nextjs
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: vi.fn(({ name, rendering }: any) => (
    <div data-testid="placeholder" data-name={name} data-rendering={JSON.stringify(rendering)} />
  )),
  Text: vi.fn(({ field }: any) => <span data-testid="text-component">{field?.value}</span>),
  withDatasourceCheck: () => (Component: any) => Component,
}));

// Explicitly mock lucide-react X icon
vi.mock('lucide-react', () => ({
  X: () => <svg data-testid="icon-x" />,
}));

// Use actual Button and Dialog implementations (Radix)

const mockFields = {
  Title: { value: 'Test Modal Title' },
  ButtonText: { value: 'Open Modal' },
  CTAMainLink: {
    value: {
      href: '/cta',
      text: 'CTA',
      linktype: 'external',
      url: '/cta',
      anchor: '',
      title: 'CTA',
      target: '_blank',
    },
  },
};

const mockParams = {
  DynamicPlaceholderId: '123',
};

const mockRendering = {
  componentName: 'Modal',
  params: mockParams,
};

describe('Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCn();
  });

  it('renders with required props', async () => {
    render(<Modal fields={mockFields} params={mockParams} rendering={mockRendering} />);
    // Button with correct text
    expect(screen.getByText('Open Modal')).toBeInTheDocument();
    // Title is not visible until dialog is open
    expect(screen.queryByText('Test Modal Title')).not.toBeInTheDocument();
  });

  it('opens dialog on button click and closes on close button', async () => {
    render(<Modal fields={mockFields} params={mockParams} rendering={mockRendering} />);
    // Open dialog
    await userEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    // Placeholder rendered with correct key
    expect(screen.getByTestId('placeholder')).toHaveAttribute('data-name', 'modal-123');
    // Close dialog
    await userEvent.click(screen.getByTestId('icon-x').closest('button')!);
    expect(screen.queryByText('Test Modal Title')).not.toBeInTheDocument();
  });

  it('renders with missing optional fields', async () => {
    const fields = { ...mockFields } as Partial<typeof mockFields>;
    delete fields.CTAMainLink;
    render(<Modal fields={fields as any} params={mockParams} rendering={mockRendering} />);
    await userEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
  });

  it('handles different DynamicPlaceholderId values', async () => {
    render(
      <Modal
        fields={mockFields}
        params={{ DynamicPlaceholderId: 'abc' }}
        rendering={mockRendering}
      />
    );
    await userEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByTestId('placeholder')).toHaveAttribute('data-name', 'modal-abc');
  });

  it('handles empty fields gracefully', async () => {
    const fields = { Title: { value: '' }, ButtonText: { value: '' } };
    render(<Modal fields={fields as any} params={mockParams} rendering={mockRendering} />);
    expect(screen.getByTestId('text-component')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('text-component'));
    // Should not crash, dialog should open (even if title is empty)
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });

  it('handles missing params gracefully', async () => {
    render(<Modal fields={mockFields} params={{} as any} rendering={mockRendering} />);
    await userEvent.click(screen.getByText('Open Modal'));
    // Placeholder key should be 'modal-undefined'
    expect(screen.getByTestId('placeholder')).toHaveAttribute('data-name', 'modal-undefined');
  });

  it('handles missing rendering prop gracefully', async () => {
    render(<Modal fields={mockFields} params={mockParams} rendering={undefined as any} />);
    await userEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });

  it('passes correct props to Placeholder and Text', async () => {
    render(<Modal fields={mockFields} params={mockParams} rendering={mockRendering} />);
    await userEvent.click(screen.getByText('Open Modal'));
    // Placeholder receives correct rendering prop
    expect(screen.getByTestId('placeholder')).toHaveAttribute(
      'data-rendering',
      JSON.stringify(mockRendering)
    );
    // Text receives correct field values
    expect(screen.getAllByTestId('text-component')[0]).toHaveTextContent('Open Modal');
    expect(screen.getAllByTestId('text-component')[1]).toHaveTextContent('Test Modal Title');
  });
});
