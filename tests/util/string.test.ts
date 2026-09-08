import { expect, test } from "vitest";
import toTitleCase from "../../src/util/string";

test.each([
  ["asdf", "Asdf"],
  ["so trUe", "So True"],
  ["o K k", "o k k"],
  ["火鍋", "火鍋"],
  ["", ""],
  ["   ", ""],
  ["  asdf ", "Asdf"],
  ["ii", "II"],
  ["Stephanie's - Market C", "Stephanie's - Market C"],
  ["Market c At HEINZ Cafe", "Market C At Heinz Cafe"],
])("toTitleCasetest", (before, after) => {
  expect(toTitleCase(before)).toBe(after);
});
