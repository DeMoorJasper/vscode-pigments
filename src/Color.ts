import { window, TextEditorDecorationType, DecorationOptions, DecorationRangeBehavior, Range } from 'vscode';
const ColorLibrary = require('color');

function contrastColor(color) {
  let [r, g, b] = ColorLibrary(color).rgb().color;
  return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
}

export default class Color {
  decorationType: TextEditorDecorationType;
  decorationOptions: DecorationOptions[] = [];
  color : string;
  negativeColor : string;

  constructor(color: string) {
    this.color = color;
    this.negativeColor = contrastColor(this.color);
    this.decorationType = window.createTextEditorDecorationType({
      backgroundColor: this.color,
      color: this.negativeColor,
      rangeBehavior: DecorationRangeBehavior.ClosedClosed
    });
  }

  addOption(range : Range) {
    this.decorationOptions.push({
      range: range
    });
  }
}