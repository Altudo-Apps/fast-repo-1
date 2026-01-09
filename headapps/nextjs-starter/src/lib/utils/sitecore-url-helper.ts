import { LinkField } from '@sitecore-content-sdk/nextjs';

/**
 * Configuration for custom route conversion
 */
export interface CustomRouteConfig {
  /** The bucket folder name in the path (e.g., "BlogArticles", "LocationItems") */
  bucketFolderName: string;
  /** The custom route prefix (e.g., "/blogs", "/locations") */
  customRoutePrefix: string;
  /** Optional: Additional path segments to check (e.g., ["Blogs", "Home/Blogs"]) */
  additionalPathSegments?: string[];
}

/**
 * Converts an item name to a URL-friendly slug
 * Example: "ICMP Certifies" -> "icmp-certifies"
 */
export function itemNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-|\-$/g, '');
}

/**
 * Checks if a URL path matches a bucketed item pattern
 * Sitecore buckets organize items alphabetically into folders (a-z)
 *
 * @param path - The URL path to check
 * @param config - Configuration for the bucket pattern
 * @returns true if the path matches the bucket pattern
 */
export function isBucketedItemPath(path: string, config: CustomRouteConfig): boolean {
  const lowerPath = path.toLowerCase();
  const lowerBucketName = config.bucketFolderName.toLowerCase();

  // Match /{bucketFolderName}/[letter]/ where letter is a-z
  const bucketPattern = new RegExp(`\\/${lowerBucketName}\\/[a-z]\\/`, 'i');

  return bucketPattern.test(lowerPath);
}

/**
 * Extracts the item name from a bucketed path
 *
 * @param path - The bucketed path
 * @param config - Configuration for the bucket pattern
 * @returns The item name or null if not found
 *
 * @example
 * extractItemName("/Blogs/BlogArticles/s/Statement", config)
 * // Returns: "Statement"
 */
export function extractItemName(path: string, config: CustomRouteConfig): string | null {
  const lowerBucketName = config.bucketFolderName.toLowerCase();

  // Match any path with /{bucketFolderName}/[letter]/ItemName
  const pattern = new RegExp(`\\/${lowerBucketName}\\/[a-z]\\/([^/]+)$`, 'i');
  const match = path.match(pattern);

  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Converts a Sitecore bucketed item link to its custom route URL
 *
 * @param linkField - Sitecore LinkField that may contain a bucketed item link
 * @param config - Configuration for route conversion
 * @returns The custom route URL if it matches the pattern, otherwise the original href
 *
 * @example
 * // Blog article conversion
 * getCustomRoute(linkField, {
 *   bucketFolderName: "BlogArticles",
 *   customRoutePrefix: "/blogs"
 * })
 * // "/Blogs/BlogArticles/s/Statement" -> "/blogs/statement"
 *
 * @example
 * // Location conversion
 * getCustomRoute(linkField, {
 *   bucketFolderName: "LocationItems",
 *   customRoutePrefix: "/locations"
 * })
 * // "/Locations/LocationItems/n/New York" -> "/locations/new-york"
 */
export function getCustomRoute(
  linkField: LinkField | undefined,
  config: CustomRouteConfig
): string | undefined {
  const href = linkField?.value?.href;
  if (!href) return undefined;

  // Check if this is a bucketed item path
  if (!isBucketedItemPath(href, config)) {
    return href; // Not a bucketed item, return original
  }

  // Extract the item name
  const itemName = extractItemName(href, config);
  if (!itemName) {
    return href; // Couldn't extract name, return original
  }

  // Convert to custom route
  const slug = itemNameToSlug(itemName);
  const prefix = config.customRoutePrefix.replace(/\/$/, ''); // Remove trailing slash
  return `${prefix}/${slug}`;
}

/**
 * Creates a new LinkField with the custom route URL
 *
 * @param linkField - The original LinkField
 * @param config - Configuration for route conversion
 * @returns A new LinkField with the custom route URL
 */
export function createLinkFieldWithCustomRoute(
  linkField: LinkField | undefined,
  config: CustomRouteConfig
): LinkField | undefined {
  if (!linkField) return undefined;

  const customHref = getCustomRoute(linkField, config);
  if (!customHref || customHref === linkField.value?.href) {
    return linkField; // No change needed
  }

  // Return a new LinkField with the custom route
  return {
    ...linkField,
    value: {
      ...linkField.value,
      href: customHref,
    },
  };
}
