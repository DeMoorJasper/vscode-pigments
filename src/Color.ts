import {
  window,
  TextEditorDecorationType,
  DecorationOptions,
  DecorationRangeBehavior,
  Range
} from "vscode";
const ColorLibrary = require("tinycolor2");

function contrastColor(color) {
  let { r, g, b } = ColorLibrary(color).toRgb();
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
}

function normaliseColor(color) {
  let { r, g, b, a } = ColorLibrary(color).toRgb();
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type MarkerProps = {
  color: string;
  negativeColor: string;
};

const markerRenderers = {
  background: (props: MarkerProps) => {
    return {
      backgroundColor: props.color,
      color: props.negativeColor
    };
  },
  outline: (props: MarkerProps) => {
    return {
      border: `1px solid ${props.color}`
    };
  }
};

export default class Color {
  decorationType: TextEditorDecorationType;
  decorationOptions: DecorationOptions[] = [];
  color: string;
  negativeColor: string;

  constructor(color: string, markerType: string) {
    this.color = normaliseColor(color.toLowerCase());
    this.negativeColor = contrastColor(this.color);
    this.decorationType = window.createTextEditorDecorationType({
      ...markerRenderers[markerType]({
        color: this.color,
        negativeColor: this.negativeColor
      }),
      rangeBehavior: DecorationRangeBehavior.ClosedClosed
    });
  }

  addOption(range: Range) {
    this.decorationOptions.push({
      range: range
    });
  }
}
