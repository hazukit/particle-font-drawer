// パーティクルシステムの個々のパーティクル（ドット）を表現するためのクラス
export class Dot {
  constructor(x, y, rgba) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.tx = 0;
    this.ty = 0;
    this.rgba = rgba;
    this.damp = 0;
    this.homeForce = 0;
    this.next = null;
  }

  // ドットの初期化
  init() {
    // 必要ならば初期化処理を記述
  }

  // 基準位置の設定
  setBaseLocation(x, y) {
    this.tx = x;
    this.ty = y;
  }
  
  // 位置と速度の更新
  update() {
    // 速度に加速度を加算
    this.vx += this.ax;
    this.vy += this.ay;

    // 速度が非常に小さくなった場合（落ち着いた場合）
    const velocityThreshold = 0.005;  // 速度がこれ以下になったら停止
    if (Math.abs(this.vx) < velocityThreshold && Math.abs(this.vy) < velocityThreshold) {
      // ドットを基準位置に固定
      this.x = this.tx;
      this.y = this.ty;
      this.vx = 0;
      this.vy = 0;
      this.ax = 0;
      this.ay = 0;
      return;  // ここで処理を終了してドットを固定
    }

    // 位置に速度を加算
    this.x += this.vx;
    this.y += this.vy;

    // 加速度をリセット
    this.ax = 0;
    this.ay = 0;
  }
  
  // 与えられた点に基づいて力を加える
  addForce(x, y, radius, scale) {
    const dx = x - this.x;
    const dy = y - this.y;
    let distanceSquared = dx * dx + dy * dy;

    if (distanceSquared < radius * radius) {
      const distance = Math.sqrt(distanceSquared);
      const pct = (distance / radius) - 1;
      this.ax += (dx / distance) * scale * pct;
      this.ay += (dy / distance) * scale * pct;
    }
  }

  // ドットがターゲットの位置に戻るようにする
  seekHome() {
    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    this.ax += dx * this.homeForce;
    this.ay += dy * this.homeForce;
  }

  // 動きを滑らかにするためのダンピングを適用
  addDamping() {
    this.ax += (this.ax - this.vx) * this.damp;
    this.ay += (this.ay - this.vy) * this.damp;
  }
}