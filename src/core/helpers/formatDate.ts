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

export function formatExamDate(date: Date): string {
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

  return `${formattedDate} from ${formattedTime} to ${formattedEndTime}`;
}
