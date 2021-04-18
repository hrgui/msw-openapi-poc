// Deeply strips a specific key from an object.
//
// `predicate` can be used to discriminate the stripping further,
// by preserving the key's place in the object based on its value.
export function deeplyStripKey(input, keyToStrip, predicate = (a, b) => true) {
  if (typeof input !== "object" || Array.isArray(input) || input === null || !keyToStrip) {
    return input;
  }

  const obj = Object.assign({}, input);

  Object.keys(obj).forEach((k) => {
    if (k === keyToStrip && predicate(obj[k], k)) {
      delete obj[k];
      return;
    }
    obj[k] = deeplyStripKey(obj[k], keyToStrip, predicate);
  });

  return obj;
}

export function isFunc(thing) {
  return typeof thing === "function";
}

export function normalizeArray(arr) {
  if (Array.isArray(arr)) return arr;
  return [arr];
}

export function objectify(thing) {
  if (!isObject(thing)) return {};
  return thing;
}

export function isObject(obj) {
  return !!obj && typeof obj === "object";
}
