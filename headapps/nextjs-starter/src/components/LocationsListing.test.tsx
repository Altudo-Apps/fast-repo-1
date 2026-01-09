import React from 'react';
import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LocationsListing from './LocationsListing';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';
import { LocationResult, LocationsResponse } from 'src/types/LocationsListing.types';

let useSitecoreSpy: any;

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock Card component
vi.mock('src/core/ui/card', () => ({
  Card: ({ children, className, onClick, ...props }: any) => (
    <div data-testid="card" className={className} onClick={onClick} {...props}>
      {children}
    </div>
  ),
}));

// Mock location data
const mockLocation1: LocationResult = {
  locationID: 'loc-1',
  locationName: 'Dallas Medical Center',
  locationPhone: '214-555-0001',
  locationFax: '214-555-0002',
  locationStreet1: '123 Main St',
  locationStreet2: 'Suite 100',
  locationCity: 'Dallas',
  locationState: 'TX',
  locationZip: '75001',
  locationUrl: 'https://dallas.example.com',
  locationType: 'Hospital',
  photoUrl: 'https://example.com/dallas.jpg',
  distance: 2.5,
  officeHourDescription: 'Mon-Fri 8am-5pm',
  specialties: 'Cardiology',
  perks: 'Free parking',
  openNow: true,
  openNowMessage: 'Open until 5pm',
  isOpen24Hours: false,
  hasExtendedHours: true,
  allowWalkIns: true,
  usesMyBSWHealth: true,
  waitingRoomCount: 2,
  coordinates: {
    lat: 32.7767,
    lon: -96.797,
  },
  insuranceAccepted: [
    {
      healthPlanName: 'Premium Plan',
      healthPlanCompanyName: 'Blue Cross',
    },
    {
      healthPlanName: 'Gold Plan',
      healthPlanCompanyName: 'Aetna',
    },
    {
      healthPlanName: 'Silver Plan',
      healthPlanCompanyName: 'Cigna',
    },
    {
      healthPlanName: 'Bronze Plan',
      healthPlanCompanyName: 'United',
    },
  ],
};

const mockLocation2: LocationResult = {
  locationID: 'loc-2',
  locationName: 'Austin Clinic',
  locationPhone: '512-555-0001',
  locationStreet1: '456 Oak Ave',
  locationCity: 'Austin',
  locationState: 'TX',
  locationZip: '78701',
  locationType: 'Clinic',
  photoUrl: null,
  distance: 10.8,
  openNow: false,
  isOpen24Hours: true,
  insuranceAccepted: [],
};

const mockLocation3: LocationResult = {
  locationID: 'loc-3',
  locationName: 'Houston Emergency',
  locationStreet1: '789 Pine Rd',
  locationCity: 'Houston',
  locationState: 'TX',
  locationZip: '77001',
  distance: null,
  insuranceAccepted: [],
};

describe('LocationsListing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    useSitecoreSpy = vi.spyOn(SitecoreContentSdk, 'useSitecore');
  });

  it('renders multiple locations', () => {
    const mockData: LocationsResponse = {
      locationCount: 2,
      locationResults: [mockLocation1, mockLocation2],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    // Check that both locations are rendered
    expect(screen.getByText('Dallas Medical Center')).toBeInTheDocument();
    expect(screen.getByText('Austin Clinic')).toBeInTheDocument();

    // Check that we have 2 cards
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
  });

  it('displays "No locations found" when empty', () => {
    const mockData: LocationsResponse = {
      locationCount: 0,
      locationResults: [],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    expect(screen.getByText('No locations found.')).toBeInTheDocument();
  });

  it('displays "No locations found" when data is missing', () => {
    useSitecoreSpy.mockReturnValue({
      page: {
        data: undefined,
      },
    } as any);

    render(<LocationsListing />);

    expect(screen.getByText('No locations found.')).toBeInTheDocument();
  });

  it('renders location with all fields', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation1],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    // Check name link
    const nameLink = screen.getByRole('link', { name: 'Dallas Medical Center' });
    expect(nameLink).toHaveAttribute('href', '/locations/loc-1');

    // Check location type
    expect(screen.getByText('Hospital')).toBeInTheDocument();

    // Check address
    expect(screen.getByText(/123 Main St, Suite 100, Dallas, TX, 75001/)).toBeInTheDocument();

    // Check phone
    expect(screen.getByText('214-555-0001')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '214-555-0001' })).toHaveAttribute(
      'href',
      'tel:214-555-0001'
    );

    // Check fax
    expect(screen.getByText(/Fax: 214-555-0002/)).toBeInTheDocument();

    // Check website - commented out in component
    // expect(screen.getByText('https://dallas.example.com')).toBeInTheDocument();

    // Check office hours
    expect(screen.getByText('Mon-Fri 8am-5pm')).toBeInTheDocument();

    // Check specialties
    expect(screen.getByText('Cardiology')).toBeInTheDocument();

    // Check perks
    expect(screen.getByText('Free parking')).toBeInTheDocument();

    // Check distance
    expect(screen.getByText('2.5 mi')).toBeInTheDocument();

    // Check boolean flags
    expect(screen.getByText('Open now')).toBeInTheDocument();
    expect(screen.getByText('Open until 5pm')).toBeInTheDocument();
    expect(screen.getByText('Not 24 hours')).toBeInTheDocument();
    expect(screen.getByText('Extended hours')).toBeInTheDocument();
    expect(screen.getByText('Walk-ins allowed')).toBeInTheDocument();
    expect(screen.getByText('MyBSWHealth')).toBeInTheDocument();
    expect(screen.getByText('Waiting rooms: 2')).toBeInTheDocument();

    // Check coordinates
    expect(screen.getByText(/32.7767, -96.7970/)).toBeInTheDocument();

    // Check insurance (first 3 should show + 1 more)
    expect(screen.getByText(/Blue Cross - Premium Plan/)).toBeInTheDocument();
    expect(screen.getByText(/\+1 more/)).toBeInTheDocument();
  });

  it('renders location photo when available', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation1],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    const image = screen.getByAltText('Dallas Medical Center');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/dallas.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('does not render photo when photoUrl is null', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation2],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    expect(screen.queryByAltText('Austin Clinic')).not.toBeInTheDocument();
  });

  it('formats distance correctly', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation2],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    expect(screen.getByText('10.8 mi')).toBeInTheDocument();
  });

  it('does not render distance when null', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation3],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    expect(screen.queryByText(/mi$/)).not.toBeInTheDocument();
  });

  it('displays insurance information correctly', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation1],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    // Should show first 3 insurance plans
    expect(screen.getByText(/Insurance: Blue Cross - Premium Plan/)).toBeInTheDocument();

    // Should show "+1 more" for the 4th plan
    expect(screen.getByText(/\+1 more/)).toBeInTheDocument();
  });

  it('does not display insurance when empty', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation2],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    expect(screen.queryByText(/Insurance:/)).not.toBeInTheDocument();
  });

  it('handles insurance with missing fields', () => {
    const locationWithPartialInsurance: LocationResult = {
      ...mockLocation1,
      insuranceAccepted: [
        { healthPlanName: 'Plan A' },
        { healthPlanCompanyName: 'Company B' },
        { healthPlanName: 'Plan C', healthPlanCompanyName: 'Company C' },
      ],
    };

    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [locationWithPartialInsurance],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    // Should display insurance even with missing fields
    expect(screen.getByText(/Insurance:/)).toBeInTheDocument();
  });

  it('renders grid layout correctly', () => {
    const mockData: LocationsResponse = {
      locationCount: 3,
      locationResults: [mockLocation1, mockLocation2, mockLocation3],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    const { container } = render(<LocationsListing />);

    // Check for grid classes
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
    expect(grid).toHaveClass('gap-6');
  });

  it('displays "Closed now" when openNow is false', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation2],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    expect(screen.getByText('Closed now')).toBeInTheDocument();
  });

  it('displays "24 hours" when isOpen24Hours is true', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation2],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    expect(screen.getByText('24 hours')).toBeInTheDocument();
  });

  it('handles minimal location data', () => {
    const minimalLocation: LocationResult = {
      locationID: 'loc-minimal',
      locationName: 'Minimal Location',
      insuranceAccepted: [],
    };

    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [minimalLocation],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    // Should render without errors
    expect(screen.getByText('Minimal Location')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Minimal Location' });
    expect(link).toHaveAttribute('href', '/locations/loc-minimal');
  });

  it('does not render optional fields when they are null', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation3],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    // Should not render optional fields
    expect(screen.queryByText(/Fax:/)).not.toBeInTheDocument();
    // Website field is commented out in component
    // expect(screen.queryByText(/Website:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Open now/)).not.toBeInTheDocument();
    expect(screen.queryByText(/24 hours/)).not.toBeInTheDocument();
  });

  it('applies cursor-pointer class to cards', () => {
    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [mockLocation1],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('cursor-pointer');
    expect(card).toHaveClass('font-satoshi');
    expect(card).toHaveClass('overflow-hidden');
  });

  it('handles NaN distance gracefully', () => {
    const locationWithNaNDistance: LocationResult = {
      ...mockLocation1,
      distance: NaN,
    };

    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [locationWithNaNDistance],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    // Should not render distance badge
    expect(screen.queryByText(/mi$/)).not.toBeInTheDocument();
  });

  it('formats address correctly with missing street2', () => {
    const locationWithoutStreet2: LocationResult = {
      ...mockLocation1,
      locationStreet2: null,
    };

    const mockData: LocationsResponse = {
      locationCount: 1,
      locationResults: [locationWithoutStreet2],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    // Should format address without street2
    expect(screen.getByText(/123 Main St, Dallas, TX, 75001/)).toBeInTheDocument();
    expect(screen.queryByText(/Suite 100/)).not.toBeInTheDocument();
  });

  it('renders all locations with unique keys', () => {
    const mockData: LocationsResponse = {
      locationCount: 3,
      locationResults: [mockLocation1, mockLocation2, mockLocation3],
    };

    useSitecoreSpy.mockReturnValue({
      page: {
        data: mockData,
      },
    } as any);

    render(<LocationsListing />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(3);

    // Check that all three locations are present
    expect(screen.getByText('Dallas Medical Center')).toBeInTheDocument();
    expect(screen.getByText('Austin Clinic')).toBeInTheDocument();
    expect(screen.getByText('Houston Emergency')).toBeInTheDocument();
  });
});
