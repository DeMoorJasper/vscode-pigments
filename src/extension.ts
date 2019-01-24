import * as vscode from 'vscode';
import Color from './Color';

const CSS_EXT_LIST = ['css', 'sass', 'scss', 'less', 'vue', 'pcss', 'styl', 'stylus'];
const CODE_EXT_LIST = ['js', 'jsx', 'ts', 'tsx', 'es6', 'jsm', 'mjs', 'ml', 're', 'coffee', 'vue', 'rs', 'html', 'htm', 'jade', 'pug', 'svg', 'glsl', 'vert', 'frag'];
const COLOR_CODE_REGEX : RegExp = /(( |:)+)((#[A-Fa-f0-9]{2,8})|(rgb(a?)\(( *(\d|\.)+ *,?){3,4}\))|hsl\(( *\d+%? *,*){3}\))( |;)+/g;
const COLOR_NAME_REGEX : RegExp = /(color:|background:) +(aliceblue|antiquewhite|aquamarine|aqua|azure|beige|bisque|black|blanchedalmond|blueviolet|blue|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|goldenrod|gold|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavenderblush|lavender|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|yellow)/g;

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('vscode pigments is activated');

	let activeEditor = vscode.window.activeTextEditor;
	let decorations = {};

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

	function getExtension(filename) {
		return filename.substring(filename.lastIndexOf('.') + 1);
	}

	// Update the actual decorators
	function updateDecorations() {
		if (!activeEditor || !activeEditor.document) {
			return;
		}

		// Dispose decorations
		if (decorations) {
			Object.keys(decorations).forEach(key => {
				let color : Color = decorations[key];
				color.decorationType.dispose();
				delete decorations[key];
			});
		}

		const text = activeEditor.document.getText();
		let match;
		let extension = getExtension(activeEditor.document.fileName);

		if (CSS_EXT_LIST.indexOf(extension) === -1 && CODE_EXT_LIST.indexOf(extension) === -1) return;

		const addMatch = (match) => {
			console.log(match.index);
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match.value.length);
			if (!decorations[match.value]) {
				decorations[match.value] = new Color(match.value);
			}

			decorations[match.value].addOption(new vscode.Range(startPos, endPos));
		}

		while (match = COLOR_CODE_REGEX.exec(text)) {
			console.log(match);
			addMatch({
				index: match.index + match[1].length,
				value: match[3]
			});
		}
		
		if (CSS_EXT_LIST.indexOf(extension) >= 0) {
			while (match = COLOR_NAME_REGEX.exec(text)) {
				let originalMatch = match[0];
				match[0] = match[0].substring(match[0].lastIndexOf(' ') + 1);
				match.index = match.index + (originalMatch.length - match[0].length);

				addMatch({
					index: match.index,
					value: match[0]
				});
			}
		}
		
		Object.keys(decorations).forEach(key => {
			let color : Color = decorations[key];
			activeEditor.setDecorations(color.decorationType, color.decorationOptions);
		});
	}
}

