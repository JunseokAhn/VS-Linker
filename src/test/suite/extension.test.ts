import * as assert from 'assert';
import * as vscode from 'vscode';

suite('확장 프로그램 통합 테스트', () => {

  test('확장 프로그램 존재 확인', () => {
    const extension = vscode.extensions.getExtension('JunseokAhn.vs-linker');
    assert.ok(extension, 'Extension should be installed');
  });

  test('확장 프로그램 활성화 확인', async () => {
    const extension = vscode.extensions.getExtension('JunseokAhn.vs-linker');
    assert.ok(extension, 'Extension should exist');

    await extension!.activate();
    assert.strictEqual(extension!.isActive, true, 'Extension should be active');
  });

  test('vs-linker.addPreset 명령어 등록 확인', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes('vs-linker.addPreset'),
      'addPreset command should be registered'
    );
  });

  test('vs-linker.showPresets 명령어 등록 확인', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes('vs-linker.showPresets'),
      'showPresets command should be registered'
    );
  });

  test('vs-linker.validateConfig 명령어 등록 확인', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes('vs-linker.validateConfig'),
      'validateConfig command should be registered'
    );
  });

  test('올바른 확장 프로그램 메타데이터 확인', () => {
    const extension = vscode.extensions.getExtension('JunseokAhn.vs-linker');
    assert.ok(extension, 'Extension should exist');

    const packageJSON = extension!.packageJSON;
    assert.strictEqual(packageJSON.name, 'vs-linker', 'Extension name should match');
    assert.strictEqual(packageJSON.publisher, 'JunseokAhn', 'Publisher should match');
    assert.ok(packageJSON.version, 'Extension should have version');
  });

  test('올바른 contributes 설정 확인', () => {
    const extension = vscode.extensions.getExtension('JunseokAhn.vs-linker');
    assert.ok(extension, 'Extension should exist');

    const packageJSON = extension!.packageJSON;
    assert.ok(packageJSON.contributes, 'Should have contributes section');
    assert.ok(packageJSON.contributes.commands, 'Should have commands');
    assert.ok(packageJSON.contributes.configuration, 'Should have configuration');

    const commands = packageJSON.contributes.commands;
    assert.ok(
      commands.some((cmd: any) => cmd.command === 'vs-linker.addPreset'),
      'Should define addPreset command'
    );
    assert.ok(
      commands.some((cmd: any) => cmd.command === 'vs-linker.showPresets'),
      'Should define showPresets command'
    );
    assert.ok(
      commands.some((cmd: any) => cmd.command === 'vs-linker.validateConfig'),
      'Should define validateConfig command'
    );
  });

  test('vs-linker.projects 설정 확인', () => {
    const extension = vscode.extensions.getExtension('JunseokAhn.vs-linker');
    assert.ok(extension, 'Extension should exist');

    const packageJSON = extension!.packageJSON;
    const properties = packageJSON.contributes.configuration.properties;
    assert.ok(properties['vs-linker.projects'], 'Should have projects configuration');
    assert.strictEqual(
      properties['vs-linker.projects'].type,
      'array',
      'projects should be array type'
    );
  });

});
