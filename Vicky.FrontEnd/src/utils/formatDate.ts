export function formatDate(dateStr: string): string {
  let date: string = dateStr;

  if(dateStr.includes('T')) {
    const [datePart, _] = dateStr.split('T');
    date = datePart;
  }

  const [year, month, day] = date.split('-').map(Number);
  
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    month: 'short',
    day: 'numeric',
  });
}