import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { getNavigationText, getLinkField, getLinkTitle } from './NavigationUtils';
import { NavigationListProps } from './Navigaton.type';

// Mock Text component from Sitecore
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="text-field">{field?.value || ''}</span>,
}));

describe('NavigationUtils', () => {
  describe('getNavigationText', () => {
    it('returns Text component with NavigationTitle when available', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: { value: 'Nav Title Value' },
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getNavigationText(props);
      const { container } = render(<div>{result}</div>);

      expect(container.querySelector('[data-testid="text-field"]')).toBeInTheDocument();
    });

    it('returns Text component with Title when NavigationTitle is not available', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: undefined as any,
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getNavigationText(props);
      const { container } = render(<div>{result}</div>);

      expect(container.querySelector('[data-testid="text-field"]')).toBeInTheDocument();
    });

    it('returns DisplayName when neither NavigationTitle nor Title is available', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: undefined as any,
          NavigationTitle: undefined as any,
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getNavigationText(props);

      expect(result).toBe('Display Name');
    });

    it('prioritizes NavigationTitle over Title', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: { value: 'Nav Title Value' },
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getNavigationText(props);
      const { container } = render(<div>{result}</div>);

      // Should use NavigationTitle
      expect(container.querySelector('[data-testid="text-field"]')).toBeInTheDocument();
    });
  });

  describe('getLinkField', () => {
    it('returns LinkField with correct structure', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: { value: 'Nav Title Value' },
          Href: '/test-page',
          Querystring: '?param=value',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkField(props);

      expect(result).toEqual({
        value: {
          href: '/test-page',
          title: 'Nav Title Value',
          querystring: '?param=value',
        },
      });
    });

    it('handles missing querystring', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: undefined as any,
          Href: '/test-page',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkField(props);

      expect(result.value.querystring).toBe('');
    });

    it('uses Title when NavigationTitle is not available', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: undefined as any,
          Href: '/test-page',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkField(props);

      expect(result.value.title).toBe('Title Value');
    });

    it('uses DisplayName when neither NavigationTitle nor Title is available', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: undefined as any,
          NavigationTitle: undefined as any,
          Href: '/test-page',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkField(props);

      expect(result.value.title).toBe('Display Name');
    });
  });

  describe('getLinkTitle', () => {
    it('returns NavigationTitle value when available', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: { value: 'Nav Title Value' },
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkTitle(props);

      expect(result).toBe('Nav Title Value');
    });

    it('returns Title value when NavigationTitle is not available', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: undefined as any,
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkTitle(props);

      expect(result).toBe('Title Value');
    });

    it('returns DisplayName when neither NavigationTitle nor Title is available', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: undefined as any,
          NavigationTitle: undefined as any,
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkTitle(props);

      expect(result).toBe('Display Name');
    });

    it('handles empty NavigationTitle value', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: { value: '' },
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkTitle(props);

      // Should fall back to Title since NavigationTitle is empty
      expect(result).toBe('Title Value');
    });

    it('converts value to string', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 123 as any },
          NavigationTitle: undefined as any,
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkTitle(props);

      expect(result).toBe('123');
    });

    it('prioritizes NavigationTitle over Title and DisplayName', () => {
      const props: NavigationListProps = {
        fields: {
          Id: '1',
          DisplayName: 'Display Name',
          Title: { value: 'Title Value' },
          NavigationTitle: { value: 'Nav Title Value' },
          Href: '/test',
          Querystring: '',
          Children: [],
          Styles: [],
        },
      };

      const result = getLinkTitle(props);

      expect(result).toBe('Nav Title Value');
      expect(result).not.toBe('Title Value');
      expect(result).not.toBe('Display Name');
    });
  });
});
