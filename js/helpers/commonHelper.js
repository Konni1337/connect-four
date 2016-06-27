export const flatten = arr => arr.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

export const times = n => f => (g => g(g)(0))(
  g => i => {
    if (i === n) return;
    f(i);
    g(g)(i + 1);
  }
);

export const any = (arr, func) => arr.filter(elem => func(elem)).length > 0;

export const getRandomIndex = arr => Math.floor(Math.random() * arr.length);

export const getRandomElement = arr => arr[getRandomIndex(arr)];

export const removeRandomElement = arr => arr.splice(getRandomIndex(arr), 1)[0];

export const removeRandomElements = (arr, count) => {
  let elements = [];
  times(count)(() => {
    elements.push(removeRandomElement(arr))
  });
  return elements;
};
