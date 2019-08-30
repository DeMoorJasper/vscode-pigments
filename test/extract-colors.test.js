const assert = require("assert");
const fs = require("fs");
const path = require("path");

const extractColors = require("../out/extract-colors").default;

function readInput(filename) {
  return fs.readFileSync(path.join(__dirname, "input", filename), "utf-8");
}

describe("extract-colors", () => {
  it("Should be able to catch all colors in css file", () => {
    let style = readInput("style.css");
    let matches = extractColors(style);

    assert.deepEqual(matches, [
      { index: 45, value: "#00a6e4" },
      { index: 90, value: "hsla(120, 100%, 50%, 0.3)" },
      { index: 137, value: "hsl(120, 100%, 50%)" },
      { index: 178, value: "HSL(120, 100%, 50%)" },
      { index: 219, value: "HSLA(120, 100%, 50%, 0.3)" },
      { index: 256, value: "rgba(123, 123, 123, 0.65)" },
      { index: 292, value: "rgb(1, 123, 123)" },
      { index: 319, value: "RGB(1, 123, 123)" },
      { index: 346, value: "RGBA(255, 123, 255, 0.65)" },
      { index: 383, value: "#ffffff" },
      { index: 401, value: "#FFFFFF" },
      { index: 419, value: "rgb(1, 123, 123)" },
      { index: 447, value: "rgb(1, 123, 123)" },
      { index: 474, value: "rgb(1, 123, 123)" }
    ]);
  });

  it("Should be able to catch all colors in js file", () => {
    let style = readInput("script.js");
    let matches = extractColors(style);

    assert.deepEqual(matches, [
      { index: 33, value: "#ffffff" },
      { index: 62, value: "hsla(120,100%,50%,0.3)" }
    ]);
  });
});
