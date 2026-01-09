import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeaderNavigation from './HeaderNavigation';

describe('HeaderNavigation', () => {
  it('renders with menu closed by default', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>, <li key="2">Item 2</li>];

    render(
      <HeaderNavigation isOpenMenu={false} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden md:block');
    expect(nav).not.toHaveClass('block');
  });

  it('renders with menu open', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>, <li key="2">Item 2</li>];

    render(
      <HeaderNavigation isOpenMenu={true} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('block');
    expect(nav).not.toHaveClass('hidden md:block');
  });

  it('renders all navigation items', () => {
    const mockSetIsOpenMenu = vi.fn();
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

    render(
      <HeaderNavigation isOpenMenu={true} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    expect(screen.getByTestId('nav-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-3')).toBeInTheDocument();
  });

  it('toggles menu when button is clicked', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>];

    render(
      <HeaderNavigation isOpenMenu={false} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const toggleButton = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(toggleButton);

    expect(mockSetIsOpenMenu).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpenMenu).toHaveBeenCalledWith(true);
  });

  it('displays "Menu" text when menu is closed', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>];

    render(
      <HeaderNavigation isOpenMenu={false} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const toggleButton = screen.getByRole('button', { name: 'Open menu' });
    expect(toggleButton).toHaveTextContent('Menu');
  });

  it('displays "Close" text when menu is open', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>];

    render(
      <HeaderNavigation isOpenMenu={true} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const toggleButton = screen.getByRole('button', { name: 'Close menu' });
    expect(toggleButton).toHaveTextContent('Close');
  });

  it('has correct aria-label when menu is closed', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>];

    render(
      <HeaderNavigation isOpenMenu={false} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('has correct aria-label when menu is open', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>];

    render(
      <HeaderNavigation isOpenMenu={true} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
  });

  it('renders empty list gracefully', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList: React.ReactNode[] = [];

    render(
      <HeaderNavigation isOpenMenu={true} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    const ul = nav.querySelector('ul');
    expect(ul).toBeInTheDocument();
    expect(ul?.children).toHaveLength(0);
  });

  it('applies correct CSS classes', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>];

    const { container } = render(
      <HeaderNavigation isOpenMenu={false} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('relative');
    expect(wrapper).toHaveClass('flex-col');
    expect(wrapper).toHaveClass('w-full');

    const button = screen.getByRole('button');
    expect(button).toHaveClass('md:hidden');
    expect(button).toHaveClass('p-2');
    expect(button).toHaveClass('focus:outline-none');

    const ul = screen.getByRole('list');
    expect(ul).toHaveClass('flex');
    expect(ul).toHaveClass('flex-col');
  });

  it('handles state change correctly', () => {
    const mockSetIsOpenMenu = vi.fn();
    const mockList = [<li key="1">Item 1</li>];

    const { rerender } = render(
      <HeaderNavigation isOpenMenu={false} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    let nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden md:block');

    rerender(
      <HeaderNavigation isOpenMenu={true} setIsOpenMenu={mockSetIsOpenMenu} list={mockList} />
    );

    nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('block');
  });
});
