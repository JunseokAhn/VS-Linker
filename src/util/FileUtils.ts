import * as vscode from 'vscode';
import * as path from 'path';
import { RangeInput } from '../common/Interfaces';
import { IncludeBasic, Project } from '../common/Interfaces';
import { getProjects, getRegex } from './ProjectUtils';
import { showLog } from '../util/Log';
import { output } from '../extension';

  export function getLinkRange(document: vscode.TextDocument, input: RangeInput): vscode.Range {
    let start = document.positionAt(input.offset);
    return new vscode.Range(
      start,
      new vscode.Position(start.line, start.character + input.text.length)
    );
  }


  export function findIncludes(filePath: string, content: string, workspacePath: string): IncludeBasic[] | null {
    let m,
      text = '',
      includePath,
      includes: IncludeBasic[] = [];

    //Read projectRootPath, regularExpressList
    const projects = getProjects();
    if (projects === undefined) {
      return null;
    }
    projects.forEach((project)=>{

      const regexs: string[] = project.regularExpress;
      //Read regularExpress and find includePath
      regexs.forEach((r)=>{
        const regex= getRegex(r);
        while ((m = regex.exec(content)) !== null && m.groups) {
          text = m[0];
          includePath = determineIncludePath(m.groups.filename, project, filePath, workspacePath);
          showLog('findIncludes.text : ' + m[0]);
          showLog('findIncludes.incloudePath : ' + includePath);
          if (!includePath) {
            continue;
          }
          includes.push({
            filename: m.groups.filename,
            includePath: includePath,
            rangeInput: {
              offset: content.indexOf(text),
              text: text
            }
          });

          output.appendLine(
            `[PROJECT ${project.rootPath}] TARGET TEXT : ${text}\n :: [REGEX] ${regex}\n :: [FOUND FILENAME] : ${m.groups.filename}`
          );
        }
      })

    })

    return includes;
  }

  /**
   * @listen  Parser.findIncludes
   * @desc    Separate and return relative and absolute path
   * @returns includePath
   */
  export function determineIncludePath(filename: string, project: Project, filePath: string, workspacePath: string): string | undefined {
    const fspath = vscode.window.activeTextEditor?.document.uri.fsPath;
    showLog('determineIncludePath  : ' + filePath);
    showLog('determineIncludePath parent filename : ' + filename);
    showLog('determineIncludePath parent rootPath : ' + project.rootPath);
    showLog('determineIncludePath parent regularExpress : ' + project.regularExpress);
    showLog('determineIncludePath workspacePath : ' + workspacePath);
    showLog('determineIncludePath workspaceFolders : ' + vscode.workspace.workspaceFolders);
    showLog(
      'determineIncludePath workspaceFolders[0].fsPath : ' +
        vscode.workspace.workspaceFolders![0].uri.fsPath
    );
    showLog(
      'determineIncludePath workspaceFolders[0].path : ' +
        vscode.workspace.workspaceFolders![0].uri.path
    );
    showLog(
      'determineIncludePath document.path : ' + vscode.window.activeTextEditor?.document.uri.path
    );
    showLog('determineIncludePath fspath : ' + fspath);

    //rootDir = volume driver or network location
    //ex) "c:", "\\192.168.1.92"...

    const findRootRegex = /^(.+?)(\b\:)|^(.+?)(?=\b\\)/g;
    let rootDir = filePath.match(findRootRegex)?.toString();

    if (rootDir === undefined) {
      vscode.window.showInformationMessage('Asp Linker : I cant find a root directory!');
      showLog('VS-Linker : I cant find a root directory!');
      return;
    }
    showLog('determineIncludePath rootDir : ' + rootDir);

    //RelativePath matching
    if (filename.startsWith('/')==false) {
      const relativePathRegex = /(.*)(?=\\)/g;

      rootDir = fspath!.match(relativePathRegex)?.toString();
      if (rootDir?.endsWith(',')) {
        rootDir = rootDir.slice(0, -1);
      }

      showLog('relativePath ' + rootDir);
      showLog('relativePath return : ' + path.join(rootDir!, filename));
      return path.join(rootDir!, filename);
    }

    //AbsolutePath matching
    if (filename.startsWith('/')==true) {
      rootDir = project.rootPath;

      showLog('determineIncludePath ROOT DIR : ' + rootDir);
      showLog('determineIncludePath return : ' + path.join(rootDir!, filename));
      return path.join(rootDir!, filename);
    }
  }


