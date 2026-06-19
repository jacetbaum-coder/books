export function slugifyBook(title: string, author: string) {
  return `${title}-${author}`
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
