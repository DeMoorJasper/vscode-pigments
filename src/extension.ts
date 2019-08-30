import * as vscode from "vscode";

import Color from "./Color";
import processConfig from "./process-config";
import extractColors from "./extract-colors";

// TODO: Add config options for file extensions and markerType
// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("vscode pigments is activated");

  let activeEditor = vscode.window.activeTextEditor;
  let decorations = {};

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

  // Trigger initial update
  if (activeEditor) {
    triggerUpdateDecorations();
  }

  // Create update and update limiting function
  let timeout = null;
  let updateStaged;
  function triggerUpdateDecorations(force: boolean = false) {
    updateStaged = true;
    if (!timeout || force) {
      runStaged();
    } else {
      clearTimeout(timeout);
    }
    timeout = setTimeout(runStaged, 500);
  }

  // Runs the update if one is staged
  function runStaged() {
    if (updateStaged) {
      updateDecorations();
      updateStaged = false;
    }
  }

  function getExtension(filename) {
    return filename.substring(filename.lastIndexOf(".") + 1);
  }

  // Update the actual decorators
  function updateDecorations() {
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
    let config = processConfig({});

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
          decorations[match.value] = new Color(match.value);
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
}
