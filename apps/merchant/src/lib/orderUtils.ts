/**
 * Order Utilities & Formatters
 * Brand-agnostic helper functions for fluid order layout, title parsing, and badge styling.
 */

export interface ParsedItemTitle {
  mainTitle: string;
  specs: string[];
  raw: string;
}

/**
 * Parses variable-length product names, extracting core brand/model and individual specs
 * to prevent long strings from breaking tabular layouts.
 *
 * Example:
 *   "SAMSUNG Galaxy A36 5G (8GB RAM, 256GB, Dark Green)"
 *   -> mainTitle: "SAMSUNG Galaxy A36 5G"
 *   -> specs: ["8GB RAM", "256GB", "Dark Green"]
 */
export function parseProductTitle(rawTitle: string): ParsedItemTitle {
  if (!rawTitle) {
    return { mainTitle: 'Untitled Product', specs: [], raw: '' };
  }

  const raw = rawTitle.trim();

  // Pattern 1: Title followed by (specs)
  const parenMatch = raw.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch && parenMatch[1] !== undefined && parenMatch[2] !== undefined) {
    const mainTitle = parenMatch[1].trim();
    const specs = parenMatch[2]
      .split(/[,;/]/)
      .map((s) => s.trim())
      .filter(Boolean);
    return { mainTitle: mainTitle || raw, specs, raw };
  }

  // Pattern 2: Title separated by " - " or " / "
  if (raw.includes(' - ') || raw.includes(' / ')) {
    const separator = raw.includes(' - ') ? ' - ' : ' / ';
    const parts = raw.split(separator);
    const mainTitle = (parts[0] || '').trim();
    const specs = parts
      .slice(1)
      .flatMap((p) => p.split(/[,;/]/))
      .map((s) => s.trim())
      .filter(Boolean);
    return { mainTitle: mainTitle || raw, specs, raw };
  }

  // Pattern 3: Fallback for clean title
  return { mainTitle: raw, specs: [], raw };
}

/**
 * Formats order creation date into human-friendly relative or concise stamp
 */
export function formatOrderRelativeTime(timestamp?: string): { relative: string; full: string } {
  if (!timestamp) return { relative: 'Just now', full: 'Recent' };

  try {
    const parsed = new Date(timestamp);
    if (isNaN(parsed.getTime())) {
      // It might already be a formatted string like "04 Nov 2026, 12:13 PM"
      return { relative: timestamp.split(',')[1]?.trim() || timestamp, full: timestamp };
    }

    const now = Date.now();
    const diffMs = now - parsed.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return { relative: 'Just now', full: parsed.toLocaleString('en-IN') };
    if (diffMin < 60) return { relative: `${diffMin}m ago`, full: parsed.toLocaleString('en-IN') };
    if (diffHours < 24) return { relative: `${diffHours}h ago`, full: parsed.toLocaleString('en-IN') };
    if (diffDays < 7) return { relative: `${diffDays}d ago`, full: parsed.toLocaleString('en-IN') };

    return {
      relative: parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      full: parsed.toLocaleString('en-IN'),
    };
  } catch {
    return { relative: timestamp, full: timestamp };
  }
}
