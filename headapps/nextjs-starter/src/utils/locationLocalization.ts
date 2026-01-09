/**
 * Utility functions for handling localized location data
 */

export interface LocalizedFields {
  locationType: string;
  locationName: string;
  openNowMessage: string;
  officeHourDescription: string | null;
  perks: string;
  specialties: string;
  locationState: string;
  locationCity: string;
  locationStreet1: string;
  locationStreet2: string;
}

export interface LocationData {
  photoUrl: string | null;
  contacts: unknown;
  coordinates: {
    lat: number;
    lon: number;
  };
  distance: number;
  waitingRoomCount: number | null;
  locationID: string;
  locationPhone: string;
  locationFax: string;
  locationZip: string;
  locationUrl: string | null;
  usesMyBSWHealth: unknown;
  allowWalkIns: boolean;
  openNow: boolean | null;
  openBefore8: boolean | null;
  openAfter5: boolean | null;
  openWeekends: boolean | null;
  isOpen24Hours: boolean;
  hasExtendedHours: boolean;
  locationSuite: string;
  insuranceAccepted: unknown[];
  localized: {
    en: LocalizedFields;
    'ar-AE': LocalizedFields;
    'fr-CA': LocalizedFields;
  };
}

export interface LocalizedLocation extends Omit<LocationData, 'localized'>, LocalizedFields {}

/**
 * Get localized location data based on the current locale
 * @param location - The location object with localized data
 * @param locale - The current locale (e.g., 'en', 'ar-AE', 'fr-CA')
 * @returns Location object with localized fields flattened to root level
 */
export function getLocalizedLocation(location: LocationData, locale?: string): LocalizedLocation {
  // Default to 'en' if locale is not provided or not supported
  const supportedLocales = ['en', 'ar-AE', 'fr-CA'];
  let selectedLocale = locale || 'en';

  // If the provided locale is not supported, try to find a match
  if (!supportedLocales.includes(selectedLocale)) {
    // Try to match the language part (e.g., 'ar' from 'ar-AE')
    const languageCode = selectedLocale.split('-')[0];
    const matchingLocale = supportedLocales.find((loc) => loc.startsWith(languageCode));
    selectedLocale = matchingLocale || 'en';
  }

  // Check if location already has localized structure
  if (location.localized) {
    // Get the localized fields for the selected locale
    const localizedFields =
      location.localized[selectedLocale as keyof typeof location.localized] ||
      location.localized.en;

    // Return the location with localized fields at root level
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { localized, ...baseLocation } = location;

    return {
      ...baseLocation,
      ...localizedFields,
    };
  }

  // If no localized structure exists, return location as-is (fallback for API data without localization)
  // This should not happen if we're using locations_min.json, but handles edge cases
  return location as unknown as LocalizedLocation;
}

/**
 * Get localized location results from the locations API response
 * @param data - The locations API response with locationResults
 * @param locale - The current locale
 * @returns Localized location results
 */
export function getLocalizedLocationResults(
  data: { locationCount: number; locationResults: LocationData[] },
  locale?: string
): { locationCount: number; locationResults: LocalizedLocation[] } {
  return {
    locationCount: data.locationCount,
    locationResults: data.locationResults.map((location) => getLocalizedLocation(location, locale)),
  };
}
