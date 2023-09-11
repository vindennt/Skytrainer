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
  const today: Date = new Date();
  const todayYMD = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return todayYMD;
}

export function isConsecutiveDay(olderDate: Date): boolean {
  const yesterday: Date = getTodayDMY();
  yesterday.setDate(yesterday.getDate() - 1);
  const result: boolean =
    olderDate.getFullYear() === yesterday.getFullYear() &&
    olderDate.getMonth() === yesterday.getMonth() &&
    olderDate.getDate() === yesterday.getDate();

  console.log(olderDate + " vs  " + yesterday);
  console.log(result);

  return result;
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
