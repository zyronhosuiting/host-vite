/** Returns display initials for an avatar.
 *  - Chinese name  → first character
 *  - English name  → first letter of each of the first two words
 *  - Empty / null  → 'HL'
 */
export function getInitials(name?: string | null): string {
  const n = name?.trim();
  if (!n) return 'HL';

  // First char is a CJK character → return just that character
  if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(n[0])) {
    return n[0];
  }

  // English / other: up to two word initials
  const words = n.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0][0].toUpperCase();
}
