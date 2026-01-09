import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import LocationsListing from 'src/components/LocationsListing';

import type { LocationsResponse } from 'src/types/LocationsListing.types';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const locationsMock: LocationsResponse = {
  locationCount: 1,

  locationResults: [
    {
      locationID: 'loc-1',

      locationName: 'Downtown Clinic',

      locationType: 'Urgent care',

      locationStreet1: '123 Main St',

      locationStreet2: '',

      locationCity: 'Chicago',

      locationState: 'IL',

      locationZip: '60601',

      locationPhone: '312-555-0100',

      locationFax: '312-555-0199',

      locationUrl: 'https://example.com',

      coordinates: {
        lat: 41.8853,

        lon: -87.6229,
      },

      officeHourDescription: 'Mon–Fri 8am–9pm',

      specialties: 'Urgent care, Pediatrics',

      photoUrl:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',

      perks: 'Validated parking, MyBSWHealth',

      openNowMessage: 'Open until 9pm',

      openNow: true,

      distance: 1.2,

      insuranceAccepted: [
        { healthPlanCompanyName: 'BlueCross', healthPlanName: 'PPO' },

        { healthPlanCompanyName: 'Aetna', healthPlanName: 'Premier' },
      ],
    },
  ],
};

const locationsPage = {
  ...mockPage,

  data: locationsMock,
} as typeof mockPage & { data: LocationsResponse };

const meta: Meta<typeof LocationsListing> = {
  title: 'Components/LocationsListing',

  component: LocationsListing,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof LocationsListing> = () => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={locationsPage}>
    <LocationsListing />
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /downtown clinic/i })).toBeVisible();
};
