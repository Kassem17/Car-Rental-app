export function extractTime(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() +1;
  const Year = date.getFullYear();
  return `${day} / ${month} / ${Year}`;
}
