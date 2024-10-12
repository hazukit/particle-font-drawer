import { randomNumberCreator } from './randomNumberCreator.js';
import { particleUtils } from './particleUtils.js';
import { FontCanvas } from './FontCanvas.js';
import { Dot } from './Dot.js'; 
import { InputHandler } from './InputHandler.js'; 

// パーティクルでフォントを描画するクラス
export class PirticleFontDrawer {
  constructor(canvasId, text, options = {}) {
    // デフォルトオプション
    const defaultOptions = {
      dotClass: Dot,           // パーティクル（ドット）を生成するクラス
      textColor: '#000000',    // テキストの色
      offsetX: 0,              // テキストの描画位置のXの開始位置
      offsetY: 0,              // テキストの描画位置のYの開始位置
      fontStyles: {},          // フォントのスタイル設定 例: {'font-family': 'Arial', 'font-size': '20px'}
      dampForceRange: [5, 15], // クリックした時に跳ねる力の範囲（パーティクル毎にこの範囲内の乱数が設定される）
      homeForceRange: [3, 9],  // ドットが元の位置に戻る力の範囲
      fontUrl: null,           // Webフォントを読み込むためのURL
      textureUrl: null,        // ドットの色を画像から取得する際のテクスチャ画像のURL
      force: 3,                // 通常時にドットにかかる力
      clickedForce: 200,       // クリックした時にドットにかかる力
      isClickedDamp: true,     // クリック時に跳ねるかどうかのフラグ
      radius: 50,              // マウスによってドットに影響を与える範囲の半径
      firstBound: true         // ドットの生成時にランダムの位置にする
    };

    // オプションをマージ
    Object.assign(this, defaultOptions, options);

    this.canvas = document.getElementById(canvasId); // キャンバスの取得
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.dots = [];
    this.rgba = particleUtils.common.colorToHex(this.textColor);
    this.isMouseDown = false;

    // フォントキャンバスのセットアップ
    const canvasFont = new FontCanvas(text, this.fontStyles, this.fontUrl, () => {
      this.loadFontAndCreateDots(canvasFont);
    });

    canvasFont.load();
  }

  // フォントがロードされた後にドットを生成
  loadFontAndCreateDots(canvasFont) {
    if (this.textureUrl) {
      particleUtils.common.getImageBytes(this.textureUrl).then((imageBytes) => {
        this.createDotsFromCanvasFont(canvasFont, imageBytes);
        this.startAnimation();
      }).catch(() => {
        console.error('Texture loading failed.');
      });
    } else {
      this.createDotsFromCanvasFont(canvasFont, null);
      this.startAnimation();
    }
  }

  // ドットを生成
  createDotsFromCanvasFont(canvasFont, imageBytes) {
    const canvasFontData = canvasFont.context.getImageData(0, 0, canvasFont.width, canvasFont.height);
    const { width: w, height: h } = canvasFont;
    const { offsetX, offsetY, dampForceRange, homeForceRange } = this;

    let prev = null;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const index = (x + y * w) * 4;
        const alpha = canvasFontData.data[index + 3];
        if (alpha > 0) {
          const rgba = this.getRgbColor(imageBytes, x, y, alpha);
          const dot = this.firstBound 
            ? new this.dotClass(randomNumberCreator.randomRange(offsetX, w + offsetX), randomNumberCreator.randomRange(offsetY, h + offsetY), rgba)
            : new this.dotClass(offsetX + x, offsetY + y, rgba);

          dot.init();
          dot.damp = randomNumberCreator.randomRange(dampForceRange[0], dampForceRange[1]) / 100;
          dot.homeForce = randomNumberCreator.randomRange(homeForceRange[0], homeForceRange[1]) / 1000;
          dot.setBaseLocation(offsetX + x, offsetY + y);

          this.dots.push(dot);
          if (prev) prev.next = dot;
          prev = dot;
        }
      }
    }
  }

  // 色データを取得
  getRgbColor(imageBytes, x, y, alpha) {
    if (!imageBytes) {
      return { r: this.rgba.r, g: this.rgba.g, b: this.rgba.b, a: alpha };
    }
    const index = (x + y * imageBytes.width) * 4;
    return {
      r: imageBytes.data[index],
      g: imageBytes.data[index + 1],
      b: imageBytes.data[index + 2],
      a: alpha
    };
  }

  // アニメーションの開始設定
  startAnimation() {
    requestAnimationFrame(this.tick.bind(this));
    const inputHandler = new InputHandler(this.canvas, this.onMouseMove.bind(this), this.onMouseDown.bind(this), null, this.onMouseOut.bind(this));
  }

  // マウスの移動イベント
  onMouseMove(x, y) {
    this.mouseX = x,
    this.mouseY = y;
  }

  // マウスがキャンバス外に出たとき
  onMouseOut() {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  // マウスのクリックイベント
  onMouseDown(x, y) {
    this.mouseX = x,
    this.mouseY = y;
    if (this.isClickedDamp) this.isMouseDown = true;
  }

  // アニメーションの描画ループ
  tick() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const canvasData = this.ctx.getImageData(0, 0, this.width, this.height);
    const force = this.isMouseDown ? this.clickedForce : this.force;
    this.isMouseDown = false;

    this.dots.forEach(dot => {
      dot.addForce(this.mouseX, this.mouseY, this.radius, force);
      dot.seekHome();
      dot.addDamping();
      dot.update();
      this.drawDot(dot, canvasData);
    });

    this.ctx.putImageData(canvasData, 0, 0);
    requestAnimationFrame(this.tick.bind(this));
  }

  // ドットを描画するメソッド
  drawDot(dot, canvasData) {
    const { x, y, rgba } = dot;
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    
    const index = (parseInt(x) + parseInt(y) * this.width) * 4;
    canvasData.data[index] = rgba.r;
    canvasData.data[index + 1] = rgba.g;
    canvasData.data[index + 2] = rgba.b;
    canvasData.data[index + 3] = rgba.a;
  }
}