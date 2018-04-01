import * as vscode from 'vscode';
import Color from './Color';

const LANGUAGES = ['css', 'scss', 'less', 'plaintext'];
const COLOR_CODE_REGEX : RegExp = /(#[A-Fa-f0-9]{2,6})|(rgb(a?)\(( *(\d|\.)+ *,?){3,4}\))|hsl\(( *\d+%? *,*){3}\)/g;
const COLOR_NAME_REGEX : RegExp = /(color:|background:) +(aliceblue|antiquewhite|aquamarine|aqua|azure|beige|bisque|black|blanchedalmond|blueviolet|blue|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|goldenrod|gold|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavenderblush|lavender|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|yellow)/g;

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

	// Update the actual decorators
	function updateDecorations() {
		if (!activeEditor || !activeEditor.document) {
			return;
		}

		const text = activeEditor.document.getText();
		let match;
		let decorations = {};

		const addMatch = (match) => {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			if (!decorations[match[0]]) {
				decorations[match[0]] = new Color(match[0]);
			}

			decorations[match[0]].addOption(new vscode.Range(startPos, endPos));
		}

		while (match = COLOR_CODE_REGEX.exec(text)) {
			addMatch(match);
		}
		
		if (LANGUAGES.indexOf(activeEditor.document.languageId) > -1) {
			while (match = COLOR_NAME_REGEX.exec(text)) {
				let originalMatch = match[0];
				match[0] = match[0].substring(match[0].lastIndexOf(' ') + 1);
				match.index = match.index + (originalMatch.length - match[0].length);
				addMatch(match);
			}
		}

		Object.keys(decorations).forEach(key => {
			let color : Color = decorations[key];
			activeEditor.setDecorations(color.decorationType, color.decorationOptions);
		});
	}
}

