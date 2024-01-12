import { Plugin } from 'obsidian'
import { Command  } from 'obsidian';

export default class LinkMeUpPlugin extends Plugin {
	onload(): void {
		this.addCommand({
			id: "lmu-list-today",
			name: "List files created or modified today",
			callback: () => {
				// console.log("LinkMeUp: listing files...");
				// console.log("| pathToFile | ctime | mtime |");
				// console.log("| ---------- | ----- | ----- |");
				let createdFiles = [];
				let modifiedFiles = [];
				let lastMidnight = new Date().setHours(0,0,0,0);

				// Can be time consuming?
				for (var file of this.app.vault.getMarkdownFiles()) {
					// console.log("| " + file.path + " | " + file.stat.ctime + " | " + file.stat.mtime + " |");
					if (file.stat.ctime > lastMidnight) {
						createdFiles.push(file.name);
					}
					else if (file.stat.mtime > lastMidnight) {
						modifiedFiles.push(file.name);
					}
				}
			
				var activeFile = this.app.workspace.getActiveFile();

				// console.log("Files create today: ");
				let payload = "# LinkMeUp" + '\n';
				let linksToCreatedFiles = "## Files created today:" + '\n'; 
				for (var entry of createdFiles) {
					// console.log(entry)
					linksToCreatedFiles += "[[" + entry + "]]" + '\n';
				}

				let linksToModifiedFiles = "## Files modified today:" + '\n'; 
				for (var entry of modifiedFiles) {
					// console.log(entry)
					linksToModifiedFiles += "[[" + entry + "]]" + '\n';
				}

				payload += linksToCreatedFiles;
				payload += linksToModifiedFiles;

				
				if (activeFile !== null) this.app.vault.append(activeFile, payload)
				else console.log("Failed to find last active file. Try opening some file (like today's note)")

			},
		});
	}
}