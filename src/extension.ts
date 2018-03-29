import * as vscode from 'vscode';
import Color from './Color';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('vscode pigments is activated');

	let activeEditor = vscode.window.activeTextEditor;

	// Register events
	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (activeEditor) {
			triggerUpdateDecorations(true);
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	// Trigger initial update
	if (activeEditor) {
		triggerUpdateDecorations();
	}
	
	// Create update and update limiting function
	let timeout = null;
	let updateStaged;
	function triggerUpdateDecorations(force : boolean = false) {
		updateStaged = true;
		if (!timeout || force) {
			runStaged();
			timeout = setTimeout(runStaged, 500);
		}
	}

	// Runs the update if one is staged
	function runStaged() {
		if (updateStaged) {
			updateDecorations();
			updateStaged = false;
		}
		clearTimeout(timeout);
		timeout = null;
	}

	// Update the actual decorators
	function updateDecorations() {
		if (!activeEditor) {
			return;
		}

		const text = activeEditor.document.getText();
		let regEx = /(#[A-Fa-f0-9]{2,6})|(rgb(a?)\(( *(\d|\.)+ *,?){3,4}\)|(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|yellow))/g;
		let match;
		let decorations = {};
		while (match = regEx.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			if (!decorations[match[0]]) {
				decorations[match[0]] = new Color(match[0]);
			}

			decorations[match[0]].addOption({
				range: new vscode.Range(startPos, endPos)
			});
		}

		Object.keys(decorations).forEach(key => {
			let color : Color = decorations[key];
			
			activeEditor.setDecorations(color.decorationType, color.decorationOptions);
		});
	}
}

