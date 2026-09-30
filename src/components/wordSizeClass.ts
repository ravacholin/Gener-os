export function wordSizeClass(len: number): string {
  if (len > 22) return 'text-2xl sm:text-3xl md:text-4xl';
  if (len > 14) return 'text-3xl sm:text-4xl md:text-5xl';
  return 'text-4xl sm:text-5xl md:text-6xl';
}
