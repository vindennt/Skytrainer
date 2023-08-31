import { Buyable } from "@src/utils/shop";

// Used to sort shop data and push owned stations to the back of the final array
export function sortByMapPresence(
  data: Buyable[],
  stationsOwned: Map<string, number>
): Buyable[] {
  const unowned: Buyable[] = [];
  const owned: Buyable[] = [];

  for (const buyable of data) {
    if (stationsOwned.has(buyable.itemid)) {
      owned.push(buyable);
    } else {
      unowned.push(buyable);
    }
  }

  // unowned items should come first
  return unowned.concat(owned);
}
