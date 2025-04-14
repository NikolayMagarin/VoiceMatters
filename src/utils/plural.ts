const CASES = [2, 0, 1, 1, 1, 2];

export function plural(value: number, ...titles: [string, string, string]) {
  return titles[
    value % 100 > 4 && value % 100 < 20 ? 2 : CASES[Math.min(value % 10, 5)]
  ];
}
