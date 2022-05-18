# jest 맛보기

시작하기전에 필요한  기본적인 환경설정을 먼저 하겠습니다.
## 프로젝트 초기화

```javascript
npm init -y
```
## jest 설치
### yarn
```javascript
yarn add jest
```
### npm
```javascript
npm install jest
```
## TDD 이해하기
요즘 유행하는 TDD를 이용해서 개발을 한번 해보겠습니다. 시간관련된 로직을 작성해야하는 상황이 있다고 가정 해보겠습니다.
TDD를 하기위해서는 무엇보다 명확한 요구사항과 로직을 이해합니다.
### 요구사항
* 초(number)를 입력하면 분 과 초로 이루어진 문자열을 반환한다.
* 분으로 나누어 떨어지는 경우에는 00으로 초를 표기한다.
<br/>

요구사항을 모두 작성했다면 이를 바탕으로 테스트 케이스를 생각해보겠습니다.
### 테스트 케이스
1. 0이 들어오면 "0분 00초"를 반환한다.
2. 59가 들어오면 "0분 59초"를 반환한다.
3. 360이 들어오면 "6분 00초"를 반환한다.
4. 79가 들어오면 "1분 16초"를 반환한다.
<br/>

테스트 케이스까지 작성을 했으니 테스트 코드를 먼저 작성해보겠습니다.
### 테스트 코드 작성
테스트 코드를 작성하기 전에 해당 테스트에 들어갈 함수를 만들어줍니다.
```javascript
fnuction parseTime(){
    return 0
};

module.exports = parseTime;
```
아직까지는 아무 로직이 들어있지 않아도 괜찮습니다. 앞으로 테스트를 진행하면서 점점 발전된 형태로 어떻게 진행되는지를 보여드리겠습니다. 
```javascript
const parseTime = require('./parseTime.js');

test('0이 들어오면 "0분 00초"를 반환한다.', () => {
    expect(parseTime(0)).toBe('0분 00초');
});
test('59가 들어오면 "0분 59초"를 반환한다.', () => {
    expect(parseTime(59)).toBe('0분 59초');
});
test('360이 들어오면 "6분 00초"를 반환한다.', () => {
    expect(parseTime(360)).toBe('6분 00초');
});
test('79가 들어오면 "1분 19초"를 반환한다.', () => {
    expect(parseTime(79)).toBe('1분 19초');
});
```
아까 작성했던 테스트 케이스를 코드로 그대로 옮겨넣었습니다. test와 expect, toBe 함수 기본적으로 jest를 실행하면 등록되있던
함수가 실행되기 때문에 따로 import를 할 필요는 없습니다.

### 테스트 코드 실행
```
npx jest
```

```
FAIL  ./test.js
  ✕ 0이 들어오면 "0분 00초"를 반환한다. (1 ms)
  ✕ 59가 들어오면 "0분 59초"를 반환한다.
  ✕ 360이 들어오면 "6분 00초"를 반환한다.
  ✕ 79가 들어오면 "1분 19초"를 반환한다.
  ...
```
이런 콘솔이 터미널에 찍혀있을겁니다. 이제 저 테스트를 모두 통과시키는 함수로 변경을 해보겠습니다.
### 리팩토링
함수를 리팩토링하기 전에 매번 `npx jest`를 하는것은 불편하니 코드를 저장하면 자동으로 테스트를 진행하도록 만들어 보겠습니다.
```
jest --watch parseTime.js
```
```javascript
function parseTime(time){
    if(time === 0) return "0분 00초";
    if(time === 59) return "0분 59초";
    if(time === 360) return "6분 00초";
    if(time === 79) return "1분 16초";
}
```
저장을 누르면 테스트가 모두 통과 한 것을 볼 수 있습니다. jest는 기본적으로 입력값을 넣은 뒤에 결과값과 미리 준비해놓은 예상결과값이
같은지를 확인하는 방식으로 이루어집니다. 그렇기 때문에 테스트 케이스는 기본적인 동작과 엣지케이스를 적절히 섞어서 만들어주어야합니다.
위에 예시는 jest의 동작 원리를 설명하기 위해 작성한 코드이므로 그냥 잊어버려주시면 좋을것 같습니다.
```javascript
function parseTime(time){
    const minute = Math.floor(time / 60);
    const second = time % 60;
    return `${minute}분 ${second}초`
}
```
2개의 케이스만 제대로 통과하고 나머지는 통과하지 못했습니다. 
```javascript
  ● 0이 들어오면 "0분 00초"를 반환한다.

expect(received).toBe(expected) // Object.is equality

Expected: "0분 00초"
Received: "0분 0초"
```
통과하지 못한 케이스를 하나 들여다보면 Expected 와 Received를 보여줍니다. 여기서 예상 결과값 과 실제 반환된 값을 비교해보면
어떤 로직을 추가해 주어야할지 알 수 있습니다. 0초일때는 00초로 반환해주는 로직을 추가해주겠습니다.
```javascript
function parseTime(time){
    const minute = Math.floor(time / 60);
    const second = (time % 60) || '00';
    return `${minute}분 ${second}초`
}
```
이렇게 코드를 작성해주면 모든 테스트가 통과가 됩니다.
