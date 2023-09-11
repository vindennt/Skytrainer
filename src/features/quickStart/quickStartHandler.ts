export const MAX_QUICKSTARTS: number = 4;

export interface QuickStart {
  id?: string;
  stationId: string;
  name: string;
  duration: number;
}
