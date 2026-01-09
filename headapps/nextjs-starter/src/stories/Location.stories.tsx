import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import Location from 'src/components/Location';

import type { LocationResult } from 'src/types/LocationsListing.types';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const locationData: LocationResult = {
  locationID: 'loc-1',

  locationName: 'Downtown Clinic',

  locationStreet1: '123 Main St',

  locationStreet2: '',

  locationCity: 'Chicago',

  locationState: 'IL',

  locationZip: '60601',

  locationPhone: '312-555-0100',

  locationFax: '312-555-0199',

  locationType: 'Primary care',

  officeHourDescription: 'Mon–Fri 8am–9pm',

  specialties: 'Primary care, Pediatrics',

  perks: 'Validated parking, MyBSWHealth',

  openNowMessage: 'Open until 9pm',

  openNow: true,

  distance: 1.2,

  photoUrl:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&auto=format&fit=crop',

  insuranceAccepted: [],
};

const locationPage = {
  ...mockPage,

  locationData,
} as typeof mockPage & { locationData: LocationResult };

const meta: Meta<typeof Location> = {
  title: 'Components/Location',

  component: Location,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof Location> = () => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={locationPage}>
    <Location />
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /downtown clinic/i })).toBeVisible();
};
