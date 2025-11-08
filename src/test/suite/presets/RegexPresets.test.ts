import * as assert from 'assert';
import { getPresetById, getPresetNames, getAllPresets, REGEX_PRESETS } from '../../../presets/RegexPresets';

suite('RegexPresets 테스트', () => {

  test('유효한 ID로 프리셋 조회 성공', () => {
    const preset = getPresetById('javascript-import');
    assert.ok(preset, '프리셋이 존재해야 함');
    assert.strictEqual(preset.id, 'javascript-import');
    assert.strictEqual(preset.name, 'JavaScript/TypeScript Import');
  });

  test('잘못된 ID는 undefined 반환', () => {
    const preset = getPresetById('non-existent-id');
    assert.strictEqual(preset, undefined, '존재하지 않는 ID는 undefined 반환');
  });

  test('모든 프리셋 이름 목록 반환', () => {
    const names = getPresetNames();
    assert.ok(Array.isArray(names), '배열을 반환해야 함');
    assert.ok(names.length > 0, '최소 1개 이상의 프리셋 존재');
    assert.ok(names.includes('JavaScript/TypeScript Import'), 'JavaScript/TypeScript Import 포함');
  });

  test('모든 프리셋 배열 반환', () => {
    const presets = getAllPresets();
    assert.ok(Array.isArray(presets), '배열을 반환해야 함');
    assert.strictEqual(presets.length, REGEX_PRESETS.length, '모든 프리셋 반환');
  });

  test('모든 프리셋이 필수 속성 포함', () => {
    const presets = getAllPresets();
    presets.forEach(preset => {
      assert.ok(preset.id, 'id 속성 필수');
      assert.ok(preset.name, 'name 속성 필수');
      assert.ok(preset.description, 'description 속성 필수');
      assert.ok(Array.isArray(preset.regularExpress), 'regularExpress는 배열');
      assert.ok(preset.regularExpress.length > 0, '최소 1개 이상의 정규식 필요');
      assert.ok(Array.isArray(preset.examples), 'examples는 배열');
      assert.ok(preset.examples.length > 0, '최소 1개 이상의 예제 필요');
    });
  });

  test('모든 프리셋 정규식에 filename named group 포함', () => {
    const presets = getAllPresets();
    presets.forEach(preset => {
      preset.regularExpress.forEach(regex => {
        assert.ok(regex.includes('(?<filename>'),
          `프리셋 "${preset.name}"의 정규식은 (?<filename>) named group 포함 필요: ${regex}`);
      });
    });
  });

  test('ASP 프리셋 올바르게 설정됨', () => {
    const preset = getPresetById('asp-classic');
    assert.ok(preset, 'ASP 프리셋 존재해야 함');
    assert.ok(preset.regularExpress[0].includes('include'), 'ASP 정규식에 "include" 포함');
  });

  test('Vue 프리셋이 @ alias 처리', () => {
    const preset = getPresetById('vue-import');
    assert.ok(preset, 'Vue 프리셋 존재해야 함');
    assert.ok(preset.regularExpress[0].includes('@'), 'Vue 정규식이 @ alias 처리');
  });

  test('Python 프리셋이 두 가지 import 스타일 처리', () => {
    const preset = getPresetById('python-import');
    assert.ok(preset, 'Python 프리셋 존재해야 함');
    assert.strictEqual(preset.regularExpress.length, 2, 'Python은 2개의 정규식 패턴 보유');
  });

  test('PHP 프리셋이 include와 require 처리', () => {
    const preset = getPresetById('php-include');
    assert.ok(preset, 'PHP 프리셋 존재해야 함');
    assert.ok(preset.regularExpress[0].includes('include|require'),
      'PHP 정규식이 include와 require 모두 처리');
  });

});
