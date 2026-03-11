/** Returns true if the listing was listed within the last 14 days. */
export function isNewListing(listedDate: string): boolean {
  const listed = new Date(listedDate).getTime();
  const now = Date.now();
  return now - listed <= 14 * 24 * 60 * 60 * 1000;
}
