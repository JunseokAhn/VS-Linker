import * as vscode from 'vscode';
import { DocumentLinkProvider } from './service/DocumentLinkProvider';
import { LinkerContext } from './util/LinkerContext';
import { ProjectManager } from './service/ProjectManager';
import { showLog } from './util/Log';

export let storagePath : string;
export let filePath : string;
export let isDebug : boolean;
 
export function activate(context: vscode.ExtensionContext) {
	
	storagePath = context.globalStorageUri.fsPath;
	filePath = storagePath + '\\projects.json';
	// isDebug = true;
	isDebug = false;

	showLog('Congratulations, your extension "VS-Linker" is now active!');
	showLog("extension globalStorageUri : " +  context.globalStorageUri.fsPath);
	showLog("extension extensionUri" + context.extensionUri);

    function register(doc: vscode.TextDocument) {
        if (LINKER_SELECTORS.find(s => s.language === doc.languageId) === undefined) { return; }
        LinkerContext.getOrCreateFile(doc);
    }
	
	const LINKER_SELECTORS = Array<vscode.DocumentFilter>(
		{
			language: "asp",
			scheme: "file",
			pattern: "**/*.{asp,inc}"
		},
		{
			language: "vbs",
			scheme: "file",
			pattern: "**/*.{asp,inc}"
		}
	);
	
    vscode.workspace.onDidChangeTextDocument(evt => register(evt.document));
    vscode.workspace.onDidDeleteFiles(evt => LinkerContext.unregisterFile(evt.files.map(u => u.path)));

    context.subscriptions.push(vscode.languages.registerDocumentLinkProvider(
        LINKER_SELECTORS, new DocumentLinkProvider()
    ));


    const saveProjectRootCommand = vscode.commands.registerCommand(ProjectManager.saveProjectRootCommandId, ProjectManager.saveProjectRoot);
    const deleteProjectRootCommand = vscode.commands.registerCommand(ProjectManager.deleteProjectRootCommandId, ProjectManager.deleteProjectRoot);
	
	context.subscriptions.push(saveProjectRootCommand, deleteProjectRootCommand);
}

export function deactivate() {}

