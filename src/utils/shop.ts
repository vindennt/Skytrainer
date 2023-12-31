export interface Buyable {
  name: string;
  cost: number;
  itemid: string;
  category: string;
  // TODO: add  flavour text
}

export const StationTabCategories = [
  { key: "All", value: "all" },
  { key: "EXP", value: "00" },
  { key: "CND", value: "01" },
  { key: "MLN", value: "02" },
  { key: "EGN", value: "03" },
];

export const shopData: Buyable[] = [
  { name: "Waterfront", cost: 10, itemid: "001", category: "00" },
  { name: "Burrard", cost: 1, itemid: "002", category: "00" },
  { name: "Granville", cost: 10, itemid: "003", category: "00" },
  { name: "Stadium-Chinatown", cost: 10, itemid: "004", category: "00" },
  {
    name: "Main Street - ScienceWorld",
    cost: 10,
    itemid: "005",
    category: "00",
  },
  { name: "Commercial-Broadway", cost: 10, itemid: "006", category: "00" },
  { name: "Nanaimo", cost: 10, itemid: "007", category: "00" },
  { name: "29th Avenue", cost: 10, itemid: "008", category: "00" },
  { name: "Joyce-Collingwood", cost: 10, itemid: "009", category: "00" },
  { name: "Patterson", cost: 10, itemid: "010", category: "00" },
  { name: "Metrotown", cost: 10, itemid: "011", category: "00" },
  { name: "Royal Oak", cost: 10, itemid: "012", category: "00" },
  { name: "Edmonds", cost: 10, itemid: "013", category: "00" },
  { name: "22nd Street", cost: 10, itemid: "014", category: "00" },
  { name: "New Westminister", cost: 10, itemid: "015", category: "00" },
  { name: "Columbia", cost: 10, itemid: "016", category: "00" },
  { name: "Scott Road", cost: 10, itemid: "017", category: "00" },
  { name: "Gateway", cost: 10, itemid: "018", category: "00" },
  { name: "Surrey Central", cost: 10, itemid: "019", category: "00" },
  { name: "King George", cost: 10, itemid: "020", category: "00" },
  { name: "Sapperton", cost: 10, itemid: "021", category: "00" },
  { name: "Braid", cost: 10, itemid: "022", category: "00" },
  { name: "Lougheed Town Centre", cost: 10, itemid: "023", category: "00" },
  {
    name: "Production Way University",
    cost: 10,
    itemid: "024",
    category: "00",
  },
  { name: "VCC Clark", cost: 10, itemid: "025", category: "01" },
  { name: "Renfrew", cost: 10, itemid: "026", category: "01" },
  { name: "Rupert", cost: 10, itemid: "027", category: "01" },
  { name: "Gilmore", cost: 10, itemid: "028", category: "01" },
  { name: "Brentwood Town Centre", cost: 10, itemid: "029", category: "01" },
  { name: "Holdom", cost: 10, itemid: "030", category: "01" },
  { name: "Sperling Burnaby Lake", cost: 10, itemid: "031", category: "01" },
  { name: "Lake City", cost: 10, itemid: "032", category: "01" },
  { name: "Burquitlam", cost: 10, itemid: "033", category: "03" },
  { name: "Moody Centre", cost: 10, itemid: "034", category: "03" },
  { name: "Inlet Centre", cost: 10, itemid: "035", category: "03" },
  { name: "Coquitlam Central", cost: 10, itemid: "036", category: "03" },
  { name: "Lincoln", cost: 10, itemid: "037", category: "03" },
  { name: "Lafarge Lake Douglas", cost: 10, itemid: "038", category: "03" },
  { name: "Vancouver City Centre", cost: 10, itemid: "039", category: "02" },
  { name: "Yaletown Roundhouse", cost: 10, itemid: "040", category: "02" },
  { name: "Olympic Village", cost: 10, itemid: "041", category: "02" },
  { name: "Broadway City Hall", cost: 10, itemid: "042", category: "02" },
  { name: "King Edward", cost: 10, itemid: "043", category: "02" },
  { name: "Oakridge 41st Ave", cost: 10, itemid: "044", category: "02" },
  { name: "Langara 49th Ave", cost: 10, itemid: "045", category: "02" },
  { name: "Marine Drive", cost: 10, itemid: "046", category: "02" },
  { name: "Bridgeport", cost: 10, itemid: "047", category: "02" },
  { name: "Aberdeen", cost: 10, itemid: "048", category: "02" },
  { name: "Lansdowne", cost: 10, itemid: "049", category: "02" },
  { name: "Richmond Brighouse", cost: 10, itemid: "050", category: "02" },
  { name: "Templeton", cost: 10, itemid: "052", category: "02" },
  { name: "Sea Island Centre", cost: 10, itemid: "051", category: "02" },
  { name: "YVR Airport", cost: 10, itemid: "053", category: "02" },
];

export const sortByCategory = (
  data: Buyable[],
  category: string
): Buyable[] => {
  if (category === "all") return data;

  const filteredData = data.filter((item) => item.category === category);
  filteredData.sort((a, b) => a.category.localeCompare(b.category));

  return filteredData;
};
