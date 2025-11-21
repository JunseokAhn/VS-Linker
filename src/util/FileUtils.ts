import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
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
    showLog('determineIncludePath parent autoExtensions : ' + project.autoExtensions);
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

    // Check if active editor is available for relative path resolution
    if (!fspath) {
      const errorMsg = `VS-Linker: Cannot determine current file path for "${filename}".`;
      vscode.window.showWarningMessage(errorMsg);
      showLog(errorMsg);
      return;
    }

    // Use Node.js path module for cross-platform path handling
    // This works on Windows (C:\, \\network\), Unix (/home/), and macOS (/Users/)

    let resolvedPath: string;

    if (path.isAbsolute(filename)) {
      // Absolute path: join with project root
      // Examples: "/utils/helper.js" or "C:\utils\helper.js"
      resolvedPath = path.join(project.rootPath, filename);
      showLog('absolutePath resolved : ' + resolvedPath);
    } else {
      // Relative path: resolve from current file's directory
      // Examples: "./utils/helper.js" or "../common/config.js"
      const currentDir = path.dirname(fspath);
      resolvedPath = path.join(currentDir, filename);
      showLog('relativePath currentDir : ' + currentDir);
      showLog('relativePath resolved : ' + resolvedPath);
    }

    // Try to find the file with auto-extension resolution
    return tryResolveWithExtensions(resolvedPath, project.autoExtensions);
  }

  /**
   * Try to resolve file path with automatic extension resolution
   * @param basePath - The base path to resolve
   * @param autoExtensions - Array of extensions to try if file doesn't exist
   * @returns The resolved path if found, otherwise the original path
   */
  function tryResolveWithExtensions(basePath: string, autoExtensions?: string[]): string {
    // First, try the path as-is
    if (fs.existsSync(basePath)) {
      showLog('File found: ' + basePath);
      return basePath;
    }

    // If autoExtensions is provided, try adding each extension
    if (autoExtensions && autoExtensions.length > 0) {
      for (const ext of autoExtensions) {
        const pathWithExt = basePath + ext;
        if (fs.existsSync(pathWithExt)) {
          showLog('File found with extension: ' + pathWithExt);
          return pathWithExt;
        }
      }
    }

    // If no file found, return the original path
    // (the link will still be created but may not work)
    showLog('File not found, returning original path: ' + basePath);
    return basePath;
  }


