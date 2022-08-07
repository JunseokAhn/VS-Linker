import * as vscode from 'vscode';

import { File, Include, IncludeBasic, MethodBasic, Method } from "./Interfaces";
import { Parser } from "../service/Parser";
import { RangeHelper } from './RangeHelper';
import { showLog } from './Log';

export class LinkerContext {
    
    private static _files: File[] = [];
    private static  _fileLookup: { [filePath: string]: File } = Object.create(null);

    public static registerFile(file: File) {
        if (this._fileLookup[file.filePath]) {
            this._files.splice(this._files.indexOf(this._fileLookup[file.filePath]), 1, file);
        } else {   
            this._files.push(file);
        }
        this._fileLookup[file.filePath] = file;

        if (file.includes.length > 0) {
            file.includes.forEach(f => this.loadIncludeIfNeeded(f.includePath));
        }
    }

    static loadIncludeIfNeeded(includePath: string): void {
        if (this._fileLookup[includePath]) { return; }

        vscode.workspace.openTextDocument(includePath).then(
            document => this.getOrCreateFile(document),
        );

    }

    public static unregisterFile(filePaths: string[]) {

        filePaths.forEach(filePath => {
            if (this._fileLookup[filePath]) { 

                const ix = this._files.indexOf(this._fileLookup[filePath]);
                delete this._fileLookup[filePath];
                this._files.splice(ix, 1);
            }
        });
    }

    static get(filePath: string) : File | undefined {
        if (this._fileLookup[filePath]) { return this._fileLookup[filePath]; }
    }

    public static getOrCreateFile(document: vscode.TextDocument) : File {
        const filePath = document.uri.fsPath;
        showLog("getOrCreateFile.filePath : " + filePath);
        if (this._fileLookup[filePath]) {
            return this._fileLookup[filePath];
        }

        function buildInclude(basic: IncludeBasic, document: vscode.TextDocument) : Include {
            return <Include> { 
                includePath: basic.includePath,
                filename: basic.filename,
                linkType: basic.linkType,
                rangeInput: basic.rangeInput,
                range: RangeHelper.create(document, basic.rangeInput)
            };
        }

        function buildMethod(basic: MethodBasic, document: vscode.TextDocument) : Method {
            return <Method> { 
                name: basic.name,
                methodType: basic.methodType,
                params: basic.params,
                rangeInput: basic.rangeInput,
                range: RangeHelper.create(document, basic.rangeInput),
                filePath: filePath
            };
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        const workspacePath =  workspaceFolder?.uri.fsPath;
        
        let parser = new Parser(filePath, document.getText(), workspacePath!);
        const file: File = {
            filePath: filePath,
            includes: parser.findIncludes().map(i => buildInclude(i, document)),
            methods: parser.findMethods().map(i => buildMethod(i, document))
        };
        this.registerFile(file);
        return file;
    }
}

