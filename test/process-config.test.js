const assert = require("assert");
const fs = require("fs");
const path = require("path");

const processConfig = require("../out/process-config").default;

function readInput(filename) {
  return fs.readFileSync(path.join(__dirname, "input", filename), "utf-8");
}

describe("process-config", () => {
  it("Should be able to process a partial config", () => {
    let config = processConfig({
      markerType: "outline",
      enabledExtensions: null
    });

    assert(config.markerType === "outline");
    assert(config.enabledExtensions !== null);
    assert(config.enabledExtensions.length > 0);
    assert(config.disabledExtensions !== null);
    assert(config.disabledExtensions.length === 0);
  });

  it("Should be able to process a full config", () => {
    let config = processConfig({
      markerType: "outline",
      enabledExtensions: "",
      disabledExtensions: "js, jsx"
    });

    assert(config.markerType === "outline");
    assert(config.enabledExtensions !== null);
    assert(config.enabledExtensions.length === 0);
    assert(config.disabledExtensions !== null);
    assert(config.disabledExtensions.length > 0);
    assert(config.disabledExtensions[0] === "js");
  });

  it("Should be able to process a null config", () => {
    let config = processConfig({
      markerType: null,
      enabledExtensions: null,
      enabledExtensions: null
    });

    assert(config.markerType === "background");
    assert(config.enabledExtensions !== null);
    assert(config.enabledExtensions.length > 0);
    assert(config.disabledExtensions !== null);
    assert(config.disabledExtensions.length === 0);
  });
});
