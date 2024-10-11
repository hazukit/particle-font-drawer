# Particle Font Drawer

フォントをキャンバス上に描画し、それに基づいてパーティクルをレンダリングするシステム。

## 特徴

- HTML5のキャンバス上にパーティクルでテキストを描画
- カスタマイズ可能なフォントやテキストスタイル、パーティクル効果をサポート

## デモページ

デモページはこちらから確認できます: [Particle Font Drawer Demo](https://hazukit.github.io/particle-font-drawer/docs/)

## インストール方法

### 1. GitHubからインストール

GitHubから直接インストールするには、以下のコマンドを実行してください。

```bash
npm install github:hazukit/particle-font-drawer
```
その後、プロジェクト内でインポートして使用します。

```js
import { PirticleFontDrawer } from 'particle-font-drawer';

new PirticleFontDrawer('canvasId', 'Click Here', {
  fontStyles: {'font-family':'Times New Roman', 'font-size': '100px'}
});
```
### 2. ローカルに手動で組み込む

または、次の手順でライブラリを手動でプロジェクトに追加できます。

1.	GitHubからリポジトリをダウンロードまたはクローンします。
2.	ソースファイル（例: PirticleFontDrawer.js）をプロジェクトの適切なディレクトリ（例: src/lib/particle-font-drawer/）にコピーします。
3.	次のように、ライブラリをインポートして使用します。
```js
import { PirticleFontDrawer } from './lib/particle-font-drawer/PirticleFontDrawer.js';

new PirticleFontDrawer('canvasId', 'Click Here', {
  fontStyles: {'font-family':'Times New Roman', 'font-size': '100px'}
});
```

### 使用例

particle-font-drawer ライブラリの基本的な使用例は以下の通りです。
```js
<canvas id="canvasId" width="800" height="200"></canvas>
<script>
import { PirticleFontDrawer } from './lib/particle-font-drawer/PirticleFontDrawer.js';

new PirticleFontDrawer('canvasId', 'Click Here', {
  fontStyles: {'font-family':'Times New Roman', 'font-size': '100px'}
});
</script>
```

### オプション

PirticleFontDrawer の動作は以下のオプションを使ってカスタマイズできます。

	•	fontStyles: フォントのスタイルの設定
	•	textColor: パーティクルの色を設定
	•	radius: パーティクル効果の範囲を設定
	•	force: パーティクルの動きの強さを設定
	•	clickedForce: クリックした時のパーティクルの動きの強さを設定
	•	isClickedDamp: キャンバス上をクリックした時にダンピングを有効にするかどうか
	•	firstBound：ドットの生成時にランダムの位置に設置
	•	textureUrl：ドットの色を画像から取得する際のテクスチャ画像のURL

