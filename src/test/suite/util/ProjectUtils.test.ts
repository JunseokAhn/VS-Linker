import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { getRegex, validateRegex } from '../../../util/ProjectUtils';

suite('ProjectUtils 테스트', () => {

  let showErrorMessageStub: sinon.SinonStub;

  setup(() => {
    // Stub vscode.window.showErrorMessage to prevent UI popups during tests
    showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage');
  });

  teardown(() => {
    sinon.restore();
  });

  suite('getRegex', () => {

    test('플래그가 있는 유효한 정규식 파싱 성공', () => {
      const regex = getRegex('/test(?<filename>.*?)/g');
      assert.ok(regex instanceof RegExp, 'Should return RegExp object');
      assert.strictEqual(regex.source, 'test(?<filename>.*?)');
      assert.strictEqual(regex.flags, 'g');
    });

    test('여러 플래그를 가진 정규식 파싱', () => {
      const regex = getRegex('/import(?<filename>.*?)/gi');
      assert.strictEqual(regex.flags, 'gi');
    });

    test('잘못된 정규식 형식은 에러 발생', () => {
      assert.throws(() => {
        getRegex('invalid-regex');
      }, /Invalid regex format/);
    });

    test('filename named group이 없으면 에러 발생', () => {
      assert.throws(() => {
        getRegex('/test(.*?)/g');
      }, /must contain a "filename" named group/);
    });

    test('잘못된 정규식 패턴은 에러 발생', () => {
      assert.throws(() => {
        getRegex('/[(?<filename>.*?)/g'); // Invalid regex - unmatched bracket
      });
    });

    test('복잡한 정규식 패턴 처리', () => {
      const regex = getRegex('/import\\s+.*?from\\s+["\'](?<filename>.*?)["\']/g');
      assert.ok(regex instanceof RegExp);
      assert.ok(regex.source.includes('filename'));
    });

  });

  suite('validateRegex', () => {

    test('올바른 정규식은 valid 반환', () => {
      const result = validateRegex('/test(?<filename>.*?)/g');
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.error, undefined);
    });

    test('잘못된 형식의 정규식은 invalid 반환', () => {
      const result = validateRegex('not-a-regex');
      assert.strictEqual(result.valid, false);
      assert.ok(result.error, 'Should have error message');
      assert.ok(result.error!.includes('Invalid regex format'));
    });

    test('filename group이 없으면 invalid 반환', () => {
      const result = validateRegex('/test(.*?)/g');
      assert.strictEqual(result.valid, false);
      assert.ok(result.error, 'Should have error message');
      assert.ok(result.error!.includes('filename'));
    });

    test('잘못된 정규식 패턴은 invalid 반환', () => {
      const result = validateRegex('/[(?<filename>.*?)/g');
      assert.strictEqual(result.valid, false);
      assert.ok(result.error, 'Should have error message');
    });

    test('ASP 정규식 패턴 처리', () => {
      const result = validateRegex('/<!--(.*?)include(.+?)=(\\s+)?\\\"(?<filename>.*?)\\\"(.*)-->/g');
      assert.strictEqual(result.valid, true, 'ASP regex should be valid');
    });

    test('Vue @ alias 정규식 처리', () => {
      const result = validateRegex('/import(.*)from\\s\'@(?<filename>.*?)\';/g');
      assert.strictEqual(result.valid, true, 'Vue regex should be valid');
    });

  });

});
