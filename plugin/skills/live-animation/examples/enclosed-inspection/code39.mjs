// Code 39 alternates bar and space widths. Each symbol ends in a single narrow gap.
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*";
const patterns = [
  "1113313111", "3113111131", "1133111131", "3133111111", "1113311131",
  "3113311111", "1133311111", "1113113131", "3113113111", "1133113111",
  "3111131131", "1131131131", "3131131111", "1111331131", "3111331111",
  "1131331111", "1111133131", "3111133111", "1131133111", "1111333111",
  "3111111331", "1131111331", "3131111311", "1111311331", "3111311311",
  "1131311311", "1111113331", "3111113311", "1131113311", "1111313311",
  "3311111131", "1331111131", "3331111111", "1311311131", "3311311111",
  "1331311111", "1311113131", "3311113111", "1331113111", "1313131111",
  "1313111311", "1311131311", "1113131311", "1311313111",
];

export function code39Widths(value) {
  if (!value || [...value].some(char => char === "*" || !alphabet.includes(char)))
    throw new Error("Use supported Code 39 article data, or supply this job’s actual symbology and artwork.");
  return [...`*${value}*`].flatMap(char => [...patterns[alphabet.indexOf(char)]].map(Number));
}
