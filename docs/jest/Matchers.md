# jest에서 사용할수 있는 매치 함수
> [출처 : jest 공식문서/ Matchers](https://jestjs.io/docs/using-matchers)

jest에는 toBe 뿐만 아니라 여러가지 다양한 테스트를 할수 있는 매치 함수들을 제공합니다.

## expect
expect는 테스트 결과값을 확인할때 사용하는 함수입니다. 해당 함수는 자바스크립트에서
배열이 map,filter 같은 내장함수를 가지고 있는 것처럼 다양한 비교 함수들을 가지고
있습니다.

## toBe
```javascript
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
```
가장 간단하게 사용할 수 있는 매치함수는 toBe입니다. 해당 함수는 말그대로 expect 즉 기대값이
일치하는지를 확인하는 함수입니다. 해당함수는 자바스크립트에서 `===`처럼 동작을 합니다.

## toEqual
```javascript
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
```
toEqual 함수는 toBe와 동일하게 같은지 확인하지만 조금 다른점이 있다면 객체를 비교할때
자주 쓰이며 해당 객체를 깊게 들어가서 비교하는 식으로 동작합니다.
실제 자바스크립트에서 동일한 key,value를 가진 객체를 `===`를 이용해서 비교하면 `false`가 나옵니다.
그 이유는 자바스크립트에 객체,배열등은 모든 값을 저장하는것이 아니라 해당 값이 저장되어있는 메모리 주소를
나타내기 때문에 같은 모양의 객체라도 다른 주소값을 가지고 있으므로 다른 객체로 인식합니다.
이런 이유때문에 해당 객체를 재귀적으로 타고 들어가서 검사를 해주는 것이 toEqual입니다.
## not
```javascript
function noZero(number) {
  if (number === 0) return 1;
  return number;
}

test('-5부터 100까지 숫자를 넣었을때 0이 절대 반환되지 않는다.', () => {
  for (let i = -5; i < 100; i++) {
    expect(noZero(i)).not.toBe(0);
  }
});
```
not 매치함수는 뒤에 오는 매치함수의 결과를 반대로 뒤집어주는 역할을 합니다. 즉 toBe(0)를
통해 얻은 테스트 결과가 true일때는 false, false일때는 true를 반환해줍니다.
예를 들어서 어떤 함수에서 절대 이런값이 반환되면 안되는 경우에 사용됩니다. 
noZero 함수는 어떤 숫자가 들어와도 절대 0을 반환하지 않는 함수여야 된다면 위와 같은
테스트코드로 이를 검증할 수 있습니다.

## 숫자에 관한 Match 함수
### toBeGreaterThan
```javascript
function clamp(target, downLimit, upLimit) {
  return (target < downLimit ? downLimit : target > upLimit ? upLimit : target);
}

test('100,2,4를 넣으면 최대 상한치인 4보다 큰 값을 반환하지 않는다.', () => {
  expect(clamp(100, 2, 4)).not.toBeGreaterThan(4);
});
```
정확하게 나오는 값이 아닌 특정 범위에 대한 테스트를 진행할때 사용되는 toBeGreaterThan 함수는
toBeGreaterThan ,toBeGreaterThanOrEqual, toBeLessThan, toBeLessThanOrEqual
함수 등 다양한 범위를 테스트 할 수 있습니다.
    clamp함수는 특정 값과 최하 경계값, 최상 경계값을 받습니다. 특정값이 범위 내에 있다면
그대로 반환하고 범위를 벗어나면 경계값을 반환하는 함수 입니다. 해당 함수는 lodash에 있는 함수입니다.
not과 결합하여 해당 테스트를 진행하면 4보다 큰값이 절대 반환되지않는지를 확인할 수 있습니다.
### toBeCloseTo
```javascript
test('0.1 + 0.1은 0.2에 가까운 수가 된다.', () => {
  const value = 0.1 + 0.1;
  expect(value).toBeCloseTo(0.2);
});
```
자바스크립트에서 0.1 + 0.1은 0.2가 아니라 0.20000001과 같이 이상한 수가 나오게 됩니다.
이는 이진수에서 0.1이 유한소수가 아닌 무한소수이기때문에 발생을 하게 되는데요. 이를 위해서
해당값이 특정값에 일치하는지를 확인해주는 함수가 toBeCloseTo 함수입니다. 
## toMatch
```javascript
function removeJ(string) {
  return string.replaceAll('j', '');
}
test('"eqwjdfioqjwfqwdji" 문자열을 넣으면 "j"가 모두 제거되어 포함되지 않은 문자열이 반환된다.', () => {
  expect(removeJ('eqwjdfioqjwfqwdji')).not.toMatch(/j/);
});
```
toMatch 함수는 정규표현식을 사용해서 매칭이 되는 값을 찾을때 사용합니다. 위 코드를 보면
어떤 문자열을 넣었을때 j를 모두 삭제해주는 함수가 있습니다. 그래서 j가 포함된 문자열을 넣고
반환되는 문자열에 j가 포함되있지 않는지를 확인하는 테스트를 진행 할 수 있습니다.
## toContain
```javascript
function insertOne(array) {
  array.push(1);
}
test('빈 배열을 넣었을때 해당 배열 내부에 1을 넣어준다.', () => {
  const emptyArray = [];
  insertOne(emptyArray);
  expect(emptyArray).toContain(1);
});

```
toContain은 배열에 특정 값이 들어있는지 확인하는 함수입니다. 위 코드처럼 특정값이 안에있는
것 뿐아니라 filter로 나온 결과값이 원하는 값을 잘 필터링 했는지 사용될때도 유용하게 사용 할 수 있습니다.
## toThrow
```javascript
test('잘못된 JSON정보를 넣을 경우 에러를 발생시킨다.', () => {
  expect(() => {
    JSON.parse("'{'}");
  }).toThrow();
});
```
toThrow는 어떤함수에서 에러를 던지는지를 확인하는 함수입니다. 아래와 같이 try,catch등
오류가 발생했을때 제대로 처리하는지를 확인하는 함수를 만들었는데 그 내부의 함수 제대로
오류를 발생시키는지를 확인할때 사용하면 좋습니다.
```javascript
function test(value){
    if(!value) throw new Error('invalid value');
    return someFn(value);
}
function container(){
    try{
        const result = test(value);
        console.info(result);
    }catch (e){
        console.info('에러가 발생했습니다.')
    }
}
```
