const max = 256;
const min = 1;

const Generator = {
  base62: (l) => {
    let length = parseInt(max / 2, 10);

    if (typeof l === 'number' && l >= min && l <= max) {
      length = l;
    }

    const gb62 = (n) => {
      let base62 = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      while (base62.length < n) {
        base62 += `${possible.charAt(Math.floor(Math.random() * possible.length))}`;
      }
      return base62.slice(0, n);
    };

    return gb62(length);
  },
};

module.exports = Generator;
