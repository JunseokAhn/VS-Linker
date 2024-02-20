import * as vscode from 'vscode';

import { File, Include, IncludeBasic } from '../common/Interfaces';
import { showLog } from '../util/Log';
import { getLinkRange, findIncludes } from '../util/FileUtils';
import { output } from '../extension';

export class FileLinkService {

  private _files: File[]
  private _fileLookup: { [filePath: string]: File }
  // private fileUtils : FileUtils
  constructor(){
    this._files = [];
    this._fileLookup = Object.create(null);
    // this.fileUtils = new FileUtils();
  }

  private registerFile(file: File) {
    if (this._fileLookup[file.filePath]) {
      this._files.splice(this._files.indexOf(this._fileLookup[file.filePath]), 1, file);
    } else {
      this._files.push(file);
    }
    this._fileLookup[file.filePath] = file;

    if (file.includes.length > 0) {
      file.includes.forEach((f) => this.loadIncludeIfNeeded(f.includePath));
    }
  }

  private loadIncludeIfNeeded(includePath: string): void {
    if (this._fileLookup[includePath]) {
      return;
    }

    vscode.workspace
      .openTextDocument(includePath)
      .then((document) => this.getOrCreateFile(document));
  }

  public unregisterFile(filePaths: string[]) {
    filePaths.forEach((filePath) => {
      if (this._fileLookup[filePath]) {
        const ix = this._files.indexOf(this._fileLookup[filePath]);
        delete this._fileLookup[filePath];
        this._files.splice(ix, 1);
      }
    });
  }

  // get(filePath: string): File | undefined {
  //   if (this._fileLookup[filePath]) {
  //     return this._fileLookup[filePath];
  //   }
  // }

  public getOrCreateFile(document: vscode.TextDocument): File {
    const filePath = document.uri.fsPath;
    showLog('getOrCreateFile.filePath : ' + filePath);
    if (this._fileLookup[filePath]) {
      return this._fileLookup[filePath];
    }

    const buildInclude = (basic: IncludeBasic, document: vscode.TextDocument): Include => {
      return <Include>{
        includePath: basic.includePath,
        filename: basic.filename,
        rangeInput: basic.rangeInput,
        range: getLinkRange(document, basic.rangeInput)
      };
    }

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const workspacePath = workspaceFolder?.uri.fsPath;


    const file: File = {
      filePath: filePath,
      includes: findIncludes(filePath, document.getText(), workspacePath!)!
                  .map((i) => buildInclude(i, document))
    };
    output.appendLine(`[LINK] ${file.filePath}`);
    this.registerFile(file);
    return file;
  }
}
