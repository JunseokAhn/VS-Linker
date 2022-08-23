import * as vscode from 'vscode';

export enum SearchResult {
    folderNotFound, fileNotFound, projectNotFound, projectFound
}

export interface Project {
	rootPath : string;
	regularExpress : string;
}

export interface File {
    filePath: string;
    includes: Include[];
}

export interface Include extends IncludeBasic {
    range: vscode.Range;
}

export interface IncludeBasic {
    filename: string;
    includePath: string;   
    rangeInput: RangeInput;
}


export interface RangeInput {
    offset: number;
    text: string;
}
