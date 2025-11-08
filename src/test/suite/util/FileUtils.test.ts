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
      const project: Project = {
        rootPath: 'C:\\MyProject',
        regularExpress: ['/test/g']
      };

      // Mock active editor
      const mockEditor = {
        document: {
          uri: {
            fsPath: 'C:\\MyProject\\src\\components\\Component.js'
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        './utils/helper.js',
        project,
        'C:\\MyProject\\src\\components\\Component.js',
        'C:\\MyProject'
      );

      assert.ok(result, 'Should return a path');
      assert.ok(result!.includes('components'), 'Should include parent directory');
      assert.ok(result!.includes('helper.js'), 'Should include filename');
    });

    test('절대 경로 처리 (/ 로 시작)', () => {
      const project: Project = {
        rootPath: 'C:\\MyProject',
        regularExpress: ['/test/g']
      };

      const mockEditor = {
        document: {
          uri: {
            fsPath: 'C:\\MyProject\\src\\components\\Component.js'
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        '/utils/helper.js',
        project,
        'C:\\MyProject\\src\\Component.js',
        'C:\\MyProject'
      );

      assert.ok(result, 'Should return a path');
      assert.ok(result!.includes('MyProject'), 'Should use project rootPath');
      assert.ok(result!.includes('utils'), 'Should include utils directory');
    });

    test('루트 디렉토리를 찾을 수 없으면 undefined 반환', () => {
      const project: Project = {
        rootPath: 'C:\\MyProject',
        regularExpress: ['/test/g']
      };

      const mockEditor = {
        document: {
          uri: {
            fsPath: '/invalid/path/without/volume'
          }
        }
      };
      sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);

      const result = determineIncludePath(
        './helper.js',
        project,
        '/invalid/path/without/volume',
        ''
      );

      // Should show warning message
      assert.ok(showWarningMessageStub.called, 'Should show warning message');
      assert.strictEqual(result, undefined, 'Should return undefined');
    });

    test('네트워크 경로 처리', () => {
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
