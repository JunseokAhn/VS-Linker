import * as vscode from 'vscode';
import { LinkerContext } from '../util/LinkerContext';

//Provides the `CTRL+Click` links for Include files
export class DocumentLinkProvider implements vscode.DocumentLinkProvider {
    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
        return new Promise((resolve, reject) => {
            const file = LinkerContext.getOrCreateFile(document);
            let includes = file.includes;
            if (includes.length === 0) { 
                return reject(); 
            }

            let links = includes.map(x => 
                new vscode.DocumentLink(x.range, vscode.Uri.file(x.includePath))
            );

            resolve(links);
        });
    }
}