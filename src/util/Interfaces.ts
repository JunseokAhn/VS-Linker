import * as vscode from 'vscode';

export enum SearchResult {
    folderNotFound, fileNotFound, projectNotFound, projectFound
}

export enum MethodType {
    function,
    sub
}

export interface File {
    filePath: string;
    includes: Include[];
    methods: Method[];
}

export interface Include extends IncludeBasic {
    range: vscode.Range;
}

export interface IncludeBasic {
    linkType: string;
    filename: string;
    includePath: string;   
    rangeInput: RangeInput;
}

export interface Method extends MethodBasic {
    range: vscode.Range;
    filePath: string;
}

export interface MethodBasic {
    name: string;
    methodType: MethodType;
    params?: string[];
    rangeInput: RangeInput;
}

export interface RangeInput {
    offset: number;
    text: string;
}
