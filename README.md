# Clipboard Formatting Plugin for Obsidian

This plugin for [Obsidian](https://obsidian.md) enhances the experience of pasting text from external sources into Obsidian by automatically converting KaTeX mathematical expressions to MathJax, ensuring better compatibility with Obsidian's Markdown renderer.

## Features

- **Automatic Conversion**: Converts KaTeX syntax to MathJax on paste.
- **Custom Text Replacements**: Allows for configuring custom text replacement rules. Users can define their own pairs of 'from' and 'to' strings for additional text transformations on paste.
- **Settings Toggle**: Option to prompt for confirmation before pasting formatted text.
- **Character Limit**: Configurable maximum character limit for the text to be formatted.

## Installation

1. Download the latest release from the GitHub repository.
2. Extract the files from the zip to your Obsidian vault's plugins folder: `.obsidian/plugins/clipboard-formatting-plugin`.
3. Reload Obsidian.
4. Go to `Settings` > `Community Plugins` and make sure 'Clipboard Formatting Plugin' is enabled.

## Usage

Once installed and enabled, the plugin will automatically intercept text pasted from the clipboard and format it according to the rules set for converting KaTeX to MathJax. If the confirmation prompt is enabled in the settings, a dialog will ask for confirmation before the formatted text is inserted.

## Settings

The plugin includes settings to toggle the confirmation prompt and to set the maximum size of text that can be formatted. To access the settings:

1. Open `Settings` in Obsidian.
2. Go to `Plugin Options`.
3. Find 'Clipboard Formatting Plugin' and customize the options as needed.

## Development

If you're interested in contributing to the plugin or would like to build it from source, here are the steps to get started:

1. Clone the repository to your local machine.
2. Navigate to the cloned directory.
3. Run `npm install` to install dependencies.
4. Make your changes to the TypeScript source files.
5. Build the plugin using `npm run dev` or `npm run build`.
6. Copy the compiled files into your Obsidian vault's plugin folder for testing.

## Support

If you encounter any issues or have feature suggestions, please open an issue on the GitHub repository.

## Contributing

Contributions to the project are welcome! Please read the contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Obsidian.md team for creating such a powerful tool and providing the plugin API.
- Special thanks to the community for their continuous support and contributions.