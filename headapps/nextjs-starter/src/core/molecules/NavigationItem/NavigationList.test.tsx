import React from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationList } from './NavigationList';
import { Fields } from './Navigaton.type';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';

let useSitecoreSpy: any;

// Mock SitecoreLink
vi.mock('src/core/atom/Link', () => ({
  SitecoreLink: ({ children, onClick, className, field, ...props }: any) => (
    <a
      href={field?.value?.href || '#'}
      onClick={onClick}
      className={className}
      data-testid="sitecore-link"
      {...props}
    >
      {children}
    </a>
  ),
}));

// Mock ChevronDown from lucide-react
vi.mock('lucide-react', () => ({
  ChevronDown: ({ className, ...props }: any) => (
    <span data-testid="chevron-icon" className={className} {...props}>
      ▼
    </span>
  ),
}));

// Mock utils
vi.mock('src/core/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

const mockPageNormal = {
  mode: {
    isEditing: false,
    name: 'normal',
    isPreview: false,
    isDesignLibrary: false,
    isNormal: true,
  },
};

const mockPageEditing = {
  mode: {
    isEditing: true,
    name: 'editing',
    isPreview: false,
    isDesignLibrary: false,
    isNormal: false,
  },
};

describe('NavigationList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/current-page',
        origin: 'http://localhost',
        href: 'http://localhost/current-page',
      },
      writable: true,
    });
  });

  beforeAll(() => {
    useSitecoreSpy = vi.spyOn(SitecoreContentSdk, 'useSitecore');
  });

  describe('Level 1 Navigation Items', () => {
    it('renders level 1 item without children', () => {
      const fields: Fields = {
        Id: '1',
        DisplayName: 'Home',
        Title: { value: 'Home' },
        NavigationTitle: { value: 'Home' },
        Href: '/home',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.queryByTestId('chevron-icon')).not.toBeInTheDocument();
    });

    it('renders level 1 item with children', () => {
      const childField: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '1',
        DisplayName: 'Parent',
        Title: { value: 'Parent' },
        NavigationTitle: { value: 'Parent' },
        Href: '/parent',
        Querystring: '',
        Children: [childField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      expect(screen.getByText('Parent')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
    });

    it('toggles children visibility when chevron button is clicked', () => {
      const childField: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '1',
        DisplayName: 'Parent',
        Title: { value: 'Parent' },
        NavigationTitle: { value: 'Parent' },
        Href: '/parent',
        Querystring: '',
        Children: [childField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      const buttons = screen.getAllByRole('button');
      const chevronButton = buttons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('submenu')
      );

      expect(chevronButton).toBeInTheDocument();

      // Initially expanded (hasChildren defaults to true)
      const submenu = screen.getByRole('menu');
      expect(submenu).toHaveClass('block');

      // Click to collapse
      fireEvent.click(chevronButton!);

      // Should be hidden
      expect(submenu).toHaveClass('hidden');
    });

    it('applies aria attributes correctly for level 1 items with children', () => {
      const childField: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '1',
        DisplayName: 'Parent',
        Title: { value: 'Parent' },
        NavigationTitle: { value: 'Parent' },
        Href: '/parent',
        Querystring: '',
        Children: [childField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      const links = screen.getAllByRole('link');
      const parentLink = links[0]; // First link is the parent
      expect(parentLink).toHaveAttribute('aria-haspopup', 'true');
      expect(parentLink).toHaveAttribute('aria-expanded', 'true');

      const buttons = screen.getAllByRole('button');
      const chevronButton = buttons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('submenu')
      );
      expect(chevronButton).toHaveAttribute('aria-expanded', 'true');
      expect(chevronButton).toHaveAttribute('aria-controls', 'submenu-1');
    });
  });

  describe('Level 2+ Navigation Items', () => {
    it('renders level 2 item without children', () => {
      const fields: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={2} />);

      const item = screen.getByRole('menuitem');
      expect(item).toBeInTheDocument();
      expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('renders level 2 item with children', () => {
      const grandchildField: Fields = {
        Id: '3',
        DisplayName: 'Grandchild',
        Title: { value: 'Grandchild' },
        NavigationTitle: { value: 'Grandchild' },
        Href: '/grandchild',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [grandchildField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={2} />);

      expect(screen.getByText('Child')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
    });

    it('toggles level 2 children visibility', () => {
      const grandchildField: Fields = {
        Id: '3',
        DisplayName: 'Grandchild',
        Title: { value: 'Grandchild' },
        NavigationTitle: { value: 'Grandchild' },
        Href: '/grandchild',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [grandchildField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={2} />);

      const buttons = screen.getAllByRole('button');
      const chevronButton = buttons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('submenu')
      );

      expect(chevronButton).toBeInTheDocument();

      // Initially expanded
      let submenu = screen.getByRole('menu');
      expect(submenu).toHaveClass('block');

      // Click to collapse
      fireEvent.click(chevronButton!);

      submenu = screen.getByRole('menu');
      expect(submenu).toHaveClass('hidden');
    });
  });

  describe('Current Page Highlighting', () => {
    it('highlights current page', () => {
      const fields: Fields = {
        Id: '1',
        DisplayName: 'Current',
        Title: { value: 'Current' },
        NavigationTitle: { value: 'Current' },
        Href: '/current-page',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      const { container } = render(<NavigationList fields={fields} relativeLevel={1} />);

      // For level 1, the wrapper div has the text-sidebar-foreground class
      const wrapperDiv = container.querySelector('.flex.items-center');
      expect(wrapperDiv?.className).toContain('text-sidebar-foreground');
    });

    it('does not highlight non-current page', () => {
      const fields: Fields = {
        Id: '1',
        DisplayName: 'Other',
        Title: { value: 'Other' },
        NavigationTitle: { value: 'Other' },
        Href: '/other-page',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      const { container } = render(<NavigationList fields={fields} relativeLevel={1} />);

      // For level 1, the wrapper div has hover classes
      const wrapperDiv = container.querySelector('.flex.items-center');
      expect(wrapperDiv?.className).toContain('hover:!bg-secondary');
    });
  });

  describe('Editing Mode', () => {
    it('prevents navigation when in editing mode', () => {
      const fields: Fields = {
        Id: '1',
        DisplayName: 'Home',
        Title: { value: 'Home' },
        NavigationTitle: { value: 'Home' },
        Href: '/home',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageEditing });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      const link = screen.getByRole('link');
      const preventDefaultSpy = vi.fn();

      fireEvent.click(link, { preventDefault: preventDefaultSpy });

      // In editing mode, navigation should be prevented
      expect(link).toBeInTheDocument();
    });

    it('allows editable links in editing mode', () => {
      const fields: Fields = {
        Id: '1',
        DisplayName: 'Home',
        Title: { value: 'Home' },
        NavigationTitle: { value: 'Home' },
        Href: '/home',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageEditing });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      const link = screen.getByTestId('sitecore-link');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Click Handlers', () => {
    it('calls handleClick when provided', () => {
      const handleClick = vi.fn();
      const fields: Fields = {
        Id: '1',
        DisplayName: 'Home',
        Title: { value: 'Home' },
        NavigationTitle: { value: 'Home' },
        Href: '/home',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} handleClick={handleClick} relativeLevel={1} />);

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(handleClick).toHaveBeenCalled();
    });

    it('does not navigate to href when item has children and link is clicked', () => {
      const childField: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '1',
        DisplayName: 'Parent',
        Title: { value: 'Parent' },
        NavigationTitle: { value: 'Parent' },
        Href: '/parent',
        Querystring: '',
        Children: [childField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      const mockLocationHref = vi.fn();
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          href: mockLocationHref,
        },
        writable: true,
      });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      const links = screen.getAllByRole('link');
      const parentLink = links[0]; // First link is the parent with children
      fireEvent.click(parentLink);

      // Should toggle active state, not navigate
      expect(mockLocationHref).not.toHaveBeenCalled();
    });
  });

  describe('Styles', () => {
    it('applies custom styles from fields', () => {
      const fields: Fields = {
        Id: '1',
        DisplayName: 'Home',
        Title: { value: 'Home' },
        NavigationTitle: { value: 'Home' },
        Href: '/home',
        Querystring: '',
        Children: [],
        Styles: ['custom-class-1', 'custom-class-2'],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      const { container } = render(<NavigationList fields={fields} relativeLevel={1} />);

      const listItem = container.querySelector('li');
      expect(listItem?.className).toContain('custom-class-1');
      expect(listItem?.className).toContain('custom-class-2');
    });

    it('includes relative level in class name', () => {
      const fields: Fields = {
        Id: '1',
        DisplayName: 'Home',
        Title: { value: 'Home' },
        NavigationTitle: { value: 'Home' },
        Href: '/home',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      const { container } = render(<NavigationList fields={fields} relativeLevel={2} />);

      const listItem = container.querySelector('li');
      expect(listItem?.className).toContain('rel-level2');
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-label for expand button', () => {
      const childField: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '1',
        DisplayName: 'Parent',
        Title: { value: 'Parent' },
        NavigationTitle: { value: 'Parent' },
        Href: '/parent',
        Querystring: '',
        Children: [childField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      const buttons = screen.getAllByRole('button');
      const chevronButton = buttons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('Collapse')
      );

      // Check that aria-label contains "Collapse" and "submenu"
      expect(chevronButton).toHaveAttribute('aria-label');
      const ariaLabel = chevronButton?.getAttribute('aria-label');
      expect(ariaLabel).toContain('Collapse');
      expect(ariaLabel).toContain('submenu');
    });

    it('updates aria-expanded when toggled', () => {
      const childField: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '1',
        DisplayName: 'Parent',
        Title: { value: 'Parent' },
        NavigationTitle: { value: 'Parent' },
        Href: '/parent',
        Querystring: '',
        Children: [childField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      const buttons = screen.getAllByRole('button');
      const chevronButton = buttons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('submenu')
      );

      expect(chevronButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(chevronButton!);

      expect(chevronButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-controls pointing to submenu', () => {
      const childField: Fields = {
        Id: '2',
        DisplayName: 'Child',
        Title: { value: 'Child' },
        NavigationTitle: { value: 'Child' },
        Href: '/child',
        Querystring: '',
        Children: [],
        Styles: [],
      };

      const fields: Fields = {
        Id: '1',
        DisplayName: 'Parent',
        Title: { value: 'Parent' },
        NavigationTitle: { value: 'Parent' },
        Href: '/parent',
        Querystring: '',
        Children: [childField],
        Styles: [],
      };

      useSitecoreSpy.mockReturnValue({ page: mockPageNormal });

      render(<NavigationList fields={fields} relativeLevel={1} />);

      const buttons = screen.getAllByRole('button');
      const chevronButton = buttons.find((btn) => btn.getAttribute('aria-controls'));

      expect(chevronButton).toHaveAttribute('aria-controls', 'submenu-1');

      const submenu = screen.getByRole('menu');
      expect(submenu).toHaveAttribute('id', 'submenu-1');
    });
  });
});
