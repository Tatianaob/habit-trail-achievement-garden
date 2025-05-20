
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getStreakCount = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 1;
  const today = getToday();
  const yesterday = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  
  // If the most recent date is neither today nor yesterday, return 0
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  // Count consecutive days
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = new Date(sortedDates[i + 1]);
    
    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getDatesBetween = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const isToday = (dateString: string): boolean => {
  return dateString === getToday();
};

export const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getMonthName = (month: number): string => {
  return new Date(2000, month, 1).toLocaleDateString('en-US', { month: 'long' });
};
