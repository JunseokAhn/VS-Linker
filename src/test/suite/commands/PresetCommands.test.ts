import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { PresetCommands } from '../../../commands/PresetCommands';
import { Project } from '../../../common/Interfaces';

suite('PresetCommands 테스트', () => {

  let getConfigurationStub: sinon.SinonStub;
  let existsSyncStub: sinon.SinonStub;
  let showWarningMessageStub: sinon.SinonStub;
  let showInformationMessageStub: sinon.SinonStub;
  let createOutputChannelStub: sinon.SinonStub;
  let mockOutputChannel: any;

  setup(() => {
    getConfigurationStub = sinon.stub(vscode.workspace, 'getConfiguration');
    existsSyncStub = sinon.stub(fs, 'existsSync');
    showWarningMessageStub = sinon.stub(vscode.window, 'showWarningMessage');
    showInformationMessageStub = sinon.stub(vscode.window, 'showInformationMessage');

    mockOutputChannel = {
      clear: sinon.stub(),
      appendLine: sinon.stub(),
      show: sinon.stub()
    };
    createOutputChannelStub = sinon.stub(vscode.window, 'createOutputChannel')
      .returns(mockOutputChannel);
  });

  teardown(() => {
    sinon.restore();
  });

  suite('validateConfig', () => {

    test('프로젝트가 설정되지 않았을 때 에러 보고', async () => {
      const mockConfig = {
        get: sinon.stub().returns(undefined)
      };
      getConfigurationStub.returns(mockConfig);

      await PresetCommands.validateConfig();

      assert.ok(mockOutputChannel.appendLine.called, 'Should write to output channel');
      const output = mockOutputChannel.appendLine.args.join('\n');
      assert.ok(output.includes('No project configuration'), 'Should report no configuration');
      assert.ok(showWarningMessageStub.called, 'Should show warning message');
    });

    test('프로젝트 배열이 비어있을 때 에러 보고', async () => {
      const mockConfig = {
        get: sinon.stub().returns([])
      };
      getConfigurationStub.returns(mockConfig);

      await PresetCommands.validateConfig();

      const output = mockOutputChannel.appendLine.args.join('\n');
      assert.ok(output.includes('No project configuration'), 'Should report no configuration');
    });

    test('rootPath 존재 여부 검증', async () => {
      const projects: Project[] = [
        {
          rootPath: 'C:\\ExistingProject',
          regularExpress: ['/test(?<filename>.*?)/g']
        }
      ];
      const mockConfig = {
        get: sinon.stub().returns(projects)
      };
      getConfigurationStub.returns(mockConfig);
      existsSyncStub.returns(true);

      await PresetCommands.validateConfig();

      const output = mockOutputChannel.appendLine.args.join('\n');
      assert.ok(output.includes('Path exists'), 'Should confirm path exists');
      assert.ok(showInformationMessageStub.called, 'Should show success message');
    });

    test('rootPath가 존재하지 않으면 에러 보고', async () => {
      const projects: Project[] = [
        {
          rootPath: 'C:\\NonExistentProject',
          regularExpress: ['/test(?<filename>.*?)/g']
        }
      ];
      const mockConfig = {
        get: sinon.stub().returns(projects)
      };
      getConfigurationStub.returns(mockConfig);
      existsSyncStub.returns(false);

      await PresetCommands.validateConfig();

      const output = mockOutputChannel.appendLine.args.join('\n');
      assert.ok(output.includes('does not exist'), 'Should report missing path');
      assert.ok(showWarningMessageStub.called, 'Should show warning');
    });

    test('정규식 패턴 검증', async () => {
      const projects: Project[] = [
        {
          rootPath: 'C:\\Project',
          regularExpress: [
            '/valid(?<filename>.*?)/g',
            '/also-valid(?<filename>.*?)/gi'
          ]
        }
      ];
      const mockConfig = {
        get: sinon.stub().returns(projects)
      };
      getConfigurationStub.returns(mockConfig);
      existsSyncStub.returns(true);

      await PresetCommands.validateConfig();

      const output = mockOutputChannel.appendLine.args.join('\n');
      assert.ok(output.includes('Regex #1'), 'Should validate first regex');
      assert.ok(output.includes('Regex #2'), 'Should validate second regex');
    });

    test('잘못된 정규식 패턴 보고', async () => {
      const projects: Project[] = [
        {
          rootPath: 'C:\\Project',
          regularExpress: [
            'invalid-regex',  // Missing / delimiters
            '/missing-group/g'  // Missing filename group
          ]
        }
      ];
      const mockConfig = {
        get: sinon.stub().returns(projects)
      };
      getConfigurationStub.returns(mockConfig);
      existsSyncStub.returns(true);

      await PresetCommands.validateConfig();

      const output = mockOutputChannel.appendLine.args.join('\n');
      assert.ok(output.includes('Error:'), 'Should report errors');
      assert.ok(showWarningMessageStub.called, 'Should show warning for errors');
    });

    test('여러 프로젝트 처리', async () => {
      const projects: Project[] = [
        {
          rootPath: 'C:\\Project1',
          regularExpress: ['/test1(?<filename>.*?)/g']
        },
        {
          rootPath: 'C:\\Project2',
          regularExpress: ['/test2(?<filename>.*?)/g']
        }
      ];
      const mockConfig = {
        get: sinon.stub().returns(projects)
      };
      getConfigurationStub.returns(mockConfig);
      existsSyncStub.returns(true);

      await PresetCommands.validateConfig();

      const output = mockOutputChannel.appendLine.args.join('\n');
      assert.ok(output.includes('Found 2 project(s)'), 'Should report correct count');
      assert.ok(output.includes('Project #1'), 'Should validate project 1');
      assert.ok(output.includes('Project #2'), 'Should validate project 2');
    });

    test('regularExpress가 없으면 보고', async () => {
      const projects: Project[] = [
        {
          rootPath: 'C:\\Project',
          regularExpress: []
        }
      ];
      const mockConfig = {
        get: sinon.stub().returns(projects)
      };
      getConfigurationStub.returns(mockConfig);
      existsSyncStub.returns(true);

      await PresetCommands.validateConfig();

      const output = mockOutputChannel.appendLine.args.join('\n');
      assert.ok(output.includes('No regex patterns'), 'Should report missing regex');
      assert.ok(showWarningMessageStub.called, 'Should show warning');
    });

  });

});
