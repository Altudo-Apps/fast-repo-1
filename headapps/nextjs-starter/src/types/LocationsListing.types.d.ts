export type LocationCoordinates = {
  lat: number;
  lon: number;
};

export type InsurancePlan = {
  healthPlanName?: string;
  healthPlanCompanyName?: string;
  healthPlanFullName?: string;
  healthPlanStatusType?: string;
  tier?: string;
  acceptingPatients?: boolean;
  healthPlanExternalCode?: string;
};

export type LocationResult = {
  locationType?: string | null;
  photoUrl?: string | null;
  contacts?: unknown;
  coordinates?: LocationCoordinates | null;
  distance?: number | null;
  waitingRoomCount?: number | null;
  locationID: string;
  locationName: string;
  locationPhone?: string | null;
  locationFax?: string | null;
  locationState?: string | null;
  locationStreet1?: string | null;
  locationStreet2?: string | null;
  locationSuite?: string | null;
  locationCity?: string | null;
  locationZip?: string | null;
  locationUrl?: string | null;
  usesMyBSWHealth?: boolean | null;
  allowWalkIns?: boolean | null;
  openNowMessage?: string | null;
  officeHourDescription?: string | null;
  openNow?: boolean | null;
  openBefore8?: boolean | null;
  openAfter5?: boolean | null;
  openWeekends?: boolean | null;
  isOpen24Hours?: boolean | null;
  hasExtendedHours?: boolean | null;
  perks?: string | null;
  specialties?: string | null;
  insuranceAccepted?: InsurancePlan[];
};

export type LocationsResponse = {
  locationCount: number;
  locationResults: LocationResult[];
};
