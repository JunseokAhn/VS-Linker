import * as vscode from 'vscode';
import * as path from 'path';
import fs = require('fs-extra');
import { storagePath, filePath} from '../extension';
import { showLog } from '../util/Log';
import { Project, SearchResult } from '../util/Interfaces';

export class ProjectManager {

	static readonly saveProjectRootCommandId = 'VS-Linker.saveProjectRoot';
	static readonly deleteProjectRootCommandId = 'VS-Linker.deleteProjectRoot';

	//Save the project root directory from dialog
	static saveProjectRoot() {
		const options: vscode.OpenDialogOptions = {
			canSelectMany: false,
			openLabel: 'Select',
			canSelectFiles: false,
			canSelectFolders: true
		};

		vscode.window.showOpenDialog(options).then(fileUri => {
			if (fileUri && fileUri[0]) {

				let selected = path.normalize(fileUri[0].fsPath);

				showLog("showOpenDialog save root : " + filePath);
				showLog("showOpenDialog selected folder : " + selected.toString());

				//if folder not exist, create folder
				if(doesProjectExist(storagePath, filePath) === SearchResult.folderNotFound){
					fs.mkdirSync(storagePath);
				}
				//if file not exist, create file and write new project root
				if(doesProjectExist(storagePath, filePath) === SearchResult.fileNotFound){
					fs.writeJSONSync(filePath, JSON.stringify([{root: selected}]));
					return;
				}
				// if savedProject not exist, write new project root
				if(doesProjectExist(storagePath, filePath) === SearchResult.projectNotFound){
					fs.writeJSONSync(filePath, JSON.stringify([{root: selected}]));
					return;
				}
				//if savedProject exist, append new project root
				if(doesProjectExist(storagePath, filePath) === SearchResult.projectFound){

					//Read saved project location
					let savedProjects = JSON.parse(fs.readJSONSync(filePath));
					showLog("showOpenDialog savedProjects : " + savedProjects) ;

					//if the selected project is already saved, escape
					for(const idx in savedProjects){
						if(savedProjects[idx].root === selected){
							showLog("root exist");
							return;
						}
					}

					//Write a new data
					let newProject = getSavedProjectByJson();
					newProject.push({root: selected});
					fs.writeJSONSync(filePath, JSON.stringify(newProject));

				}
			}
		});
	}


	//Delete the project root directory from saved json file
	static deleteProjectRoot() {

		//Read saved projects all
		const savedProjects = getSavedProjectByRoot();

		//Select a project root to delete from JSON file.
		vscode.window.showQuickPick(savedProjects)
		.then(selected => {
			if(selected){
				//Delete selected project root from JSON file
				let newProjects = getSavedProjectByJson();
				newProjects = newProjects.filter((project: { root: any; }) => project.root !== selected);

				//Write JSON file in your Extension folder
				fs.writeJSONSync(filePath, JSON.stringify(newProjects));
			}
		});
	}

}

export function doesProjectExist(storagePath:string, filePath:string) {

	//if folder not exist, create folder
	if (!fs.existsSync(storagePath)){
		showLog("doesProjectExist : folder not exist") ;
		return SearchResult.folderNotFound;
	}
	//if file not exist, create file and write new project root
	if (!fs.existsSync(filePath)){
		showLog("doesProjectExist : file not exist") ;
		return SearchResult.fileNotFound;
	}

	if (fs.existsSync(filePath)){
		showLog("doesProjectExist : file exist") ;
		if("[]" === fs.readFileSync(filePath).toString()){
			showLog("doesProjectExist : file dont have protjects") ;
			return SearchResult.projectNotFound;
		}

		return SearchResult.projectFound;
	}
}

export function getSavedProjectByJson(){
	return JSON.parse(fs.readJSONSync(filePath));
}

export function getSavedProjectByRoot(){
	let projects = JSON.parse(fs.readJSONSync(filePath));
	let savedProjectRoot = [];
	for(const idx in projects){
		if(projects.hasOwnProperty(idx)){
			showLog("GetSavedProjectRoot : "+projects[idx].root) ;
			savedProjectRoot.push(projects[idx].root);
		}
	}
	return savedProjectRoot;
}

/**
 * @returns Project path and regex stored in setting.json
 */
export function getProject() : Project[] | undefined {
	const fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;
	if(vscode.workspace.getConfiguration("vs-linker").has("projects")){
		const projects = <any[]>vscode.workspace.getConfiguration("vs-linker").get("projects");
		let projectList = [];
		for(let idx in projects){
			const project = projects[idx];
			if(fsPath?.toLowerCase()?.indexOf(project.rootPath.toLowerCase()) !== -1){
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
export function getRegex(regex : string){

	let parts = /\/(.*)\/(.*)/.exec(regex);
	return new RegExp(parts![1], parts![2]);

}