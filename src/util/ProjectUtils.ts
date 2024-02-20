
import * as vscode from 'vscode';
import { Project, SearchResult } from '../common/Interfaces';
import * as fs from 'fs-extra';
import { storagePath, filePath } from '../extension';
import { showLog } from '../util/Log';

/** 프로젝트를 파일패스에 매칭시켜서 찾았을 경우, 프로젝트리스트에 등록하고 추후 링크 매칭에서 사용
 * @returns Project path and regex stored in setting.json
 */
export function getProjects(): Project[] | undefined {
  const fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;
  if (vscode.workspace.getConfiguration('vs-linker').has('projects')) {
    const projects = <any[]>vscode.workspace.getConfiguration('vs-linker').get('projects');
    let projectList = [];
    for (let idx in projects) {
      const project = projects[idx];
      if (fsPath?.toLowerCase()?.indexOf(project.rootPath.toLowerCase()) !== -1) {
        projectList.push(project);
      }
    }
    return projectList;
    // showLog("saved project not found");
    // return undefined;
  }
}

/**
 * @param {Project} project
 * @returns regex for project stored in setting.json
 */
export function getRegex(regex: string) {
  let parts = /\/(.*)\/(.*)/.exec(regex);
  return new RegExp(parts![1], parts![2]);
}

export function doesProjectExist(storagePath: string, filePath: string) {
  //if folder not exist, create folder
  if (!fs.existsSync(storagePath)) {
    showLog('doesProjectExist : folder not exist');
    return SearchResult.folderNotFound;
  }
  //if file not exist, create file and write new project root
  if (!fs.existsSync(filePath)) {
    showLog('doesProjectExist : file not exist');
    return SearchResult.fileNotFound;
  }

  if (fs.existsSync(filePath)) {
    showLog('doesProjectExist : file exist');
    if ('[]' === fs.readFileSync(filePath).toString()) {
      showLog('doesProjectExist : file dont have protjects');
      return SearchResult.projectNotFound;
    }

    return SearchResult.projectFound;
  }
}

export function getSavedProjectByJson() {
  return JSON.parse(fs.readJSONSync(filePath));
}

export function getSavedProjectByRoot() {
  let projects = JSON.parse(fs.readJSONSync(filePath));
  let savedProjectRoot = [];
  for (const idx in projects) {
    if (projects.hasOwnProperty(idx)) {
      showLog('GetSavedProjectRoot : ' + projects[idx].root);
      savedProjectRoot.push(projects[idx].root);
    }
  }
  return savedProjectRoot;
}
