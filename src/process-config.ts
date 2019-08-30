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
  enabledExtensions?: Array<string>;
  disabledExtensions?: Array<string>;
  markerType?: string;
};

export type Config = {
  enabledExtensions: Array<string>;
  disabledExtensions: Array<string>;
  markerType: string;
};

export default function processConfig(config: ConfigInput): Config {
  return {
    enabledExtensions: config.enabledExtensions || DEFAULT_ENABLED_EXTS,
    disabledExtensions: config.disabledExtensions || DEFAULT_DISABLED_EXTS,
    markerType: config.markerType || DEFAULT_MARKER_TYPE
  };
}
