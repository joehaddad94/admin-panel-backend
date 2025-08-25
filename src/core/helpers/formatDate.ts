export const formatDate = (dateInput: string | Date) => {
  if (typeof dateInput === 'string') {
    if (dateInput.includes('T')) {
      return new Date(dateInput).toLocaleDateString();
    }

    const parts = dateInput.split('-');
    if (parts.length === 3) {
      const formattedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
      return new Date(formattedDate).toLocaleDateString();
    }

    return 'Invalid Date';
  }

  return dateInput.toLocaleDateString();
};

export function formatExamDate(date: Date): { format1: string; format2: string } {
  const timeZone = 'Asia/Beirut';

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    date,
  );

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone,
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(
    date,
  );

  const endTime = new Date(date);
  endTime.setHours(endTime.getHours() + 3);
  const formattedEndTime = new Intl.DateTimeFormat('en-US', timeOptions).format(
    endTime,
  );

  const format1 = `${formattedDate} from ${formattedTime} to ${formattedEndTime}`;
  const format2 = `${formattedDate} at ${formattedTime}`;

  return {
    format1,
    format2,
  };
}

export function formatReadableDate(date: Date): string {
  const timeZone = 'Asia/Beirut';

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    date,
  );

  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const dayWithSuffix = formattedDate.replace(/\d+/, `${day}${suffix}`);

  return `${dayWithSuffix}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatTime(time: Date | string | null): string {
  if (!time) return '-';
  
  if (typeof time === 'string') {
    // Handle time string in format "HH:mm" or "HH:mm:ss"
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes.padStart(2, '0')} ${ampm}`;
  }

  if (time instanceof Date && !isNaN(time.getTime())) {
    const timeZone = 'Asia/Beirut';
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone,
    };

    const result = new Intl.DateTimeFormat('en-US', timeOptions).format(time);
    return result.replace(/^0/, '');
  }

  return '-';
}
