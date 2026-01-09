import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MobileNav from './MobileNav';

describe('MobileNav', () => {
  it('renders with menu closed', () => {
    const mockList = [<li key="1">Item 1</li>, <li key="2">Item 2</li>];

    const { container } = render(<MobileNav isOpenMenu={false} list={mockList} />);

    const mobileNav = container.firstChild as HTMLElement;
    expect(mobileNav).toHaveClass('translate-x-full');
    expect(mobileNav).not.toHaveClass('translate-x-0');
  });

  it('renders with menu open', () => {
    const mockList = [<li key="1">Item 1</li>, <li key="2">Item 2</li>];

    const { container } = render(<MobileNav isOpenMenu={true} list={mockList} />);

    const mobileNav = container.firstChild as HTMLElement;
    expect(mobileNav).toHaveClass('translate-x-0');
    expect(mobileNav).toHaveClass('pt-28');
    expect(mobileNav).not.toHaveClass('translate-x-full');
  });

  it('renders all navigation items', () => {
    const mockList = [
      <li key="1" data-testid="nav-item-1">
        Item 1
      </li>,
      <li key="2" data-testid="nav-item-2">
        Item 2
      </li>,
      <li key="3" data-testid="nav-item-3">
        Item 3
      </li>,
    ];

    render(<MobileNav isOpenMenu={true} list={mockList} />);

    expect(screen.getByTestId('nav-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-3')).toBeInTheDocument();
  });

  it('applies correct base CSS classes', () => {
    const mockList = [<li key="1">Item 1</li>];

    const { container } = render(<MobileNav isOpenMenu={false} list={mockList} />);

    const mobileNav = container.firstChild as HTMLElement;
    expect(mobileNav).toHaveClass('fixed');
    expect(mobileNav).toHaveClass('inset-0');
    expect(mobileNav).toHaveClass('z-20');
    expect(mobileNav).toHaveClass('bg-white');
    expect(mobileNav).toHaveClass('overflow-y-auto');
    expect(mobileNav).toHaveClass('transition-transform');
    expect(mobileNav).toHaveClass('duration-300');
    expect(mobileNav).toHaveClass('ease-in-out');
    expect(mobileNav).toHaveClass('lg:hidden');
    expect(mobileNav).toHaveClass('top-0');
  });

  it('renders navigation with correct structure', () => {
    const mockList = [<li key="1">Item 1</li>];

    const { container } = render(<MobileNav isOpenMenu={true} list={mockList} />);

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('pt-2');
    expect(nav).toHaveClass('pb-20');

    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    expect(ul).toHaveClass('flex');
    expect(ul).toHaveClass('flex-col');
    expect(ul).toHaveClass('divide-y');
    expect(ul).toHaveClass('divide-gray-200');
  });

  it('renders empty list gracefully', () => {
    const mockList: React.ReactNode[] = [];

    const { container } = render(<MobileNav isOpenMenu={true} list={mockList} />);

    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    expect(ul?.children).toHaveLength(0);
  });

  it('transitions between open and closed states', () => {
    const mockList = [<li key="1">Item 1</li>];

    const { container, rerender } = render(<MobileNav isOpenMenu={false} list={mockList} />);

    let mobileNav = container.firstChild as HTMLElement;
    expect(mobileNav).toHaveClass('translate-x-full');

    rerender(<MobileNav isOpenMenu={true} list={mockList} />);

    mobileNav = container.firstChild as HTMLElement;
    expect(mobileNav).toHaveClass('translate-x-0');
    expect(mobileNav).toHaveClass('pt-28');
  });

  it('handles multiple navigation items', () => {
    const mockList = [];
    for (let i = 0; i < 10; i++) {
      mockList.push(
        <li key={i} data-testid={`nav-item-${i}`}>
          Item {i}
        </li>
      );
    }

    render(<MobileNav isOpenMenu={true} list={mockList} />);

    for (let i = 0; i < 10; i++) {
      expect(screen.getByTestId(`nav-item-${i}`)).toBeInTheDocument();
    }
  });

  it('has overflow-y-auto for scrollable content', () => {
    const mockList = [<li key="1">Item 1</li>];

    const { container } = render(<MobileNav isOpenMenu={true} list={mockList} />);

    const mobileNav = container.firstChild as HTMLElement;
    expect(mobileNav).toHaveClass('overflow-y-auto');
  });

  it('is hidden on large screens', () => {
    const mockList = [<li key="1">Item 1</li>];

    const { container } = render(<MobileNav isOpenMenu={true} list={mockList} />);

    const mobileNav = container.firstChild as HTMLElement;
    expect(mobileNav).toHaveClass('lg:hidden');
  });
});
