import { datesMatch } from "@src/utils/dates";

test("Equal ISO dates", () => {
  const dateA: Date = new Date();
  const dateB: Date = new Date();

  expect(datesMatch(dateA, dateB)).toBe(true);
});
//
