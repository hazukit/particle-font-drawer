import { randomNumberCreator } from '../src/randomNumberCreator';

describe('randomNumberCreator', () => {
  test('指定した範囲内の数値を生成する', () => {
    const min = 1;
    const max = 100;
    const result = randomNumberCreator.randomRange(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  test('デフォルトの値が使用された場合、数値を生成する', () => {
    const min = 0;
    const max = 100;
    const result = randomNumberCreator.randomRange();
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });
});