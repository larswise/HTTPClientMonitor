export const getMethodColor = (method?: string): string => {
  const m = (method || '').toUpperCase();

  // Return actual color values for background
  switch (m) {
    case 'GET':
      return '#22c55e';   // green
    case 'POST':
      return '#f97316';   // orange
    case 'PUT':
      return '#3b82f6';   // blue
    case 'PATCH':
      return '#14b8a6';   // teal
    case 'DELETE':
      return '#ef4444';   // red
    case 'HEAD':
      return '#a855f7';   // purple
    case 'OPTIONS':
    case 'TRACE':
    case 'CONNECT':
      return '#6b7280';   // gray
    default:
      return '#6b7280';   // gray
  }
}

export const toDateTimeString = (date: string): Date => {
  return new Date(date);
}

export const toTimeString = (date: string): string => { // with ms
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + d.getMilliseconds().toString().padStart(3, '0');
}

export const durationInMs = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return endDate.getTime() - startDate.getTime();
}

// Add this function to stringutils.ts
export const getStatusColor = (statusCode?: number): string => {
  if (!statusCode) return '#6b7280'; // gray - no response yet
  
  if (statusCode >= 200 && statusCode < 300) return '#22c55e'; // green - success
  if (statusCode >= 300 && statusCode < 400) return '#3b82f6'; // blue - redirect
  if (statusCode >= 400 && statusCode < 500) return '#f59e0b'; // amber - client error
  if (statusCode >= 500) return '#ef4444'; // red - server error
  
  return '#6b7280'; // gray - unknown
};

// Add this to stringutils.ts
export const getDurationColor = (durationMs?: number): string => {
  if (durationMs === undefined || durationMs === null) return '#6b7280'; // gray - no data
  
  // 10 threshold gradient: green -> yellow-green -> yellow -> orange -> red
  if (durationMs < 0) return '#6b7280'; // gray - invalid
  if (durationMs < 50) return '#22c55e';    // green - excellent (< 50ms)
  if (durationMs < 100) return '#84cc16';   // lime - very good (50-100ms)
  if (durationMs < 200) return '#a3e635';   // yellow-green - good (100-200ms)
  if (durationMs < 300) return '#facc15';   // yellow - acceptable (200-300ms)
  if (durationMs < 500) return '#fbbf24';   // amber - getting slow (300-500ms)
  if (durationMs < 750) return '#f59e0b';   // orange - slow (500-750ms)
  if (durationMs < 1000) return '#fb923c';  // light red-orange - very slow (750ms-1s)
  if (durationMs < 1500) return '#f97316';  // orange-red - poor (1-1.5s)
  if (durationMs < 2000) return '#ef4444';  // red - bad (1.5-2s)
  return '#dc2626';                         // dark red - terrible (>2s)
};