import { InputHandler } from '../src/InputHandler';

describe('InputHandlerクラスのテスト', () => {
  let canvas, onMoveMock, onDownMock, onUpMock, onLeaveMock, inputHandler;

  beforeEach(() => {
    // ResizeObserverをモック
    global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    // モック関数を作成
    onMoveMock = jest.fn();
    onDownMock = jest.fn();
    onUpMock = jest.fn();
    onLeaveMock = jest.fn();

    // モックのキャンバス要素を作成
    canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 150;
    document.body.appendChild(canvas);

    // canvas.getBoundingClientRect() をモック
    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 150,
      top: 10,
      left: 10,
      right: 300,
      bottom: 150,
    });

    // InputHandler インスタンスを作成
    inputHandler = new InputHandler(canvas, onMoveMock, onDownMock, onUpMock, onLeaveMock);
  });

  afterEach(() => {
    // DOMからキャンバスを削除
    document.body.removeChild(canvas);
  });

  test('マウスの移動でonMoveが呼び出される', () => {
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 50,
    });

    canvas.dispatchEvent(mouseEvent);

    expect(onMoveMock).toHaveBeenCalledTimes(1);
    expect(onMoveMock).toHaveBeenCalledWith(90, 40);
  });

  test('マウスダウンでonDownが呼び出される', () => {
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: 120,
      clientY: 60,
    });

    canvas.dispatchEvent(mouseEvent);

    expect(onDownMock).toHaveBeenCalledTimes(1);
    expect(onDownMock).toHaveBeenCalledWith(110, 50);
  });

  test('マウスアップでonUpが呼び出される', () => {
    const mouseEvent = new MouseEvent('mouseup');

    canvas.dispatchEvent(mouseEvent);

    expect(onUpMock).toHaveBeenCalledTimes(1);
  });

  test('キャンバス外に出たときにonLeaveが呼び出される', () => {
    const mouseEvent = new MouseEvent('mouseout');

    canvas.dispatchEvent(mouseEvent);

    expect(onLeaveMock).toHaveBeenCalledTimes(1);
  });

  test('タッチ移動でonMoveが呼び出される', () => {
    // タッチデバイス判定をモック
    Object.defineProperty(window, 'ontouchstart', { value: true });

    inputHandler = new InputHandler(canvas, onMoveMock, onDownMock, onUpMock, onLeaveMock);

    const touchMoveEvent = new TouchEvent('touchmove', {
      touches: [{ clientX: 50, clientY: 30 }]  // タッチ位置を設定
    });

    canvas.dispatchEvent(touchMoveEvent);

    expect(onMoveMock).toHaveBeenCalledTimes(1);
    expect(onMoveMock).toHaveBeenCalledWith(40, 20);
  });

  test('タッチダウン でonDownが呼び出される', () => {
    // touchstart イベントを作成
    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 50 }]
    });

    // イベントを発火させる
    canvas.dispatchEvent(touchStartEvent);

    // onDown が呼び出され、正しい座標が渡されたことを確認
    expect(onDownMock).toHaveBeenCalledTimes(1);
    expect(onDownMock).toHaveBeenCalledWith(90, 40);
  });

  test('タッチアップでonUpが呼び出される', () => {
    // touchend イベントを作成
    const touchEndEvent = new TouchEvent('touchend', {
      touches: [{ clientX: 100, clientY: 50 }]
    });

    // イベントを発火させる
    canvas.dispatchEvent(touchEndEvent);

    // onUp が呼び出されていることを確認
    expect(onUpMock).toHaveBeenCalledTimes(1);
  });

  test('タッチキャンセルでonLeaveが呼び出される', () => {
    // touchcancel イベントを作成
    const touchCancelEvent = new TouchEvent('touchcancel', {
      touches: [{ clientX: 100, clientY: 50 }]
    });

    // イベントを発火させる
    canvas.dispatchEvent(touchCancelEvent);

    // onLeave が呼び出されていることを確認
    expect(onLeaveMock).toHaveBeenCalledTimes(1);
  });

  test('リサイズ時にキャンバスのスケールが更新される', () => {
    // canvas.getBoundingClientRect() をモック
    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 150,
      top: 0,
      left: 0,
      right: 300,
      bottom: 150,
    });

    // スケールが最初は1であることを確認
    expect(inputHandler.scale.scaleX).toBe(1);
    expect(inputHandler.scale.scaleY).toBe(1);

    // リサイズのシミュレーション
    const mockRect = { width: 600, height: 300, left: 0, top: 0 };
    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue(mockRect);

    // ResizeObserver のコールバックを手動で呼び出して、リサイズをトリガー
    const resizeObserverCallback = global.ResizeObserver.mock.calls[0][0];
    resizeObserverCallback();

    // リサイズ後にスケールが更新されているか確認
    expect(inputHandler.scale.scaleX).toBe(0.5);
    expect(inputHandler.scale.scaleY).toBe(0.5);
  });

});