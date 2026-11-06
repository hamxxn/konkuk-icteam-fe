/**
 * 목록에서 같은 값을 가진 항목은 처음 나온 것 하나만 남깁니다. 순서는 그대로입니다.
 * @param items 항목 목록
 * @param getKey 같은 항목인지 가를 값을 꺼내는 함수
 * @returns 겹치지 않는 항목 목록
 * @example removeDuplicatesBy([{ userId: 1 }, { userId: 1 }, { userId: 2 }], ({ userId }) => userId); // [{ userId: 1 }, { userId: 2 }]
 */
export const removeDuplicatesBy = <Item, Key>(items: Item[], getKey: (item: Item) => Key) =>
  items.filter(
    (item, index) => items.findIndex((other) => getKey(other) === getKey(item)) === index,
  );
