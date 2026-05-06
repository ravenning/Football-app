// Date utility functions for mock data generation and formatting

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeAgo {
  value: number;
  unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  text: string;
}

// Format date to ISO 8601 string
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

// Format date for display
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' | 'relative' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    case 'long':
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    case 'relative':
      return getTimeAgo(dateObj).text;
    default:
      return dateObj.toLocaleDateString();
  }
};

// Calculate time ago from a date
export const getTimeAgo = (date: Date): TimeAgo => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return {
      value: diffInSeconds,
      unit: 'second',
      text: diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`
    };
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return {
      value: diffInMinutes,
      unit: 'minute',
      text: diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
    };
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return {
      value: diffInHours,
      unit: 'hour',
      text: diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
    };
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return {
      value: diffInDays,
      unit: 'day',
      text: diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
    };
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return {
      value: diffInWeeks,
      unit: 'week',
      text: diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`
    };
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return {
      value: diffInMonths,
      unit: 'month',
      text: diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`
    };
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return {
    value: diffInYears,
    unit: 'year',
    text: diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`
  };
};

// Generate mock dates within a range
export const generateMockDate = (range: DateRange): Date => {
  const start = range.start.getTime();
  const end = range.end.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
};

// Generate mock dates for the current season
export const getCurrentSeasonDates = (): DateRange => {
  const now = new Date();
  const year = now.getFullYear();
  
  // Spring season: January to May
  const start = new Date(year, 0, 1); // January 1st
  const end = new Date(year, 4, 31); // May 31st
  
  return { start, end };
};

// Generate mock dates for recent activity
export const getRecentActivityDates = (): DateRange => {
  const now = new Date();
  const start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago
  return { start, end: now };
};

// Generate mock dates for training sessions
export const getTrainingDates = (): Date[] => {
  const dates: Date[] = [];
  const now = new Date();
  
  // Generate training dates for the next 4 weeks (Thursdays at 18:30)
  for (let i = 0; i < 4; i++) {
    const date = new Date(now);
    const currentDay = date.getDay();
    const daysUntilThursday = (4 - currentDay + 7) % 7;
    date.setDate(date.getDate() + daysUntilThursday + (i * 7));
    date.setHours(18, 30, 0, 0);
    dates.push(date);
  }
  
  return dates;
};

// Generate mock match dates for a season
export const getMatchDates = (seasonStart: Date, totalMatches: number = 20): Date[] => {
  const dates: Date[] = [];
  const startDate = new Date(seasonStart);
  
  // Generate matches every Saturday for the season
  for (let i = 0; i < totalMatches; i++) {
    const matchDate = new Date(startDate);
    matchDate.setDate(startDate.getDate() + (i * 7)); // Every Saturday
    matchDate.setHours(15, 0, 0, 0); // 3:00 PM kick-off
    dates.push(matchDate);
  }
  
  return dates;
};

// Format match date for display
export const formatMatchDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', options);
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Check if a date is in the past
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

// Check if a date is in the future
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

// Get days until a date
export const getDaysUntil = (date: Date): number => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get match week number from date
export const getMatchWeek = (seasonStart: Date, matchDate: Date): number => {
  const diffTime = matchDate.getTime() - seasonStart.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, diffWeeks);
};

// Generate mock timestamp for messages
export const generateMessageTimestamp = (): string => {
  const now = new Date();
  const randomMinutesAgo = Math.floor(Math.random() * 1440); // Random time in last 24 hours
  const timestamp = new Date(now.getTime() - (randomMinutesAgo * 60 * 1000));
  
  // Return relative time for recent messages
  const timeAgo = getTimeAgo(timestamp);
  if (timeAgo.unit === 'hour' || timeAgo.unit === 'minute') {
    return timeAgo.text;
  }
  
  // Return formatted date for older messages
  return formatDate(timestamp, 'short');
};

// Format availability status with date
export const formatAvailabilityWithDate = (status: string, date?: Date): string => {
  if (!date) return status;
  
  const dateStr = formatDate(date, 'short');
  return `${status} (${dateStr})`;
};

// Generate mock dates for announcements
export const generateAnnouncementDates = (): Date[] => {
  const dates: Date[] = [];
  const recentActivity = getRecentActivityDates();
  
  // Generate 3-5 announcement dates in the past week
  const numAnnouncements = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < numAnnouncements; i++) {
    dates.push(generateMockDate(recentActivity));
  }
  
  // Sort by most recent first
  return dates.sort((a, b) => b.getTime() - a.getTime());
};

// Create a date range for a specific period
export const createDateRange = (start: Date, end: Date): DateRange => {
  return { start: new Date(start), end: new Date(end) };
};

// Add days to a date
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Subtract days from a date
export const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

// Get start of day
export const getStartOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Get end of day
export const getEndOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};
