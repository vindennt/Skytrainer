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

// Get's todays date as only DMY format.
export function getTodayDMY(): Date {
  const now: Date = new Date();
  const todayYMD = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return todayYMD;
}
