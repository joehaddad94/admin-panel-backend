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
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    date,
  );

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const period = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;

  const endHours = (hours + 3) % 24;
  const formattedEndHours = endHours % 12 || 12;
  const endPeriod = endHours >= 12 ? 'pm' : 'am';

  const result = `${formattedDate} from ${formattedHours}:${minutes} ${period} to ${formattedEndHours}:${minutes} ${endPeriod}`;

  return result;
}
