export interface SharePayload {
  title?: string;
  text?: string;
  url?: string;
}

export interface ShareResult {
  success: boolean;
  action: 'shared' | 'copied' | 'cancelled' | 'failed';
  message: string;
}

/**
 * Robust cross-browser sharing:
 * 1. Checks if mobile with navigator.share -> tries native share sheet.
 * 2. On desktop or if native share fails/unavailable -> copies URL to clipboard with fallback.
 * 3. Returns detailed status so UI can react with appropriate feedback toast and icons.
 */
export async function shareContent(payload: SharePayload = {}): Promise<ShareResult> {
  if (typeof window === 'undefined') {
    return { success: false, action: 'failed', message: 'Window is not defined' };
  }

  const shareUrl = payload.url || window.location.href;
  const shareTitle = payload.title || document.title || 'Viztore';
  const shareText = payload.text || shareTitle;

  // Detect mobile device to prioritize native share sheet where it works best
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      return { success: true, action: 'shared', message: 'Shared successfully!' };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, action: 'cancelled', message: 'Share cancelled' };
      }
      // If native share failed on mobile, proceed to clipboard copy fallback
    }
  }

  // Clipboard copy fallback (desktop or fallback)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(shareUrl);
      return { success: true, action: 'copied', message: 'Link copied to clipboard!' };
    }
  } catch {
    // If modern clipboard API fails, fallback to legacy copy
  }

  // Legacy textarea fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      return { success: true, action: 'copied', message: 'Link copied to clipboard!' };
    }
  } catch {
    // Both attempts failed
  }

  return { success: false, action: 'failed', message: 'Unable to share or copy link' };
}

