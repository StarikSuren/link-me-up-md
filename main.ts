import { Plugin } from 'obsidian'
import { Command  } from 'obsidian';

// date - supposed to be midnight of needed day
function getFileListToLink(from: Date, to?: Date) {
	console.log("from is: " + from);
	console.log("to: is: " + to);
	let createdFiles = [];
	let modifiedFiles = [];

	// Can be time consuming?
	for (var file of this.app.vault.getMarkdownFiles()) {
		if (to === undefined) {
			console.log("to is undefined");
			if (file.stat.ctime >= from) {
				createdFiles.push(file.name);
			}
			if (file.stat.mtime >= from) {
				modifiedFiles.push(file.name);
			}
		}
		else {
			if (file.stat.ctime >= from && file.stat.ctime <= to) {
				createdFiles.push(file.name);
			}
			if (file.stat.mtime >= from && file.stat.mtime <= to) {
				modifiedFiles.push(file.name);
			}
		}
	}

	return [createdFiles, modifiedFiles] as const;
}

function createLinks(createdFiles: any, modifiedFiles: any) {
	var activeFile = this.app.workspace.getActiveFile();
	// console.log("Files create today: ");
	let payload = "# LinkMeUp" + '\n';
	let linksToCreatedFiles = "## Files created:" + '\n'; 
	for (var entry of createdFiles) {
		// console.log(entry)
		linksToCreatedFiles += "[[" + entry + "]]" + '\n';
	}

	let linksToModifiedFiles = "## Files modified:" + '\n'; 
	for (var entry of modifiedFiles) {
		// console.log(entry)
		linksToModifiedFiles += "[[" + entry + "]]" + '\n';
	}

	payload += linksToCreatedFiles;
	payload += linksToModifiedFiles;
	
	if (activeFile !== null) this.app.vault.append(activeFile, payload)
	else console.log("Failed to find last active file. Try opening some file (like today's note)")
}

export default class LinkMeUpPlugin extends Plugin {
	onload(): void {
		this.addCommand({
			id: "lmu-list-today",
			name: "List files created or modified today",
			callback: () => {
				// console.log("LinkMeUp: listing files...");
				// console.log("| pathToFile | ctime | mtime |");
				// console.log("| ---------- | ----- | ----- |");
				let lastMidnight = new Date(); 
				lastMidnight.setHours(0,0,0,0);

				let [createdFiles,modifiedFiles] = getFileListToLink(lastMidnight);
				createLinks(createdFiles, modifiedFiles);				
			},
		});
		this.addCommand({
			id: "lmu-list-yesterday",
			name: "List files created or modified yesterday",
			callback: () => {
				let from = new Date();
				from.setDate(from.getDate() - 1);	// that's for yesterday 00:00...
				from.setHours(0,0,0,0);

				let to = new Date();				// ...that's for today's 00:00
				to.setHours(0,0,0,0);

				let [createdFiles, modifiedFiles] = getFileListToLink(from, to);
				createLinks(createdFiles, modifiedFiles);
			},
		});
	}
}