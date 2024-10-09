// 乱数作成
export const randomNumberCreator = {
  randomRange(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};