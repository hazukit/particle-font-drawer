import { particleUtils } from './particleUtils.js';

//フォントをキャンバスに描画し、その結果を画像のバイトデータとして取得するクラス
export class FontCanvas {
  constructor(text, fontStyles = {}, completeFunc = () => {}) {
    this.texts = text.split("\n");             // テキストを改行分割
    this.fontStyles = fontStyles;              // フォントスタイルオプション
    this.fontText = this.getText(fontStyles);  // スタイルからスタイル文字列を生成
    this.completeFunc = completeFunc;          // 完了時のコールバック関数

    this.canvas = document.createElement('canvas');  // キャンバス要素作成
    this.context = this.canvas.getContext('2d');     // キャンバスのコンテキスト取得
  }

  // フォントのロードとテキストの描画を処理
  load() {
    this.initCanvas();
    this.renderText();
    this.completeFunc();
  }

  // フォントのスタイル文字列を生成
  getText(fontStyles) {
    const {
      'font-style': fontStyle = 'normal',
      'font-variant': fontVariant = 'normal',
      'font-weight': fontWeight = 'normal',
      'font-size': fontSize = '16px',
      'font-family': fontFamily = 'Arial'
    } = fontStyles;

    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`;
  }

  // テキストのサイズを取得
  getTextSize(text) {
    const div = document.createElement("div");
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.left = '-9999px';
    div.style.font = this.fontText;
    div.innerHTML = text;

    document.body.appendChild(div);
    const size = [div.clientWidth, div.clientHeight];  // テキストのサイズ取得
    document.body.removeChild(div);

    return size;
  }

  // キャンバス初期化
  initCanvas() {
    const [width, height] = this.calculateCanvasSize();
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.textBaseline = 'top';
    this.context.textAlign = 'left';
    this.context.fillStyle = 'red';
  }

  // キャンバスサイズを計算
  calculateCanvasSize() {
    let maxWidth = 0;
    let totalHeight = 0;

    for (const text of this.texts) {
      const [width, height] = this.getTextSize(text);
      if (width > maxWidth) maxWidth = width;
      totalHeight += height;
    }

    return [maxWidth, totalHeight];
  }

  // テキストをキャンバスに描画
  renderText() {
    let y = -1000;
    for (const text of this.texts) {
      this.context.font = this.fontText;
      if (y == -1000) { // yの位置を調整
        const metrics = this.context.measureText(text);
        y = particleUtils.common.getFontSize(this.fontText) - metrics.fontBoundingBoxDescent;
      }
      this.context.fillText(text, 0, y);
      y += this.getTextSize(text)[1];
    }
  }
}