import * as path from "path";
import * as vscode from 'vscode';
import { getProject, getRegex } from './ProjectManager';
import { IncludeBasic, Project } from "../util/Interfaces";
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
        let m, text = '', includePath, includes: IncludeBasic[] = [];

        //Read projectRootPath, regularExpressList
        const projectList = getProject();
        if (projectList === undefined){
            return null;
        }

        for(let idx=0; idx<projectList.length; idx++){
            let project:Project = projectList[idx];
            let regexList:string[] = project.regularExpress;

            //Read regularExpress and find includePath
            for(let idx=0; idx<regexList.length; idx++){

                let regex = getRegex(regexList[idx]);
                while ((m = regex.exec(this.content)) !== null && m.groups) {
                    text = m[0];
                    includePath = this.determineIncludePath(m.groups.filename, project);
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
            }

        }

        return includes;
    }

    /**
     * @listen  Parser.findIncludes
     * @desc    Separate and return relative and absolute path
     * @returns includePath
     */
    determineIncludePath(filename: string, project: Project): string | undefined {

        const fspath = vscode.window.activeTextEditor?.document.uri.fsPath;
        showLog("determineIncludePath  : " +this.filePath);
        showLog("determineIncludePath parent filename : "+ filename);
        showLog("determineIncludePath parent rootPath : "+ project.rootPath);
        showLog("determineIncludePath parent regularExpress : "+ project.regularExpress);
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

            rootDir = project.rootPath;

            showLog("determineIncludePath ROOT DIR : " + rootDir);
            showLog("determineIncludePath return : " + path.join(rootDir!, filename));
            return path.join(rootDir!, filename);
        }
    }

}
