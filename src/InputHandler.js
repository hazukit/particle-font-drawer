// マウスタッチなどのイベントを扱うクラス
export class InputHandler {
  constructor(canvas, onMove, onDown, onUp, onLeave) {
    this.canvas = canvas;
    this.onMove = onMove;  // 移動イベント時のコールバック
    this.onDown = onDown;  // ダウンイベント時のコールバック
    this.onUp = onUp;      // アップイベント時のコールバック
    this.onLeave = onLeave;  // キャンバス外に出たときのコールバック
    
    this.scale = this.getCanvasScale(this.canvas);
    this.setupEvents();  // イベントのセットアップ
    
    // ResizeObserverでキャンバスのリサイズを監視
    const resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
    });
    resizeObserver.observe(this.canvas);  // キャンバスのサイズ変更を監視
  }

  // イベントのセットアップ
  setupEvents() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      // タッチイベントの追加
      this.canvas.addEventListener('touchmove', this.handleMove.bind(this), { passive: true });
      this.canvas.addEventListener('touchstart', this.handleDown.bind(this), { passive: true });
      this.canvas.addEventListener('touchend', this.handleUpAndLeave.bind(this), { passive: true });
      this.canvas.addEventListener('touchcancel', this.handleLeave.bind(this), { passive: true });
    } else {
      // マウスイベントの追加
      this.canvas.addEventListener('mousemove', this.handleMove.bind(this), false);
      this.canvas.addEventListener('mousedown', this.handleDown.bind(this), false);
      this.canvas.addEventListener('mouseup', this.handleUp.bind(this), false);
      this.canvas.addEventListener('mouseout', this.handleLeave.bind(this), false);
    }
  }

  // キャンパスのスケールを取得
  getCanvasScale(canvas) {
    const rect = canvas.getBoundingClientRect();  // キャンバスのCSSでのサイズ
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { scaleX, scaleY };
  }

  // キャンバスのリサイズイベント
  resizeCanvas(canvas) {
    this.scale = this.getCanvasScale(this.canvas);
  }

  // マウス・タッチの位置取得と移動イベント
  handleMove(evt) {
    if (this.onMove) {
      const pos = this.getEventPosition(evt);
      this.onMove(pos.x * this.scale.scaleX, pos.y * this.scale.scaleY);
    }
  }

  // マウス・タッチのダウンイベント
  handleDown(evt) {
    const pos = this.getEventPosition(evt);
    if (this.onDown) {
      this.onDown(pos.x * this.scale.scaleX, pos.y * this.scale.scaleY);
    }
  }

  // マウスのアップイベント
  handleUp(evt) {
    if (this.onUp) {
      this.onUp();
    }
  }
  
  // タッチアップにonUpとonLeaveを呼び出す
  handleUpAndLeave(evt) {
    if (this.onUp) {
      this.onUp();
    }
    if (this.onLeave) {
      this.onLeave();
    }
  }

  // マウス・タッチがキャンバス外に出たとき
  handleLeave(evt) {
    if (this.onLeave) {
      this.onLeave();
    }
  }

  // イベントの位置（マウス・タッチ）を取得
  getEventPosition(evt) {
    const rect = this.canvas.getBoundingClientRect();
    let x, y;

    if (evt.touches && evt.touches.length > 0) {
      // タッチイベント
      x = evt.touches[0].clientX - rect.left;
      y = evt.touches[0].clientY - rect.top;
    } else {
      // マウスイベント
      x = evt.clientX - rect.left;
      y = evt.clientY - rect.top;
    }

    return { x, y };
  }
}