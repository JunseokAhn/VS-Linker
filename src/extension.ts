import * as vscode from 'vscode';
import { DocumentLinkProvider } from './common/DocumentLinkProvider';
import { FileLinkService } from './service/FileLinkService';
import { showLog } from './util/Log';

export let storagePath: string;
export let filePath: string;
export let isDebug: boolean;
export let output: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {

  let service : FileLinkService;
  init();

  function init(){
    output = vscode.window.createOutputChannel('VS-Linker');
    service = new FileLinkService();
    setGlobalValue();
    addEventHandler();
    showLog('extension globalStorageUri : ' + context.globalStorageUri.fsPath);
    showLog('extension extensionUri' + context.extensionUri);
  }

  function setGlobalValue(){
    storagePath = context.globalStorageUri.fsPath;
    filePath = storagePath + '\\projects.json';
    isDebug = true;
  }

  function addEventHandler(){

      vscode.workspace.onDidChangeTextDocument((evt) => service.getOrCreateFile(evt.document));

      vscode.workspace.onDidDeleteFiles((evt) =>
      service.unregisterFile(evt.files.map((u) => u.path)));

      context.subscriptions.push(
        vscode.languages.registerDocumentLinkProvider({ scheme: 'file' }, new DocumentLinkProvider(service)));
  }


  /**
   * @TODO project registration and deletion from command
   */
  // const saveProjectRootCommand = vscode.commands.registerCommand(CommandProvider.saveProjectRootCommandId, CommandProvider.saveProjectRoot);
  // const deleteProjectRootCommand = vscode.commands.registerCommand(CommandProvider.deleteProjectRootCommandId, CommandProvider.deleteProjectRoot);

  // context.subscriptions.push(saveProjectRootCommand, deleteProjectRootCommand);
}

// export function deactivate() {}
