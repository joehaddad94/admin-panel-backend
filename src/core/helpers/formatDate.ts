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
