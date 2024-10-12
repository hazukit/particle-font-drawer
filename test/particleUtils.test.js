import { particleUtils } from '../src/particleUtils';

describe('particleUtils - 色変換と画像データの取得', () => {

  test('RGBからHEXに変換する', () => {
    const hex = particleUtils.common.rgbToHex(255, 0, 0);
    expect(hex).toBe('ff0000');
  });

  test('HEXからRGBに変換する', () => {
    const rgb = particleUtils.common.hexToRgb('ff0000');
    expect(rgb).toEqual({ r: 255, g: 0, b: 0, a: 255 });
  });

  test('RGBAからHEXに変換する', () => {
    const hex = particleUtils.common.rgbaToHex(255, 165, 0, 255);
    expect(hex).toBe('ffa500ff');
  });

  test('HEXからRGBAに変換する', () => {
    const rgba = particleUtils.common.hexToRgba('ffa500ff');
    expect(rgba).toEqual({ r: 255, g: 165, b: 0, a: 255 });
  });

  test('カラーをHEXに変換する (RGB)', () => {
    const hex = particleUtils.common.colorToHex('ff0000');
    expect(hex).toEqual({ r: 255, g: 0, b: 0, a: 255 });
  });

  test('カラーをHEXに変換する (RGBA)', () => {
    const hex = particleUtils.common.colorToHex('ffa500ff');
    expect(hex).toEqual({ r: 255, g: 165, b: 0, a: 255 });
  });

  test('カラーをHEXに変換する (RGBA)', () => {
    const hex = particleUtils.common.colorToHex('ffa500ff');
    expect(hex).toEqual({ r: 255, g: 165, b: 0, a: 255 });
  });

  test('フォントサイズが正しく取得される', () => {
    const fontSize = particleUtils.common.getFontSize('20px Arial');
    expect(fontSize).toBe(20);
  });

  test('画像データが正しく取得される', async () => {
    // Imageオブジェクトをモックして、非同期でonloadを呼び出すように設定
    const originalImage = global.Image;
    let imageSrc;

    global.Image = class {
      constructor() {
        this.width = 100;
        this.height = 100;
        this.onload = null;
        this.onerror = null;
        imageSrc = '';
      }

      set src(value) {
        imageSrc = value;
        setTimeout(() => {
          this.onload(); // 成功時に onload を呼び出す
        }, 100);
      }

      get src() {
        return imageSrc;
      }
    };

    // canvas のモック
    const mockCanvas = document.createElement('canvas');
    mockCanvas.getContext = jest.fn().mockReturnValue({
      drawImage: jest.fn(),
      getImageData: jest.fn(() => ({
        width: 100,
        height: 100,
        data: new Uint8ClampedArray(100 * 100 * 4), // ダミーの画像データ
      })),
    });

    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas);
    const imageUrl = 'test.jpg';

    // getImageBytesを呼び出し
    const imageData = await particleUtils.common.getImageBytes(imageUrl);

    // 画像データのチェック
    expect(imageData).toBeDefined();
    expect(imageData.width).toBe(100);
    expect(imageData.height).toBe(100);
    expect(imageData.data.length).toBe(100 * 100 * 4); // ダミー画像データと同じ

    // 元に戻す
    global.Image = originalImage;
    jest.restoreAllMocks();
  });

  test('画像の読み込みに失敗した場合', async () => {
    const originalImage = global.Image;
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onerror(new Error('Failed')); // onerror を呼び出す
        }, 100);
      }
    };

    const imageUrl = 'test.jpg';
    // 例外が発生することを確認
    await expect(particleUtils.common.getImageBytes(imageUrl)).rejects.toThrow('Failed');

    // 元に戻す
    global.Image = originalImage;
  });
});