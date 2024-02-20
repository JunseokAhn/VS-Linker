import * as vscode from 'vscode';
import { FileLinkService } from '../service/FileLinkService';

export class DocumentLinkProvider implements vscode.DocumentLinkProvider {

  constructor(private fileLinker:FileLinkService){}

  provideDocumentLinks( document: vscode.TextDocument, token: vscode.CancellationToken)
    : vscode.ProviderResult<vscode.DocumentLink[]> {
    return new Promise((resolve, reject) => {
      const file = this.fileLinker.getOrCreateFile(document);
      let includes = file.includes;
      if (includes.length === 0) {
        return reject();
      }

      let links = includes.map(
        (x) => new vscode.DocumentLink(x.range, vscode.Uri.file(x.includePath))
      );

      resolve(links);
    });
  }
}
