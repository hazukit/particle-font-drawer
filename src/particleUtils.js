// 色変換や画像のピクセルデータの取得など、パーティクル関連のユーティリティ
export const particleUtils = {
  common: {
    // RGBからHEXに変換
    rgbToHex(r, g, b) {
      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    // HEXからRGBに変換
    hexToRgb(hex) {
      const bigint = parseInt(hex, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
        a: 255
      };
    },

    // RGBAからHEXに変換
    rgbaToHex(r, g, b, a) {
      let num = ((r << 24) + (g << 16) + (b << 8) + a);
      if (num < 0) num = 0xFFFFFFFF + num + 1;
      return num.toString(16).padStart(8, '0');  // 8桁のHEXに変換
    },

    // HEXからRGBAに変換
    hexToRgba(hex) {
      const bigint = parseInt(hex, 16);
      return {
        r: (bigint >> 24) & 255,
        g: (bigint >> 16) & 255,
        b: (bigint >> 8) & 255,
        a: bigint & 255
      };
    },

    // カラーをHEXに変換 (rgbaとrgbに対応)
    colorToHex(color) {
      if (color.charAt(0) === '#') color = color.substr(1);
      return color.length === 8 ? this.hexToRgba(color) : this.hexToRgb(color);
    },

    // 画像データを取得 (Promiseで非同期処理)
    getImageBytes(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          resolve(imageData);
        };
        img.onerror = reject;
      });
    },
    
    // フォントサイズを取得
    getFontSize(fontText) {
      const fontSize = parseInt(fontText.match(/\d+px/)[0], 10);
      return fontSize;
    }
  }
};