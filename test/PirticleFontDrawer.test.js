import { PirticleFontDrawer } from '../src/PirticleFontDrawer';
import { Dot } from '../src/Dot';
import { FontCanvas } from '../src/FontCanvas';
import { particleUtils } from '../src/particleUtils';
import { InputHandler } from '../src/InputHandler'; // InputHandlerをインポート

// モジュールをモック
jest.mock('../src/FontCanvas', () => ({
  FontCanvas: jest.fn(),
}));
jest.mock('../src/particleUtils');
jest.mock('../src/InputHandler'); // InputHandler をモック

describe('PirticleFontDrawerクラスのテスト', () => {
  let canvas, contextMock;

  beforeEach(() => {
    // モックのキャンバスを作成
    canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;

    // document.getElementByIdをモック
    jest.spyOn(document, 'getElementById').mockReturnValue(canvas);

    // context のモック作成
    contextMock = {
      getImageData: jest.fn().mockReturnValue({
        width: 500,
        height: 300,
        data: new Uint8ClampedArray(500 * 300 * 4).fill(255), // アルファ値を255に設定（全てのピクセルが表示されるように）
      }),
      clearRect: jest.fn(),
      putImageData: jest.fn(),
    };
        
    // HTMLCanvasElement の getContext をモック
    canvas.getContext = jest.fn().mockReturnValue(contextMock);

    // FontCanvas のモック実装
    FontCanvas.mockImplementation(() => ({
      width: 500,
      height: 300,
      context: contextMock,
      load: jest.fn(),
    }));

    // particleUtils.common.getImageBytes のモック
    jest.spyOn(particleUtils.common, 'getImageBytes').mockResolvedValue({
      data: new Uint8ClampedArray(500 * 300 * 4),
    });

    // particleUtils.common.colorToHex のモックを修正して rgba を返すように設定
    jest.spyOn(particleUtils.common, 'colorToHex').mockReturnValue({
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    });

    // InputHandlerのモック実装
    InputHandler.mockImplementation(() => ({
      setupEvents: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test('デフォルトオプションが正しく設定されている', () => {
    // オプションを指定せずにインスタンスを作成
    const drawer = new PirticleFontDrawer('canvasId', 'Test');

    // デフォルトオプションが正しく設定されているか確認
    expect(drawer.dotClass).toBe(Dot);
    expect(drawer.textColor).toBe('#000000');
    expect(drawer.offsetX).toStrictEqual(0);
    expect(drawer.offsetY).toStrictEqual(0);
    expect(drawer.fontStyles).toStrictEqual({});
    expect(drawer.dampForceRange).toEqual([5, 15]);
    expect(drawer.homeForceRange).toEqual([3, 9]);
    expect(drawer.textureUrl).toBeNull();
    expect(drawer.force).toBe(3);
    expect(drawer.clickedForce).toBe(200);
    expect(drawer.isClickedDamp).toBe(true);
    expect(drawer.radius).toBe(50);
    expect(drawer.firstBound).toBe(true);
  });


  test('デフォルトオプションが正しくマージされている', () => {
    // カスタムオプション
    const customOptions = {
      textColor: '#FF0000',
      radius: 100,
      firstBound: false
    };

    // PirticleFontDrawer インスタンスの作成
    const drawer = new PirticleFontDrawer('canvasId', 'Test', customOptions);

    // デフォルトオプションが正しくマージされているか確認
    expect(drawer.textColor).toBe('#FF0000');      // カスタムオプションの値
    expect(drawer.radius).toBe(100);               // カスタムオプションの値
    expect(drawer.firstBound).toBe(false);         // カスタムオプションの値

    // デフォルトオプションも残っていることを確認
    expect(drawer.dampForceRange).toEqual([5, 15]); // デフォルトオプション
    expect(drawer.homeForceRange).toEqual([3, 9]);  // デフォルトオプション
    expect(drawer.dotClass).toBe(Dot);              // デフォルトのドットクラス
  });

  test('オプションが全部上書きされている', () => {
    // カスタムオプション
    const customOptions = {
      //dotClass: Dot,
      textColor: '#FF0000',
      offsetX: 10,
      offsetY: 20,
      fontStyles: {'font-family':'Times New Roman', 'font-size': '100px'},
      dampForceRange: [1, 2],
      homeForceRange: [3, 4],
      textureUrl: 'img/bg.jpg',
      force: 4,
      clickedForce: 100,
      isClickedDamp: false,
      radius: 100,
      firstBound: false
    };

    // PirticleFontDrawer インスタンスの作成
    const drawer = new PirticleFontDrawer('canvasId', 'Test', customOptions);

    // 上書きされることを確認
    expect(drawer.dotClass).toBe(Dot); // 変更するクラスが今はない
    expect(drawer.textColor).toBe('#FF0000');
    expect(drawer.offsetX).toStrictEqual(10);
    expect(drawer.offsetY).toStrictEqual(20);
    expect(drawer.fontStyles).toStrictEqual({'font-family':'Times New Roman', 'font-size': '100px'});
    expect(drawer.dampForceRange).toEqual([1, 2]);
    expect(drawer.homeForceRange).toEqual([3, 4]);
    expect(drawer.textureUrl).toBe('img/bg.jpg');
    expect(drawer.force).toBe(4);
    expect(drawer.clickedForce).toBe(100);
    expect(drawer.isClickedDamp).toBe(false);
    expect(drawer.radius).toBe(100);
    expect(drawer.firstBound).toBe(false);
  });

  test('キャンバスの初期化が正しく行われる', () => {
    const drawer = new PirticleFontDrawer('canvasId', 'canvasId');
    
    // document.getElementById が 'canvasId' で呼び出されていることを確認
        expect(document.getElementById).toHaveBeenCalledWith('canvasId');

    // キャンバスのコンテキストが取得されているか確認
    expect(canvas.getContext).toHaveBeenCalledWith('2d', { willReadFrequently: true });

    // キャンバスの幅と高さが PirticleFontDrawer に正しく設定されているか確認
    expect(drawer.width).toBe(500);
    expect(drawer.height).toBe(300);

    // this.ctx（コンテキスト）が正しく設定されているか確認
    expect(drawer.ctx).toBe(contextMock);
  });

  test('フォントロード後にドットが正しく生成される', async () => {
    const drawer = new PirticleFontDrawer('canvasId', 'Test');
 
    // フォントロード後にドット生成
    await drawer.loadFontAndCreateDots(new FontCanvas('Test'));

    // ドットが正しく生成されているかを確認（dots配列が正しく初期化されていること）
    expect(drawer.dots.length).toBeGreaterThan(0);
  });

  test('onMouseMoveイベントが正しく処理される', () => {
    const drawer = new PirticleFontDrawer('canvasId', 'Test');
    // イベントの代わりに onMouseMove を直接呼び出す
    drawer.onMouseMove(100, 50);

    // mouseX, mouseYが更新されているか確認
    expect(drawer.mouseX).toBe(100);
    expect(drawer.mouseY).toBe(50);
  });

  test('onMouseOutが正しく処理される', () => {
    const drawer = new PirticleFontDrawer('canvasId', 'Test');
    // イベントの代わりに onMouseOut を直接呼び出す
    drawer.onMouseOut();

    // mouseX, mouseYが更新されているか確認
    expect(drawer.mouseX).toBe(-1000);
    expect(drawer.mouseY).toBe(-1000);
  });

  test('onMouseDownイベントが正しく処理される', () => {
    const drawer = new PirticleFontDrawer('canvasId', 'Test');
    // イベントの代わりに onMouseDown を直接呼び出す
    drawer.onMouseDown(100, 50);

    // mouseX, mouseYが更新されているか確認
    expect(drawer.mouseX).toBe(100);
    expect(drawer.mouseY).toBe(50);
  });

  test('isClickedDamp=trueの時、onMouseDownイベントが正しく処理される', () => {
    const drawer = new PirticleFontDrawer('canvasId', 'Test', {isClickedDamp: true});
    // イベントの代わりに onMouseDown を直接呼び出す
    drawer.onMouseDown(100, 50);

    // isMouseDownが更新されているか確認
    expect(drawer.isMouseDown).toBe(true);
  });

  test('isClickedDamp=falseの時、onMouseDownイベントが正しく処理される', () => {
        const drawer = new PirticleFontDrawer('canvasId', 'Test', {isClickedDamp: false});
    // イベントの代わりに onMouseDown を直接呼び出す
    drawer.onMouseDown(100, 50);

    // isMouseDownが更新されないことを確認
    expect(drawer.isMouseDown).toBe(false);
  });

  test('アニメーションループが正しく実行される', () => {
    const drawer = new PirticleFontDrawer('canvasId', 'Test');
    const dotMock = new Dot(100, 100, { r: 0, g: 0, b: 0, a: 255 });
    drawer.dots = [dotMock];

    jest.spyOn(dotMock, 'addForce');
    jest.spyOn(dotMock, 'seekHome');
    jest.spyOn(dotMock, 'addDamping');
    jest.spyOn(dotMock, 'update');
    jest.spyOn(drawer, 'drawDot');

    drawer.tick();

    expect(dotMock.addForce).toHaveBeenCalled();
    expect(dotMock.seekHome).toHaveBeenCalled();
    expect(dotMock.addDamping).toHaveBeenCalled();
    expect(dotMock.update).toHaveBeenCalled();
    expect(drawer.drawDot).toHaveBeenCalledWith(dotMock, expect.any(Object));
  });

  test('drawDotが正しくドットを描画する', () => {
    const drawer = new PirticleFontDrawer('canvasId', 'Test');
    const canvasData = {
      data: new Uint8ClampedArray(500 * 300 * 4).fill(0), // キャンバスデータを全て0に初期化
      width: 500,
      height: 300,
    };

    const dot = new Dot(10, 20, { r: 255, g: 0, b: 0, a: 255 }); // 赤いドットを作成

    // drawDotメソッドを呼び出し
    drawer.drawDot(dot, canvasData);

    // 指定された位置 (10, 20) のピクセルデータを確認
    const index = (10 + 20 * 500) * 4;
    expect(canvasData.data[index]).toBe(255);     // 赤の値
    expect(canvasData.data[index + 1]).toBe(0);   // 緑の値
    expect(canvasData.data[index + 2]).toBe(0);   // 青の値
    expect(canvasData.data[index + 3]).toBe(255); // アルファ値
  });

});