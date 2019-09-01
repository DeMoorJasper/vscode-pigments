[![Build Status](https://dev.azure.com/DeMoorJasper/parcel-plugin-imagemin/_apis/build/status/DeMoorJasper.vscode-pigments?branchName=master)](https://dev.azure.com/DeMoorJasper/parcel-plugin-imagemin/_build/latest?definitionId=5&branchName=master)

[Rate this on vscode marketplace](https://marketplace.visualstudio.com/items?itemName=jaspernorth.vscode-pigments) | [View on github](https://github.com/DeMoorJasper/vscode-pigments)

# Pigments for VSCode

Adds Snazzy looking `color` previews to vscode instantly.

![preview](preview.jpg)

## Configuration

You can configure this plugin under the `pigments` key.

### `pigments.markerType`

markerType defines how to display the colors in the extension.

Possible options are: `background` and `outline`.

### `pigments.enabledExtensions`

enabledExtensions defines which file extensions this plugin should apply to. This should be a comma seperated list of extensions, see the example below.

Example: `css, sass, jsx`

### `pigments.disabledExtensions`

disabledExtensions defines which file extensions this plugin should ignore, this overwrites any value provided in `pigments.enabledExtensions` including the defaults. This should be a comma seperated list of extensions, see the example below.

Example: `css, sass, jsx`
