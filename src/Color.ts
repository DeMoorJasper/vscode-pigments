import { window, TextEditorDecorationType, DecorationOptions, DecorationRangeBehavior, Range } from 'vscode';
const ColorLibrary = require('color');

function negative(colorString) : string {
  let color = ColorLibrary(colorString);
  return color.negate().string();
}

export default class Color {
  decorationType: TextEditorDecorationType;
  decorationOptions: DecorationOptions[] = [];
  color : string;
  negativeColor : string;

  constructor(color: string) {
    this.color = color;
    this.negativeColor = negative(this.color);
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