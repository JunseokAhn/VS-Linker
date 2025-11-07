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
    if (projects === undefined || projects.length === 0) {
      showLog('VS-Linker: No matching project configuration found for this file.');
      showLog(`Current file: ${filePath}`);
      showLog('Please check your vs-linker.projects settings.');
      return null;
    }
    projects.forEach((project)=>{

      const regexs: string[] = project.regularExpress;
      //Read regularExpress and find includePath
      regexs.forEach((r)=>{
        let regex: RegExp;
        try {
          regex = getRegex(r);
        } catch (error) {
          // 정규식 파싱 실패 시 이미 getRegex에서 에러 메시지 표시됨
          showLog(`Skipping invalid regex: ${r}`);
          return; // 이 정규식은 건너뛰고 다음으로
        }

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
      const errorMsg = `VS-Linker: Cannot determine root directory for file "${path.basename(filePath)}". Please check the file path format.`;
      vscode.window.showWarningMessage(errorMsg);
      showLog(errorMsg);
      showLog(`Full path: ${filePath}`);
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


