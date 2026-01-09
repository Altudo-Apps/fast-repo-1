import { JSX } from 'react';
import { Card } from 'src/core/ui/card';
import { LocationResult, LocationsResponse } from 'src/types/LocationsListing.types';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'src/core/ui/dialog';
// import Location from './Location';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';

function formatAddress(l: LocationResult): string {
  const parts = [
    l.locationStreet1,
    l.locationStreet2,
    l.locationCity,
    l.locationState,
    l.locationZip,
  ]
    .filter(Boolean)
    .map((p) => String(p));
  return parts.join(', ');
}

function formatDistance(distance?: number | null): string | null {
  if (distance == null || Number.isNaN(distance)) return null;
  try {
    return `${Number(distance).toFixed(1)} mi`;
  } catch {
    return null;
  }
}

export default function LocationsListing(): JSX.Element {
  const context = useSitecore();
  const { data } = context.page as unknown as { data: LocationsResponse };
  // const [selected, setSelected] = useState<LocationResult | null>(null);
  // const [isOpen, setIsOpen] = useState(false);

  const locations = data?.locationResults ?? [];

  // Debug logging to verify localized data is being received
  if (typeof window !== 'undefined' && locations.length > 0) {
    console.log('[LocationsListing] Component received data:', {
      locationCount: locations.length,
      sampleLocation: {
        locationID: locations[0].locationID,
        locationName: locations[0].locationName,
        locationCity: locations[0].locationCity,
        locationState: locations[0].locationState,
        locationStreet1: locations[0].locationStreet1,
      },
      locale: context.page?.locale,
    });
  }

  if (!locations.length) {
    return <div className="text-muted-foreground">No locations found.</div>;
  }

  // const handleOpen = (loc: LocationResult) => {
  //   setSelected(loc);
  //   setIsOpen(true);
  // };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => {
          const addr = formatAddress(loc);
          const dist = formatDistance(loc.distance ?? null);
          const insurance = Array.isArray(loc.insuranceAccepted) ? loc.insuranceAccepted : [];
          const insuranceDisplay = insurance
            .slice(0, 3)
            .map((p) => [p.healthPlanCompanyName, p.healthPlanName].filter(Boolean).join(' - '))
            .filter(Boolean);
          const remainingInsurance = Math.max(insurance.length - insuranceDisplay.length, 0);
          return (
            <Card
              key={loc.locationID}
              // onClick={() => handleOpen(loc)}
              className="cursor-pointer font-satoshi overflow-hidden bg-card rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-border"
            >
              <div className="w-full aspect-video bg-muted overflow-hidden">
                {loc.photoUrl ? (
                  <img
                    src={loc.photoUrl}
                    alt={loc.locationName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold tracking-tight font-zodiak text-lg">
                    <Link href={`/locations/${loc.locationID}`}>{loc.locationName}</Link>
                  </h3>
                  {dist ? (
                    <span className="shrink-0 text-xs px-2 py-1 rounded bg-muted text-foreground">
                      {dist}
                    </span>
                  ) : null}
                </div>
                {loc.locationType ? (
                  <div className="text-xs inline-flex w-max px-2 py-1 rounded bg-muted text-foreground">
                    {loc.locationType}
                  </div>
                ) : null}
                {addr ? <p className="text-sm text-muted-foreground">{addr}</p> : null}
                {loc.locationPhone ? (
                  <p className="text-sm">
                    <a href={`tel:${loc.locationPhone}`} className="text-primary">
                      {loc.locationPhone}
                    </a>
                  </p>
                ) : null}
                {loc.locationFax ? (
                  <p className="text-xs text-muted-foreground">Fax: {loc.locationFax}</p>
                ) : null}
                {/* {loc.locationUrl ? (
                  <p className="text-xs">
                    <span className="text-muted-foreground">Website: </span>
                    <span className="break-all">{loc.locationUrl}</span>
                  </p>
                ) : null} */}
                {loc.officeHourDescription ? (
                  <p className="text-xs text-muted-foreground">{loc.officeHourDescription}</p>
                ) : null}
                {loc.specialties ? (
                  <p className="text-xs text-muted-foreground">{loc.specialties}</p>
                ) : null}
                {loc.perks ? <p className="text-xs text-muted-foreground">{loc.perks}</p> : null}
                <div className="flex flex-wrap gap-2 pt-1">
                  {typeof loc.openNow === 'boolean' ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                      {loc.openNow ? 'Open now' : 'Closed now'}
                    </span>
                  ) : null}
                  {loc.openNowMessage ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                      {loc.openNowMessage}
                    </span>
                  ) : null}
                  {typeof loc.isOpen24Hours === 'boolean' ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                      {loc.isOpen24Hours ? '24 hours' : 'Not 24 hours'}
                    </span>
                  ) : null}
                  {typeof loc.hasExtendedHours === 'boolean' ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                      {loc.hasExtendedHours ? 'Extended hours' : 'Standard hours'}
                    </span>
                  ) : null}
                  {typeof loc.allowWalkIns === 'boolean' ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                      {loc.allowWalkIns ? 'Walk-ins allowed' : 'No walk-ins'}
                    </span>
                  ) : null}
                  {typeof loc.usesMyBSWHealth === 'boolean' ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                      {loc.usesMyBSWHealth ? 'MyBSWHealth' : 'No MyBSWHealth'}
                    </span>
                  ) : null}
                  {typeof loc.waitingRoomCount === 'number' ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                      Waiting rooms: {loc.waitingRoomCount}
                    </span>
                  ) : null}
                  {loc.coordinates?.lat != null && loc.coordinates?.lon != null ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                      {loc.coordinates.lat.toFixed(4)}, {loc.coordinates.lon.toFixed(4)}
                    </span>
                  ) : null}
                </div>
                {insuranceDisplay.length ? (
                  <div className="text-[11px] text-muted-foreground">
                    Insurance: {insuranceDisplay.join(', ')}
                    {remainingInsurance > 0 ? ` +${remainingInsurance} more` : ''}
                  </div>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[720px] bg-background">
          <DialogHeader>
            <DialogTitle>{selected?.locationName}</DialogTitle>
          </DialogHeader>
          {selected ? <Location location={selected} /> : null}
        </DialogContent>
      </Dialog> */}
    </>
  );
}
