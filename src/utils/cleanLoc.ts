const REGION_SKIP = new Set([
  // Chinese
  '新界', '新界東', '新界西', '香港', '香港島', '九龍', '中国', '中國',
  // English (from Nominatim display_name)
  'New Territories', 'Hong Kong', 'China', 'Kowloon', 'Hong Kong Island',
]);

/** Strip broad regional terms from a loc string (supports both ，and , separators). */
export function cleanLoc(loc: string): string {
  return loc
    .split(/，|,\s*/)
    .map(p => p.trim())
    .filter(p => p.length > 0 && !REGION_SKIP.has(p))
    .join('，');
}
