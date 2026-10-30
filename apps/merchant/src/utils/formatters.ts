/**
 * Formatting utilities for tables, dates, and taxonomies in Merchant App.
 */

/**
 * Formats a taxonomy / category string (e.g. "men's_fashion", "formal_shirts", "electronics")
 * into human-readable Title Case ("Men's Fashion", "Formal Shirts", "Electronics").
 */
export function formatCategoryTitle(text?: string | null): string {
  if (!text) return '—';
  const clean = text.replace(/[_-]+/g, ' ').trim();
  if (!clean) return '—';
  return clean
    .split(' ')
    .map((word) => {
      if (!word) return '';
      if (word.includes("'")) {
        const parts = word.split("'");
        const first = parts[0] || '';
        const rest = parts.slice(1).join("'");
        const capitalizedFirst = first.length > 0 ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
        return rest.length > 0 ? `${capitalizedFirst}'${rest.toLowerCase()}` : capitalizedFirst;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Case-insensitive, underscore-insensitive matching for table filters.
 */
export function matchesCategory(itemVal?: string | null, filterVal?: string | null): boolean {
  if (
    !filterVal ||
    filterVal === 'All' ||
    filterVal === 'All Categories' ||
    filterVal === 'All Sub-categories' ||
    filterVal === 'All Product Types' ||
    filterVal === 'All Brands' ||
    filterVal === 'All Status' ||
    filterVal === 'All Statuses'
  ) {
    return true;
  }
  if (!itemVal) return false;
  if (itemVal === filterVal) return true;
  const normItem = itemVal.replace(/[_-]+/g, ' ').trim().toLowerCase();
  const normFilter = filterVal.replace(/[_-]+/g, ' ').trim().toLowerCase();
  return normItem === normFilter;
}

/**
 * Parses and displays timestamp into clean stacked date and time.
 */
export function formatDateTime(val?: string | null): { date: string; time: string } {
  if (!val) return { date: '—', time: '' };

  if (val.includes('T')) {
    try {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return {
          date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        };
      }
    } catch {
      // fallback
    }
  }

  const parts = val.split(/ (?=\d{2}:\d{2})/);
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { date: parts[0], time: parts[1] };
  }

  const spaceParts = val.split(' ');
  if (spaceParts.length >= 4) {
    return {
      date: spaceParts.slice(0, 3).join(' '),
      time: spaceParts.slice(3).join(' '),
    };
  }

  return { date: val, time: '' };
}
