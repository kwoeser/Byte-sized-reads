export const categories = {
  technology: "Technology",
  travel: "Travel",
  "video games": "Video Games",
};
export type Category = keyof typeof categories;

export const readingTimes = {
  short: "Short (< 5 min)",
  medium: "Medium (5-15 min)",
  long: "Long (> 15 min)",
};
export type ReadingTime = keyof typeof readingTimes;

export type FilterState = {
  category: Category | null;
  length: ReadingTime | null;
};
