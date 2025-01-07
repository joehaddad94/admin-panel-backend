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
  console.log('🚀 ~ formatExamDate ~ date:', date);
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    date,
  );
  console.log('🚀 ~ formatExamDate ~ formattedDate:', formattedDate);

  const hours = date.getHours();
  console.log('🚀 ~ formatExamDate ~ hours:', hours);
  const minutes = date.getMinutes().toString().padStart(2, '0');
  console.log('🚀 ~ formatExamDate ~ minutes:', minutes);

  const period = hours >= 12 ? 'pm' : 'am';
  console.log('🚀 ~ formatExamDate ~ period:', period);
  const formattedHours = hours % 12 || 12;
  console.log('🚀 ~ formatExamDate ~ formattedHours:', formattedHours);

  const endHours = (hours + 3) % 24;
  console.log('🚀 ~ formatExamDate ~ endHours:', endHours);

  const formattedEndHours = endHours % 12 || 12;
  console.log('🚀 ~ formatExamDate ~ formattedEndHours:', formattedEndHours);
  const endPeriod = endHours >= 12 ? 'pm' : 'am';
  console.log('🚀 ~ formatExamDate ~ endPeriod:', endPeriod);

  return `${formattedDate} from ${formattedHours}:${minutes} ${period} to ${formattedEndHours}:${minutes} ${endPeriod}`;
}
