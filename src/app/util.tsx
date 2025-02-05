export const render = (el: Element): string => {
  return el.toString();
};

import Iterator = NodeJS.Iterator;

export const iterSome = <T,>(
  iter: Iterator<T>,
  predicate: (value: T, index: number) => boolean,
): T | null => {
  let i = 0;

  for (const value of iter) {
    if (predicate(value, i)) {
      return value;
    }

    i++;
  }

  return null;
};

export const iterFilter = <T,>(
  iter: Iterator<T>,
  predicate: (value: T, index: number) => boolean,
): T[] => {
  const result: T[] = [];

  let i = 0;

  for (const value of iter) {
    if (predicate(value, i)) {
      result.push(value);
    }

    i++;
  }

  return result;
};
