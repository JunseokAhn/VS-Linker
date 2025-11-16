import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { getLinkRange, determineIncludePath } from '../../../util/FileUtils';
import { Project } from '../../../common/Interfaces';

suite('FileUtils 테스트', () => {

  let showWarningMessageStub: sinon.SinonStub;
  let activeEditorStub: sinon.SinonStub;

  setup(() => {
    showWarningMessageStub = sinon.stub(vscode.window, 'showWarningMessage');
  });

  teardown(() => {
    sinon.restore();
  });

  suite('getLinkRange', () => {

    test('주어진 offset과 text로 올바른 Range 생성', () => {
      // Create a mock document
      const mockDocument = {
        positionAt: (offset: number) => new vscode.Position(0, offset),
        lineAt: () => ({ text: 'test line' }),
        lineCount: 1,
        uri: vscode.Uri.file('/test/file.js')
      } as any;

      const range = getLinkRange(mockDocument, { offset: 5, text: 'link' });

      assert.ok(range instanceof vscode.Range, 'Should return Range object');
      assert.strictEqual(range.start.line, 0);
      assert.strictEqual(range.start.character, 5);
      assert.strictEqual(range.end.character, 9); // 5 + 'link'.length
    });

    test('문서 시작 지점의 offset 처리', () => {
      const mockDocument = {
        positionAt: (offset: number) => new vscode.Position(0, offset),
        lineCount: 1,
        uri: vscode.Uri.file('/test/file.js')
      } as any;

      const range = getLinkRange(mockDocument, { offset: 0, text: 'test' });

      assert.strictEqual(range.start.character, 0);
      assert.strictEqual(range.end.character, 4);
    });

  });

  suite('determineIncludePath', () => {

    test('상대 경로 처리 (/ 로 시작하지 않음)', () => {
      // Use platform-specific paths for proper testing
      const isWindows = process.platform === 'win32';
      const rootPath = isWindows ? 'C:\\MyProject' : '/Users/test/MyProject';
      const fsPath = isWindows
        ? 'C:\\MyProject\\src\\components\\Component.js'
        : '/Users/test/MyProject/src/components/Component.js';

      const project: Project = {
        rootPath: rootPath,
        regularExpress: ['/test/g']
      };

      // Mock active editor
      const mockEditor = {
        document: {
          uri: {
            fsPath: fsPath
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        './utils/helper.js',
        project,
        fsPath,
        rootPath
      );

      assert.ok(result, 'Should return a path');
      assert.ok(result!.includes('components'), 'Should include parent directory');
      assert.ok(result!.includes('helper.js'), 'Should include filename');
    });

    test('절대 경로 처리 (/ 로 시작)', () => {
      // Use platform-specific paths for proper testing
      const isWindows = process.platform === 'win32';
      const rootPath = isWindows ? 'C:\\MyProject' : '/Users/test/MyProject';
      const fsPath = isWindows
        ? 'C:\\MyProject\\src\\components\\Component.js'
        : '/Users/test/MyProject/src/components/Component.js';
      const filePath = isWindows
        ? 'C:\\MyProject\\src\\Component.js'
        : '/Users/test/MyProject/src/Component.js';

      const project: Project = {
        rootPath: rootPath,
        regularExpress: ['/test/g']
      };

      const mockEditor = {
        document: {
          uri: {
            fsPath: fsPath
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        '/utils/helper.js',
        project,
        filePath,
        rootPath
      );

      assert.ok(result, 'Should return a path');
      assert.ok(result!.includes('MyProject'), 'Should use project rootPath');
      assert.ok(result!.includes('utils'), 'Should include utils directory');
    });

    test('Unix/macOS 상대 경로 처리', () => {
      const project: Project = {
        rootPath: '/Users/username/MyProject',
        regularExpress: ['/test/g']
      };

      const mockEditor = {
        document: {
          uri: {
            fsPath: '/Users/username/MyProject/src/components/Component.js'
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        './utils/helper.js',
        project,
        '/Users/username/MyProject/src/components/Component.js',
        '/Users/username/MyProject'
      );

      assert.ok(result, 'Should return a path');
      assert.ok(result!.includes('components'), 'Should include parent directory');
      assert.ok(result!.includes('helper.js'), 'Should include filename');
    });

    test('Unix/macOS 절대 경로 처리', () => {
      const project: Project = {
        rootPath: '/Users/username/MyProject',
        regularExpress: ['/test/g']
      };

      const mockEditor = {
        document: {
          uri: {
            fsPath: '/Users/username/MyProject/src/Component.js'
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        '/utils/helper.js',
        project,
        '/Users/username/MyProject/src/Component.js',
        '/Users/username/MyProject'
      );

      assert.ok(result, 'Should return a path');
      assert.ok(result!.includes('MyProject'), 'Should use project rootPath');
      assert.ok(result!.includes('utils'), 'Should include utils directory');
    });

    test('Linux 경로 처리', () => {
      const project: Project = {
        rootPath: '/home/user/project',
        regularExpress: ['/test/g']
      };

      const mockEditor = {
        document: {
          uri: {
            fsPath: '/home/user/project/src/main.go'
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        './utils.go',
        project,
        '/home/user/project/src/main.go',
        '/home/user/project'
      );

      assert.ok(result, 'Should return a path');
      assert.ok(result!.includes('src'), 'Should include src directory');
      assert.ok(result!.includes('utils.go'), 'Should include filename');
    });

    test('activeTextEditor가 없으면 undefined 반환', () => {
      const project: Project = {
        rootPath: '/Users/username/MyProject',
        regularExpress: ['/test/g']
      };

      // No active editor
      sinon.stub(vscode.window, 'activeTextEditor').value(undefined);

      const result = determineIncludePath(
        './helper.js',
        project,
        '/Users/username/MyProject/src/Component.js',
        '/Users/username/MyProject'
      );

      // Should show warning message
      assert.ok(showWarningMessageStub.called, 'Should show warning message');
      assert.strictEqual(result, undefined, 'Should return undefined');
    });

    // Windows-only test for network paths (UNC paths)
    (process.platform === 'win32' ? test : test.skip)('네트워크 경로 처리', () => {
      const project: Project = {
        rootPath: '\\\\192.168.1.1\\SharedFolder',
        regularExpress: ['/test/g']
      };

      const mockEditor = {
        document: {
          uri: {
            fsPath: '\\\\192.168.1.1\\SharedFolder\\src\\file.js'
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        '/utils/config.js',
        project,
        '\\\\192.168.1.1\\SharedFolder\\src\\file.js',
        ''
      );

      assert.ok(result, 'Should handle network paths');
      assert.ok(result!.includes('config.js'), 'Should include filename');
    });

  });

});
