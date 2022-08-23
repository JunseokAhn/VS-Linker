import * as path from "path";
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { getProject, getRegex, getSavedProjectByRoot } from './ProjectManager';
import { filePath } from "../extension";
import { IncludeBasic } from "../util/Interfaces";
import { showLog } from "../util/Log";


export class Parser {
    
    constructor(
        private filePath: string,
        private content: string,
        private workspacePath: string) { }

    /**
     * @listens onDidChangeTextDocument
     * @returns Link info (filename, includePath, targetTextRange)
     */
    findIncludes(): IncludeBasic[] | null {
        const project = getProject();
        if (project === undefined){
            return null;
        }
        let regex = getRegex(project);
        let m, text = '', includePath, includes: IncludeBasic[] = [];
        while ((m = regex.exec(this.content)) !== null && m.groups) {
            text = m[0];
            includePath = this.determineIncludePath(m.groups.filename);
            showLog("findIncludes.text : " + m[0]);
            showLog("findIncludes.incloudePath : " + includePath);
            if (!includePath) { continue; }
            includes.push({
                filename: m.groups.filename,
                includePath: includePath,
                rangeInput: {
                    offset: this.content.indexOf(text),
                    text: text,
                }
            });
        };
        return includes;
    }

    /**
     * @listen  Parser.findIncludes
     * @desc    Separate and return relative and absolute path
     * @returns includePath
     */
    determineIncludePath(filename: string): string | undefined {

        const fspath = vscode.window.activeTextEditor?.document.uri.fsPath;
        showLog("determineIncludePath  : " +this.filePath);
        showLog("determineIncludePath filename : "+ filename);
        showLog("determineIncludePath workspacePath : " + this.workspacePath);
        showLog("determineIncludePath workspaceFolders : " + vscode.workspace.workspaceFolders);
        showLog("determineIncludePath workspaceFolders[0].fsPath : " + vscode.workspace.workspaceFolders![0].uri.fsPath);
        showLog("determineIncludePath workspaceFolders[0].path : " + vscode.workspace.workspaceFolders![0].uri.path);
        showLog("determineIncludePath document.path : " + vscode.window.activeTextEditor?.document.uri.path);
        showLog("determineIncludePath fspath : " + fspath);

        
        //rootDir = volume driver or network location
        //ex) "c:", "\\192.168.1.92"...
        const findRootRegex = /^(.+?)(\b\:)|^(.+?)(?=\b\\)/g;
        let rootDir = this.filePath.match(findRootRegex)?.toString();

        if(rootDir === undefined){
            vscode.window.showInformationMessage('Asp Linker : I cant find a root directory!');
            showLog("VS-Linker : I cant find a root directory!");
            return;
        }
        showLog("determineIncludePath rootDir : " + rootDir);
        
        //RelativePath matching
        if(!filename.startsWith("/")){
            const relativePathRegex = /(.*)(?=\\)/g;
            
            rootDir = fspath!.match(relativePathRegex)?.toString();
            if(rootDir?.endsWith(",")){
                rootDir = rootDir.slice(0, -1);
            }

            showLog("relativePath "+ rootDir);
            showLog("relativePath return : " + path.join(rootDir!, filename));
            return path.join(rootDir!, filename);
        }


        //AbsolutePath matching
        if(filename.startsWith("/")){
             //If there is a project matching the project root in the workspace, link based on that root
            for(let i =0; i<vscode.workspace.workspaceFolders?.length!; i++){
                if(this.filePath.indexOf(vscode.workspace.workspaceFolders![i].uri.fsPath) !== -1){
                    rootDir = vscode.workspace.workspaceFolders![i].uri.fsPath;
                    showLog("workspace root found");
                };
            }
            let projects = JSON.parse(fs.readJSONSync(filePath));
            showLog("determineIncluePath read project "+projects.toString());
            
            const project = getProject();
            if(project === undefined){
                return ;
            }
            rootDir = project.rootPath;

            showLog("determineIncludePath ROOT DIR : " + rootDir);
            showLog("determineIncludePath return : " + path.join(rootDir!, filename));
            return path.join(rootDir!, filename);
        }
    }

}
