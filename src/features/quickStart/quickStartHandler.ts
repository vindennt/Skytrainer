import { handleQuickStartAvailability } from "@src/utils/dates";

export const MAX_QUICKSTARTS: number = 5;

export interface QuickStart {
  id?: string;
  stationId: string;
  name: string;
  duration: number;
  lastFinished: Date | null;
}

export function getSortedQuickstarts(quickstarts: QuickStart[]) {
  const sorted: QuickStart[] = quickstarts.slice().sort((a, b) => {
    const isAvailableA = handleQuickStartAvailability(a.lastFinished);
    const isAvailableB = handleQuickStartAvailability(b.lastFinished);

    if (isAvailableA === isAvailableB) {
      return 0;
    } else if (isAvailableA && !isAvailableB) {
      return -1;
    } else {
      return 1;
    }
  });
  return sorted;
}
