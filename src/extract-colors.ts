const COLOR_REGEX: RegExp = /(( |:|'|"|`)+)((#[A-Fa-f0-9]{2,8})|((rgb|RGB)(a|A)?\(( *(\d|\.)+ *,?){3,4}\))|(hsl|HSL)(a|A)?\(( *(\d|\.)+%? *,*){3,4}\))( |;|,|'|"|`)+/g;

export type Match = {
  index: number;
  value: string;
};

export default function extractColors(text: string) {
  let match;
  let matches: Array<Match> = [];

  while ((match = COLOR_REGEX.exec(text))) {
    matches.push({
      index: match.index + match[1].length,
      value: match[3]
    });
  }

  return matches;
}
