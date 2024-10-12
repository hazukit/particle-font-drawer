import { Dot } from '../src/Dot';

describe('Dotクラスのテスト', () => {
  let dot;

  // 各テストの前に新しいDotインスタンスを生成
  beforeEach(() => {
    dot = new Dot(0, 0, 'rgba(255,0,0,1)');
  });

  test('ドットの初期化が正しく行われる', () => {
    expect(dot.x).toBe(0);
    expect(dot.y).toBe(0);
    expect(dot.vx).toBe(0);
    expect(dot.vy).toBe(0);
    expect(dot.ax).toBe(0);
    expect(dot.ay).toBe(0);
    expect(dot.rgba).toBe('rgba(255,0,0,1)');
  });

  test('基準位置の設定が正しく行われる', () => {
    dot.setBaseLocation(20, 20);
    expect(dot.tx).toBe(20);
    expect(dot.ty).toBe(20);
  });

  test('位置と速度の更新が正しく行われる', () => {
    dot.ax = 1;
    dot.ay = 1;
    dot.update();
    expect(dot.vx).toBe(1);
    expect(dot.vy).toBe(1);
    expect(dot.x).toBe(1);
    expect(dot.y).toBe(1);
  });

  test('速度がしきい値を下回った場合、ドットが固定される', () => {
    dot.tx = 5;
    dot.ty = 5;
    dot.vx = 0.001;
    dot.vy = 0.001;
    dot.update();
    expect(dot.vx).toBe(0);
    expect(dot.vy).toBe(0);
    expect(dot.ax).toBe(0);
    expect(dot.ay).toBe(0);
    expect(dot.x).toBe(5);
    expect(dot.y).toBe(5);
  });

  test('力が加算される範囲外だと動作しない', () => {
    dot.dx = 1;
    dot.dy = 1;
    dot.addForce(5, 5, 1, 1);
    expect(dot.ax).toBe(0); // 0のまま
    expect(dot.ay).toBe(0);
  });

  test('力の加算が正しく行われる', () => {
    dot.dx = 1;
    dot.dy = 1;
    dot.addForce(-5, -5, 100, 1);
    expect(dot.ax).toBeGreaterThanOrEqual(0.6); // 0.6くらいの加速度になる
    expect(dot.ax).toBeLessThan(0.7);
    expect(dot.ay).toBeGreaterThanOrEqual(0.6);
    expect(dot.ay).toBeLessThan(0.7);
  });

  test('ホームポジションへの戻りが正しく行われる', () => {
    dot.setBaseLocation(10, 10);
    dot.homeForce = 0.1;
    dot.seekHome();
    expect(dot.ax).toBe(1); // 1になる
    expect(dot.ay).toBe(1);
  });

  test('ダンピング効果が正しく適用される', () => {
    dot.vx = 2;
    dot.vy = 2;
    dot.damp = 0.1;
    dot.addDamping();
    expect(dot.ax).toBe(-0.2); // -0.2になる
    expect(dot.ay).toBe(-0.2);
  });
});