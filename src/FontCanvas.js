//フォントをキャンバスに描画し、その結果を画像のバイトデータとして取得するクラス
export class FontCanvas {
  constructor(text, fontStyles = {}, fontUrl = null, completeFunc = () => {}) {
    this.texts = text.split("\n");             // テキストを改行分割
    this.fontStyles = fontStyles;              // フォントスタイルオプション
    this.fontText = this.getText(fontStyles);  // スタイルからスタイル文字列を生成
    this.fontUrl = fontUrl;                    // 外部フォントURL（任意）
    this.completeFunc = completeFunc;          // 完了時のコールバック関数

    this.canvas = document.createElement('canvas');  // キャンバス要素作成
    this.context = this.canvas.getContext('2d');     // キャンバスのコンテキスト取得
  }

  // フォントのロードとテキストの描画を処理
  load() {
    if (this.fontUrl) {
      this.loadWebFont(this.fontUrl).then(() => {
        this.initCanvas();
        this.renderText();
        this.completeFunc();
      }).catch(() => {
        console.error("Failed to load the font.");
        this.completeFunc();
      });
    } else {
      this.initCanvas();
      this.renderText();
      this.completeFunc();
    }
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
    this.context.textBaseline = 'hanging';
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

  // フォントをWebから非同期でロード
  loadWebFont(fontUrl, fontFamily) {
    return new Promise((resolve, reject) => {
      // Webフォントを読み込むための<link>タグを作成
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      document.fonts.load(`1em ${fontFamily}`).then(() => {
        resolve();
      }).catch((e) => {
        reject(e);
      });
    });
  }

  // テキストをキャンバスに描画
  renderText() {
    let y = 2;
    for (const text of this.texts) {
      this.context.font = this.fontText;
      this.context.fillText(text, 0, y);
      y += this.getTextSize(text)[1];
    }
  }
}