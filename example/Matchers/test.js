function multiple(a) {
  return a * 2;
}

test('1을 넣으면 2배인 2를 반환한다.', () => {
  expect(multiple(1)).toBe(2);
});

let id = 0;
function addId(object) {
  id += 1;
  return {
    ...object,
    id,
  };
}

test('어떤 객체를 넣으면 해당 객체의 아이디를 순서대로 부여한다.', () => {
  const object1 = { name: 'object' };
  const object2 = { name: 'object' };
  expect(addId(object1)).toEqual({ name: 'object', id: 1 });
  expect(addId(object2)).toEqual({ name: 'object', id: 2 });
});

function noZero(number) {
  if (number === 0) return 1;
  return number;
}

test('-5부터 100까지 숫자를 넣었을때 0이 절대 반환되지 않는다.', () => {
  for (let i = -5; i < 100; i++) {
    expect(noZero(i)).not.toBe(0);
  }
});

function clamp(target, downLimit, upLimit) {
  return (target < downLimit ? downLimit : target > upLimit ? upLimit : target);
}

test('100,2,4를 넣으면 최대 상한치인 4보다 큰 값을 반환하지 않는다.', () => {
  expect(clamp(100, 2, 4)).not.toBeGreaterThan(4);
});

test('0.1 + 0.1은 0.2에 가까운 수가 된다.', () => {
  const value = 0.1 + 0.1;
  expect(value).toBeCloseTo(0.2);
});

function removeJ(string) {
  return string.replaceAll('j', '');
}
test('"eqwjdfioqjwfqwdji" 문자열을 넣으면 "j"가 모두 제거되어 포함되지 않은 문자열이 반환된다.', () => {
  expect(removeJ('eqwjdfioqjwfqwdji')).not.toMatch(/j/);
});

function insertOne(array) {
  array.push(1);
}
test('빈 배열을 넣었을때 해당 배열 내부에 1을 넣어준다.', () => {
  const emptyArray = [];
  insertOne(emptyArray);
  expect(emptyArray).toContain(1);
});

test('잘못된 JSON정보를 넣을 경우 에러를 발생시킨다.', () => {
  expect(() => {
    JSON.parse("'{'}");
  }).toThrow();
});
