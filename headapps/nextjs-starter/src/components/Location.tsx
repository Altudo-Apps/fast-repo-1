import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';
import { Card } from 'src/core/ui/card';
import { LocationResult } from 'src/types/LocationsListing.types';

function formatAddress(l: LocationResult): string {
  const parts = [
    l?.locationStreet1,
    l?.locationStreet2,
    l?.locationCity,
    l?.locationState,
    l?.locationZip,
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

export type LocationProps = {
  location: LocationResult;
};

export default function Location(): JSX.Element {
  const context = useSitecore();
  const location = (context.page as unknown as { locationData: LocationResult }).locationData;
  const addr = formatAddress(location);
  const dist = formatDistance(location?.distance ?? null);

  return (
    <Card className="font-satoshi overflow-hidden bg-card rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-border">
      <div className="w-full aspect-video bg-muted overflow-hidden">
        {location?.photoUrl ? (
          <img
            src={location?.photoUrl}
            alt={location?.locationName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold tracking-tight font-zodiak text-lg">{location?.locationName}</h3>
          {dist ? (
            <span className="shrink-0 text-xs px-2 py-1 rounded bg-muted text-foreground">
              {dist}
            </span>
          ) : null}
        </div>
        {location?.locationType ? (
          <div className="text-xs inline-flex w-max px-2 py-1 rounded bg-muted text-foreground">
            {location?.locationType}
          </div>
        ) : null}
        {addr ? <p className="text-sm text-muted-foreground">{addr}</p> : null}
        {location?.locationPhone ? (
          <p className="text-sm">
            <a href={`tel:${location?.locationPhone}`} className="text-primary">
              {location?.locationPhone}
            </a>
          </p>
        ) : null}
        {location?.locationFax ? (
          <p className="text-xs text-muted-foreground">Fax: {location?.locationFax}</p>
        ) : null}
        {location?.officeHourDescription ? (
          <p className="text-xs text-muted-foreground">{location?.officeHourDescription}</p>
        ) : null}
        {location?.specialties ? (
          <p className="text-xs text-muted-foreground">{location?.specialties}</p>
        ) : null}
        {location?.perks ? (
          <p className="text-xs text-muted-foreground">{location?.perks}</p>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          {typeof location?.openNow === 'boolean' ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
              {location?.openNow ? 'Open now' : 'Closed now'}
            </span>
          ) : null}
          {location?.openNowMessage ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
              {location?.openNowMessage}
            </span>
          ) : null}
          {typeof location?.isOpen24Hours === 'boolean' ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
              {location?.isOpen24Hours ? '24 hours' : 'Not 24 hours'}
            </span>
          ) : null}
          {typeof location?.hasExtendedHours === 'boolean' ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
              {location?.hasExtendedHours ? 'Extended hours' : 'Standard hours'}
            </span>
          ) : null}
          {typeof location?.allowWalkIns === 'boolean' ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
              {location?.allowWalkIns ? 'Walk-ins allowed' : 'No walk-ins'}
            </span>
          ) : null}
          {typeof location?.usesMyBSWHealth === 'boolean' ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
              {location?.usesMyBSWHealth ? 'MyBSWHealth' : 'No MyBSWHealth'}
            </span>
          ) : null}
          {typeof location?.waitingRoomCount === 'number' ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
              Waiting rooms: {location?.waitingRoomCount}
            </span>
          ) : null}
          {location?.coordinates?.lat != null && location?.coordinates?.lon != null ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
              {location?.coordinates.lat.toFixed(4)}, {location?.coordinates.lon.toFixed(4)}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
