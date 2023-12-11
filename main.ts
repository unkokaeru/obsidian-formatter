import { App, Editor, MarkdownView, Modal, Plugin, Notice, PluginSettingTab, Setting } from 'obsidian';

interface ClipboardFormattingSettings {
	confirmBeforePaste: boolean;
	maxTextSize: number;
	customReplacements: Array<{ from: string, to: string }>;
}

const DEFAULT_SETTINGS: ClipboardFormattingSettings = {
	confirmBeforePaste: false,
	maxTextSize: 5000, // Default limit of 5000 characters
	customReplacements: [
		{ "from": "[Intermediate]", "to": "[Basic]" },
		{ "from": "[Advanced]", "to": "[Basic]" },
		{ "from": "# Note on ", "to": "# " },
	] // Default to an array with some example replacements
};

export default class ClipboardFormattingPlugin extends Plugin {
	settings: ClipboardFormattingSettings;

	async onload() {
		await this.loadSettings();

		// Use the capturing phase to intercept the paste event before Obsidian's default handler
		this.registerEvent(this.app.workspace.on('editor-paste', async (evt: ClipboardEvent, editor: Editor) => {
			evt.preventDefault(); // Prevent the default paste action

			const clipboardText = evt.clipboardData?.getData('text/plain');
			if (!clipboardText) {
				new Notice('No text found on the clipboard.');
				return;
			}

			if (clipboardText.length > this.settings.maxTextSize) {
				new Notice('Text is too large to format.');
				return;
			}

			const formattedText = this.formatText(clipboardText);
			const shouldPaste = this.settings.confirmBeforePaste ? await this.showConfirmationDialog() : true;

			if (shouldPaste) {
				// Insert the formatted text into the editor
				editor.replaceSelection(formattedText);
			}
		}, true)); // 'true' makes this a capturing listener

		this.addSettingTab(new ClipboardFormattingSettingTab(this.app, this));
	}

	private formatKaTeX(text: string): string {
		// Replace KaTeX patterns with MathJax equivalents
		return text
			.replace(/\\\( (.*?) \\\)/g, (match, p1) => `$${p1}$`)       // Replaces \( ... \) with $...$
			.replace(/\\\[ (.*?) \\\]/g, (match, p1) => `$$${p1}$$`)    // Replaces \[ ... \] with $$...$$
			.replace(/\\\((.*?)\\\)/g, (match, p1) => `$${p1}$`)       // Replaces \(...\) with $...$
			.replace(/\\\[(.*?)\\\]/g, (match, p1) => `$$${p1}$$`);    // Replaces \[...\] with $$...$$
	}

	private formatText(text: string): string {
		let formattedText = this.formatKaTeX(text);

		// Apply custom replacements
		this.settings.customReplacements.forEach(replacement => {
			// Ensure the 'from' string is treated as a literal string in the regex
			const safeFrom = replacement.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			const regex = new RegExp(safeFrom, 'g');
			formattedText = formattedText.replace(regex, replacement.to);
		});

		return formattedText;
	}

	private async showConfirmationDialog(): Promise<boolean> {
		return new Promise((resolve) => {
			const modal = new Modal(this.app);
			modal.contentEl.createEl('p', { text: 'Do you want to paste the formatted text?' });

			modal.contentEl.createEl('button', { text: 'Yes' }, (button) => {
				button.onclick = () => {
					modal.close();
					resolve(true);
				};
			});

			modal.contentEl.createEl('button', { text: 'No' }, (button) => {
				button.onclick = () => {
					modal.close();
					resolve(false);
				};
			});

			modal.open();
		});
	}

	onunload() {
		// Clean up, if necessary
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ClipboardFormattingSettingTab extends PluginSettingTab {
	plugin: ClipboardFormattingPlugin;

	constructor(app: App, plugin: ClipboardFormattingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Confirm before pasting')
			.setDesc('Enable a confirmation prompt before pasting formatted text.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.confirmBeforePaste)
				.onChange(async (value) => {
					this.plugin.settings.confirmBeforePaste = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Maximum Text Size')
			.setDesc('Maximum size of text (in characters) that can be pasted and formatted.')
			.addText(text => text
				.setPlaceholder('Enter a number')
				.setValue(this.plugin.settings.maxTextSize.toString())
				.onChange(async (value) => {
					const parsed = parseInt(value, 10);
					this.plugin.settings.maxTextSize = isNaN(parsed) ? DEFAULT_SETTINGS.maxTextSize : parsed;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Custom Text Replacements')
			.setDesc('Define custom text replacements.')
			.addTextArea(text => text
				.setValue(JSON.stringify(this.plugin.settings.customReplacements))
				.onChange(async (value) => {
					try {
						this.plugin.settings.customReplacements = JSON.parse(value);
					} catch (e) {
						new Notice('Invalid JSON format for custom replacements.');
					}
					await this.plugin.saveSettings();
				}));
	}
}
