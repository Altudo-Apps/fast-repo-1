import React from 'react';
import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Location from './Location';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';
import { LocationResult } from 'src/types/LocationsListing.types';

let useSitecoreSpy: any;

// Mock Card component
vi.mock('src/core/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock location data
const mockLocationData: LocationResult = {
  locationID: 'loc-123',
  locationName: 'Test Medical Center',
  locationPhone: '123-456-7890',
  locationFax: '123-456-7891',
  locationStreet1: '123 Main St',
  locationStreet2: 'Suite 100',
  locationCity: 'Dallas',
  locationState: 'TX',
  locationZip: '75001',
  locationUrl: 'https://example.com',
  locationType: 'Hospital',
  photoUrl: 'https://example.com/photo.jpg',
  distance: 5.5,
  officeHourDescription: 'Mon-Fri 8am-5pm',
  specialties: 'Cardiology, Neurology',
  perks: 'Free parking, Wifi',
  openNow: true,
  openNowMessage: 'Open until 5pm',
  isOpen24Hours: false,
  hasExtendedHours: true,
  allowWalkIns: true,
  usesMyBSWHealth: true,
  waitingRoomCount: 3,
  coordinates: {
    lat: 32.7767,
    lon: -96.797,
  },
  insuranceAccepted: [],
};

describe('Location', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    useSitecoreSpy = vi.spyOn(SitecoreContentSdk, 'useSitecore').mockReturnValue({
      page: {
        locationData: mockLocationData,
      },
    } as any);
  });

  it('renders location with all data fields', () => {
    render(<Location />);

    // Check card is rendered
    expect(screen.getByTestId('card')).toBeInTheDocument();

    // Check location name
    expect(screen.getByText('Test Medical Center')).toBeInTheDocument();

    // Check location type
    expect(screen.getByText('Hospital')).toBeInTheDocument();

    // Check address (formatted)
    expect(screen.getByText(/123 Main St, Suite 100, Dallas, TX, 75001/)).toBeInTheDocument();

    // Check phone
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '123-456-7890' })).toHaveAttribute(
      'href',
      'tel:123-456-7890'
    );

    // Check fax
    expect(screen.getByText(/Fax: 123-456-7891/)).toBeInTheDocument();

    // Website is intentionally hidden (BSW-related external URL)
    // expect(screen.getByText('https://example.com')).toBeInTheDocument();

    // Check office hours
    expect(screen.getByText('Mon-Fri 8am-5pm')).toBeInTheDocument();

    // Check specialties
    expect(screen.getByText('Cardiology, Neurology')).toBeInTheDocument();

    // Check perks
    expect(screen.getByText('Free parking, Wifi')).toBeInTheDocument();

    // Check distance
    expect(screen.getByText('5.5 mi')).toBeInTheDocument();

    // Check boolean flags
    expect(screen.getByText('Open now')).toBeInTheDocument();
    expect(screen.getByText('Open until 5pm')).toBeInTheDocument();
    expect(screen.getByText('Not 24 hours')).toBeInTheDocument();
    expect(screen.getByText('Extended hours')).toBeInTheDocument();
    expect(screen.getByText('Walk-ins allowed')).toBeInTheDocument();
    expect(screen.getByText('MyBSWHealth')).toBeInTheDocument();
    expect(screen.getByText('Waiting rooms: 3')).toBeInTheDocument();

    // Check coordinates
    expect(screen.getByText(/32.7767, -96.7970/)).toBeInTheDocument();
  });

  it('renders photo when photoUrl is provided', () => {
    render(<Location />);

    const image = screen.getByAltText('Test Medical Center');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('does not render photo when photoUrl is missing', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, photoUrl: null },
      },
    } as any);

    render(<Location />);

    expect(screen.queryByAltText('Test Medical Center')).not.toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalLocationData: LocationResult = {
      locationID: 'loc-456',
      locationName: 'Minimal Clinic',
      locationStreet1: '456 Elm St',
      locationCity: 'Austin',
      locationState: 'TX',
      locationZip: '78701',
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: minimalLocationData,
      },
    } as any);

    render(<Location />);

    // Should still render without errors
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Minimal Clinic')).toBeInTheDocument();
    expect(screen.getByText(/456 Elm St, Austin, TX, 78701/)).toBeInTheDocument();

    // Optional fields should not be present
    expect(screen.queryByText(/Fax:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Website:/)).not.toBeInTheDocument();
  });

  it('formats distance correctly', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, distance: 10.123 },
      },
    } as any);

    render(<Location />);

    expect(screen.getByText('10.1 mi')).toBeInTheDocument();
  });

  it('does not render distance when null', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, distance: null },
      },
    } as any);

    render(<Location />);

    expect(screen.queryByText(/mi/)).not.toBeInTheDocument();
  });

  it('handles NaN distance gracefully', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, distance: NaN },
      },
    } as any);

    render(<Location />);

    expect(screen.queryByText(/mi/)).not.toBeInTheDocument();
  });

  it('renders "Closed now" when openNow is false', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, openNow: false },
      },
    } as any);

    render(<Location />);

    expect(screen.getByText('Closed now')).toBeInTheDocument();
  });

  it('renders "24 hours" when isOpen24Hours is true', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, isOpen24Hours: true },
      },
    } as any);

    render(<Location />);

    expect(screen.getByText('24 hours')).toBeInTheDocument();
  });

  it('renders "Standard hours" when hasExtendedHours is false', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, hasExtendedHours: false },
      },
    } as any);

    render(<Location />);

    expect(screen.getByText('Standard hours')).toBeInTheDocument();
  });

  it('renders "No walk-ins" when allowWalkIns is false', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, allowWalkIns: false },
      },
    } as any);

    render(<Location />);

    expect(screen.getByText('No walk-ins')).toBeInTheDocument();
  });

  it('renders "No MyBSWHealth" when usesMyBSWHealth is false', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, usesMyBSWHealth: false },
      },
    } as any);

    render(<Location />);

    expect(screen.getByText('No MyBSWHealth')).toBeInTheDocument();
  });

  it('does not render boolean flags when they are null', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: {
          ...mockLocationData,
          openNow: null,
          isOpen24Hours: null,
          hasExtendedHours: null,
          allowWalkIns: null,
          usesMyBSWHealth: null,
        },
      },
    } as any);

    render(<Location />);

    expect(screen.queryByText(/Open now/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Closed now/)).not.toBeInTheDocument();
    expect(screen.queryByText(/24 hours/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Extended hours/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Walk-ins/)).not.toBeInTheDocument();
    expect(screen.queryByText(/MyBSWHealth/)).not.toBeInTheDocument();
  });

  it('does not render coordinates when they are null', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: { ...mockLocationData, coordinates: null },
      },
    } as any);

    render(<Location />);

    expect(screen.queryByText(/32.7767/)).not.toBeInTheDocument();
  });

  it('does not render coordinates when lat or lon is null', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: {
          ...mockLocationData,
          coordinates: { lat: 32.7767, lon: null as any },
        },
      },
    } as any);

    render(<Location />);

    expect(screen.queryByText(/32.7767/)).not.toBeInTheDocument();
  });

  it('formats address with only some fields present', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        locationData: {
          ...mockLocationData,
          locationStreet1: '789 Oak St',
          locationStreet2: null,
          locationCity: 'Houston',
          locationState: null,
          locationZip: null,
        },
      },
    } as any);

    render(<Location />);

    expect(screen.getByText(/789 Oak St, Houston/)).toBeInTheDocument();
  });

  it('applies correct CSS classes to card', () => {
    render(<Location />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('font-satoshi');
    expect(card).toHaveClass('overflow-hidden');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('rounded-lg');
  });
});
