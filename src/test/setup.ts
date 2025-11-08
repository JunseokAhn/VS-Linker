// Mock vscode module for unit tests
const vscode = {
  window: {
    showErrorMessage: () => Promise.resolve(),
    showWarningMessage: () => Promise.resolve(),
    showInformationMessage: () => Promise.resolve(),
    createOutputChannel: () => ({
      appendLine: () => {},
      clear: () => {},
      show: () => {}
    }),
    createWebviewPanel: () => ({
      webview: { html: '' }
    }),
    showQuickPick: () => Promise.resolve(undefined),
    showInputBox: () => Promise.resolve(undefined),
    activeTextEditor: {
      document: {
        uri: {
          fsPath: 'C:\\Project\\src\\components\\file.js'
        }
      }
    }
  },
  workspace: {
    getConfiguration: () => ({
      get: () => []
    }),
    workspaceFolders: [{
      uri: {
        fsPath: 'C:\\Project',
        path: '/Project'
      },
      name: 'Project',
      index: 0
    }]
  },
  commands: {
    getCommands: () => Promise.resolve([
      'vs-linker.addPreset',
      'vs-linker.showPresets',
      'vs-linker.validateConfig'
    ])
  },
  extensions: {
    getExtension: (id: string) => {
      if (id === 'JunseokAhn.vs-linker') {
        return {
          id: 'JunseokAhn.vs-linker',
          isActive: true,
          extensionPath: '/path/to/extension',
          activate: () => Promise.resolve(),
          packageJSON: {
            name: 'vs-linker',
            publisher: 'JunseokAhn',
            version: '1.1.8',
            contributes: {
              commands: [
                { command: 'vs-linker.addPreset', title: 'Add Preset' },
                { command: 'vs-linker.showPresets', title: 'Show Presets' },
                { command: 'vs-linker.validateConfig', title: 'Validate Config' }
              ],
              configuration: {
                properties: {
                  'vs-linker.projects': {
                    type: 'array'
                  }
                }
              }
            }
          }
        };
      }
      return undefined;
    }
  },
  Uri: {
    file: (p: string) => ({ fsPath: p, path: p })
  },
  Position: class Position {
    constructor(public line: number, public character: number) {}
  },
  Range: class Range {
    constructor(public start: any, public end: any) {}
  },
  ViewColumn: {
    One: 1,
    Two: 2,
    Three: 3
  },
  ConfigurationTarget: {
    Global: 1,
    Workspace: 2,
    WorkspaceFolder: 3
  }
};

// Inject vscode mock into Node's require cache
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id: string) {
  if (id === 'vscode') {
    return vscode;
  }
  return originalRequire.apply(this, arguments);
};
