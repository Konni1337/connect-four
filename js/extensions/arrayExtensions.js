Array.prototype.isEmpty = function () {
  return this.length === 0
};

Array.prototype.last = function () {
  if (this.length === 0) return null;
  return this[this.length - 1];
};
