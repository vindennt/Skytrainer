export const getDate = (rawDate: string) => {
  const formattedDate = new Date(Date.parse(rawDate));
  return formattedDate.toLocaleDateString();
};

export function datesMatch(dateA: Date, dateB: Date): boolean {
  // (YYYY-MM-DD)
  const isoDateA: string = dateA.toISOString().split("T")[0];
  const isoDateB: string = dateB.toISOString().split("T")[0];
  return isoDateA === isoDateB;
}
