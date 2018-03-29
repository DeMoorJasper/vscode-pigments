import { window, TextEditorDecorationType, DecorationOptions, DecorationRangeBehavior } from 'vscode';
const ColorLibrary = require('color');

function contrast(colorString) : string {
  let color = ColorLibrary(colorString);
  return color.negate().string();
}

export default class Color {
  decorationType: TextEditorDecorationType;
  decorationOptions: DecorationOptions[] = [];
  color : string;

  constructor(color: string) {
    this.color = color;
    this.generateType();
  }

  generateType() {
    this.decorationType = window.createTextEditorDecorationType({
      backgroundColor: this.color,
      color: contrast(this.color),
      rangeBehavior: DecorationRangeBehavior.ClosedClosed
    });
  }

  addOption(decorationOptions : DecorationOptions) {
    this.decorationOptions.push(decorationOptions);
  }
}