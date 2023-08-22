function calculateMMC(a, b) {
  let rest, x, y;
  x = a;
  y = b;
  while (rest != 0) {
    rest = x % y;
    x = y;
    y = rest;
  }
  return (a * b) / x;
}

module.exports = calculateMMC;
