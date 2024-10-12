import { FontCanvas } from '../src/FontCanvas';

describe('FontCanvasクラスのテスト', () => {
  let fontCanvas;

  beforeEach(() => {
    // HTMLCanvasElementのgetContextメソッドをモック
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      fillText: jest.fn(),
      measureText: jest.fn(() => ({ width: 100 })),
      clearRect: jest.fn(),
      drawImage: jest.fn(),
      getImageData: jest.fn(() => ({})),
    });

    fontCanvas = new FontCanvas("テストテキスト");
  });

  afterEach(() => {
    jest.restoreAllMocks();  // モックの解除
  });

  test('デフォルトでフォントスタイル文字列が正しく生成される', () => {
    const fontText = fontCanvas.getText({});
    expect(fontText).toBe('normal normal normal 16px Arial');
  });

  test('フォントスタイル文字列が正しく生成される', () => {
    const fontText = fontCanvas.getText({
      'font-style': 'italic',
      'font-variant': 'small-caps',
      'font-weight': 'bold',
      'font-size': '20px',
      'font-family': 'Verdana'
    });
    expect(fontText).toBe('italic small-caps bold 20px Verdana');
  });

  test('テキストサイズが正しく取得される', () => {
    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 100 });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 20 });

    jest.spyOn(document, 'createElement').mockReturnValue(mockDiv);

    const textSize = fontCanvas.getTextSize("テストテキスト");
    
    expect(textSize).toBeDefined();
    expect(textSize).toEqual([100, 20]);  // モックされたサイズと一致するか確認
  });

  test('キャンバスが正しく初期化される', () => {
    // calculateCanvasSize のモック
    const calculateCanvasSizeMock = jest.spyOn(fontCanvas, 'calculateCanvasSize').mockReturnValue([200, 100]);

    fontCanvas.initCanvas();
  
    // キャンバスのサイズが期待通りに設定されているか確認
    expect(fontCanvas.canvas.width).toBe(200); 
    expect(fontCanvas.canvas.height).toBe(100);
  });
    
  test('テキストが1行の場合、キャンバスサイズが正しく計算される', () => {
    // getTextSize のモック
    const getTextSizeMock = jest.spyOn(fontCanvas, 'getTextSize').mockReturnValue([150, 50]);

    const [width, height] = fontCanvas.calculateCanvasSize();
    expect(width).toBe(150);  // 幅が0より大きいことを確認
    expect(height).toBe(50); // 高さが0より大きいことを確認
  });
    
  test('テキストが複数行の場合、キャンバスサイズが正しく計算される', () => {
    fontCanvas = new FontCanvas("テストテキスト\nテストテキスト");
    // getTextSize のモック
    const getTextSizeMock = jest.spyOn(fontCanvas, 'getTextSize')
      .mockImplementationOnce(() => [100, 50])  // 1回目の呼び出し
      .mockImplementationOnce(() => [200, 100]);  // 2回目の呼び出し

    const [width, height] = fontCanvas.calculateCanvasSize();
    expect(width).toBe(200);  // 幅が0より大きいことを確認
    expect(height).toBe(150); // 高さが0より大きいことを確認
  });

  test('キャンバスに正しく描画される', () => {
    fontCanvas.initCanvas();
    fontCanvas.renderText();
    // fillTextが呼び出されたことを確認
    const fillTextSpy = jest.spyOn(fontCanvas.context, 'fillText');
    fontCanvas.renderText();
    expect(fillTextSpy).toHaveBeenCalled(); // fillTextが呼び出される
    expect(fillTextSpy).toHaveBeenCalledWith('テストテキスト', 0, expect.any(Number));
  });

  test('コールバック関数が描画後に呼び出される', () => {
    const completeFunc = jest.fn();
    fontCanvas = new FontCanvas("テストテキスト", {}, completeFunc);
    fontCanvas.load();
    expect(completeFunc).toHaveBeenCalled(); // コールバック関数が呼び出されるか確認
  });
});