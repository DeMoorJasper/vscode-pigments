import * as vscode from "vscode";

import Color from "./Color";
import processConfig, { Config, ConfigInput } from "./process-config";
import extractColors from "./extract-colors";

function getConfigValueIfHas(
  key: string,
  config: vscode.WorkspaceConfiguration
): string | null {
  if (config.has(key)) {
    return config.get(key);
  }

  return null;
}

function readConfig(): ConfigInput {
  let config = vscode.workspace.getConfiguration("pigments");

  return {
    enabledExtensions: getConfigValueIfHas("enabledExtensions", config),
    disabledExtensions: getConfigValueIfHas("disabledExtensions", config),
    markerType: getConfigValueIfHas("markerType", config)
  };
}

function getExtension(filename: string) {
  return filename.substring(filename.lastIndexOf(".") + 1);
}

// Update the actual decorators
function updateDecorations(
  decorations: { [key: string]: Color },
  config: Config
) {
  let activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor || !activeEditor.document) {
    return;
  }

  // Dispose decorations
  if (decorations) {
    Object.keys(decorations).forEach(key => {
      let color: Color = decorations[key];
      color.decorationType.dispose();
      delete decorations[key];
    });
  }

  let extension = getExtension(activeEditor.document.fileName);

  if (config.disabledExtensions.indexOf(extension) > -1) return;
  if (config.enabledExtensions.indexOf(extension) > -1) {
    let text = activeEditor.document.getText();
    let colorMatches = extractColors(text);

    for (let match of colorMatches) {
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(
        match.index + match.value.length
      );

      if (!decorations[match.value]) {
        decorations[match.value] = new Color(match.value, config.markerType);
      }

      decorations[match.value].addOption(new vscode.Range(startPos, endPos));
    }

    Object.keys(decorations).forEach(key => {
      let color: Color = decorations[key];
      activeEditor.setDecorations(
        color.decorationType,
        color.decorationOptions
      );
    });
  }
}

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("vscode pigments is activated");
  let activeEditor = vscode.window.activeTextEditor;

  // Global State
  let config = processConfig(readConfig());
  let decorations = {};

  // Debouncing stuff
  let timeout;
  let updateStaged = false;

  const triggerUpdateDecorations = (force: boolean = false) => {
    updateStaged = true;

    const runStaged = () => {
      if (updateStaged) {
        updateDecorations(decorations, config);
        updateStaged = false;
      }
    };

    if (!timeout || force) {
      runStaged();
    } else {
      clearTimeout(timeout);
    }

    timeout = setTimeout(runStaged, 500);
  };

  // Register events
  vscode.window.onDidChangeActiveTextEditor(
    editor => {
      activeEditor = editor;
      if (activeEditor) {
        triggerUpdateDecorations(true);
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    event => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeConfiguration(() => {
    config = processConfig(readConfig());
  });

  // Trigger initial update
  if (activeEditor) {
    triggerUpdateDecorations();
  }
}
