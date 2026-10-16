export const QURAN_PAGE_COUNT = 605;

export function parseQuranPage(value) {
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) {
    return null;
  }
  const page = Number(text);
  return page >= 1 && page <= QURAN_PAGE_COUNT ? page : null;
}

export function normalizeReaderPreferences(value) {
  return {
    lastPage: parseQuranPage(value?.lastPage),
    bookmarks: [
      ...new Set(
        (Array.isArray(value?.bookmarks) ? value.bookmarks : [])
          .map(parseQuranPage)
          .filter(Boolean)
      ),
    ].sort((a, b) => a - b),
    largeText: value?.largeText === true,
  };
}
