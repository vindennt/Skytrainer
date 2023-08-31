export const getDate = (rawDate: string) => {
  const formattedDate = new Date(Date.parse(rawDate));
  return formattedDate.toLocaleDateString();
};
