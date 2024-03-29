import * as vscode from 'vscode';
import * as path from 'path';
// import fs = require('fs-extra');
import * as fs from 'fs-extra';
import { storagePath, filePath } from '../extension';
import { showLog } from '../util/Log';
import { Project, SearchResult } from './Interfaces';
import { doesProjectExist,getSavedProjectByJson, getSavedProjectByRoot } from '../util/ProjectUtils'



export class CommandProvider {
  static readonly saveProjectRootCommandId = 'VS-Linker.saveProjectRoot';
  static readonly deleteProjectRootCommandId = 'VS-Linker.deleteProjectRoot';

  //Save the project root directory from dialog
  public static saveProjectRoot() {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: 'Select',
      canSelectFiles: false,
      canSelectFolders: true
    };

    vscode.window.showOpenDialog(options).then((fileUri) => {
      if (fileUri && fileUri[0]) {
        let selected = path.normalize(fileUri[0].fsPath);

        showLog('showOpenDialog save root : ' + filePath);
        showLog('showOpenDialog selected folder : ' + selected.toString());

        //if folder not exist, create folder
        if (doesProjectExist(storagePath, filePath) === SearchResult.folderNotFound) {
          fs.mkdirSync(storagePath);
        }
        //if file not exist, create file and write new project root
        if (doesProjectExist(storagePath, filePath) === SearchResult.fileNotFound) {
          fs.writeJSONSync(filePath, JSON.stringify([{ root: selected }]));
          return;
        }
        // if savedProject not exist, write new project root
        if (doesProjectExist(storagePath, filePath) === SearchResult.projectNotFound) {
          fs.writeJSONSync(filePath, JSON.stringify([{ root: selected }]));
          return;
        }
        //if savedProject exist, append new project root
        if (doesProjectExist(storagePath, filePath) === SearchResult.projectFound) {
          //Read saved project location
          let savedProjects = JSON.parse(fs.readJSONSync(filePath));
          showLog('showOpenDialog savedProjects : ' + savedProjects);

          //if the selected project is already saved, escape
          for (const idx in savedProjects) {
            if (savedProjects[idx].root === selected) {
              showLog('root exist');
              return;
            }
          }

          //Write a new data
          let newProject = getSavedProjectByJson();
          newProject.push({ root: selected });
          fs.writeJSONSync(filePath, JSON.stringify(newProject));
        }
      }
    });
  }

  //Delete the project root directory from saved json file
  public static deleteProjectRoot() {
    //Read saved projects all
    const savedProjects = getSavedProjectByRoot();

    //Select a project root to delete from JSON file.
    vscode.window.showQuickPick(savedProjects).then((selected) => {
      if (selected) {
        //Delete selected project root from JSON file
        let newProjects = getSavedProjectByJson();
        newProjects = newProjects.filter((project: { root: any }) => project.root !== selected);

        //Write JSON file in your Extension folder
        fs.writeJSONSync(filePath, JSON.stringify(newProjects));
      }
    });
  }
}

