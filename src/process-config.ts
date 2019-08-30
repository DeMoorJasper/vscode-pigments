const DEFAULT_MARKER_TYPE = "background";
const DEFAULT_DISABLED_EXTS = [];
const DEFAULT_ENABLED_EXTS = [
  "css",
  "sass",
  "scss",
  "less",
  "vue",
  "pcss",
  "styl",
  "stylus",
  "js",
  "jsx",
  "ts",
  "tsx",
  "es6",
  "jsm",
  "mjs",
  "ml",
  "re",
  "coffee",
  "vue",
  "rs",
  "html",
  "htm",
  "jade",
  "pug",
  "svg",
  "glsl",
  "vert",
  "frag"
];

export type ConfigInput = {
  enabledExtensions?: string;
  disabledExtensions?: string;
  markerType?: string;
};

export type Config = {
  enabledExtensions: Array<string>;
  disabledExtensions: Array<string>;
  markerType: string;
};

function stringToArray(s: any): Array<string> {
  if (typeof s === 'string') {
    return s.split(",").map(st => st.trim()).filter(st => !!st);
  }
}

export default function processConfig(config: ConfigInput): Config {
  return {
    enabledExtensions:
      stringToArray(config.enabledExtensions) || DEFAULT_ENABLED_EXTS,
    disabledExtensions:
      stringToArray(config.disabledExtensions) || DEFAULT_DISABLED_EXTS,
    markerType: config.markerType || DEFAULT_MARKER_TYPE
  };
}
