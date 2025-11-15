export const dateUtils = {
  formatDate: (date: Date, format: string = 'DD/MM/YYYY'): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString());
  },

  formatTime: (date: Date, format24: boolean = false): string => {
    if (format24) {
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },

  getRelativeTime: (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return dateUtils.formatDate(date);
  },

  isToday: (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  isYesterday: (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  },

  formatTime12Hour: (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },

  formatISOToTime: (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },
  
  isCurrentTimeAfter: (openTime: string, currentTime: string): boolean => {

    const normalizeWhitespace = (s: string) =>
      s
        // replace common non-breaking & narrow spaces with normal space
        .replace(/\u00A0|\u202F|\u2007|\uFEFF/g, ' ')
        // collapse any whitespace sequence to single space and trim
        .replace(/\s+/g, ' ')
        .trim();

    const parseTime = (timeStr: string): number => {
      const original = timeStr;
      const normalized = normalizeWhitespace(timeStr);

      // match like "9:30 AM", "12:14 PM", case-insensitive, allowing single or double digit hour
      const m = normalized.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
      if (!m) {
        // helpful debug info: show unicode code points for characters
        const charCodes = [...original].map(ch => ch.charCodeAt(0).toString(16).padStart(4, '0')).join(' ');
        throw new Error(`Invalid time format: "${original}". Normalized: "${normalized}". Char codes (hex): ${charCodes}`);
      }

      let hours = parseInt(m[1], 10);
      const minutes = parseInt(m[2], 10);
      const modifier = m[3].toUpperCase();

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    };

    const openMinutes = parseTime(openTime);
    const currentMinutes = parseTime(currentTime);

    return currentMinutes >= openMinutes;
  },



};