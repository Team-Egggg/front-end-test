[출처 : jest 공식문서/ setup-teardown](https://jestjs.io/docs/setup-teardown)
# 테스트 분류하기
<br/>

테스트 코드를 작성하다보면 각각 독립된 테스트가 아닌 어떤 테스트들은 같이 
묶여야되고 어떤 테스트는 분리가 되어야합니다. 에를 들어서 다음과 같은
상황에는 테스트가 하나로 묶여야되는 상황입니다.
```javascript
class TestClass{
    static test1(){
        return 1
    }
    static test2(){
        return 2
    }
    static test3(){
        return 3
    }
}

test('TestClass.test1은 1을 반환한다.',()=>{
    expect(TestClass.test1()).toBe(1);
})

test('TestClass.test2은 2을 반환한다.',()=>{
    expect(TestClass.test2()).toBe(2);
})
test('TestClass.test3은 3을 반환한다.',()=>{
    expect(TestClass.test3()).toBe(3);
})
```
하나의 클래스를 테스트할때는 메서드가 클래스로 묶여있는 것처럼 테스트도
묶여있는게 보기 좋을 것 같습니다.
또 다른 예시로는 같은 테스트지만 다른 값을 각각 넣어서 확인할때입니다.
```javascript
function add(a,b){
    if(a === 0 || b === 0) return 0;
    return a+b;
}

test('add함수에 인자중 하나가 0일 경우 0을 반환한다.',()=>{
    expect(add(3,0)).toBe(0)
    expect(add(0,50)).toBe(0)
})

test('add함수에 0이 아닌 두 수가 들어갈 경우 두수의 합을 반환한다.',()=>{
    expect(add(1,5)).toBe(6);
    expect(add(50,2)).toBe(52);
})
```
위의 코드들과 같이 테스트를 분류하고자 할때 사용하는 방법이 있습니다.
## describe
describe는 연관된 테스트를 블록레벨로 묶어주어서 분류해주는 역할을 합니다.
여기서 블록레벨이라는 것은 자바스크립트의 스코프라고 생각을 하시면되고 조금 있다가
다른 함수를 알아볼때 좀 더 자세히 설명하겠습니다.
<br/>
그럼 위에 코드를 describe를 이용해서 리팩토링을 해보겠습니다.
```javascript
describe('TestClass 메서드 테스트',()=>{
    test('test1 메서드는 1을 반환한다.',()=>{
        expect(TestClass.test1()).toBe(1);
    })

    test('test2 메서드는 2을 반환한다.',()=>{
        expect(TestClass.test2()).toBe(2);
    })
    test('test3 메서드는 3을 반환한다.',()=>{
        expect(TestClass.test3()).toBe(3);
    })
})

describe('add 함수 테스트',()=>{
    test('인자중 하나가 0일 경우 0을 반환한다.',()=>{
        expect(add(3,0)).toBe(0)
        expect(add(0,50)).toBe(0)
    })

    test('0이 아닌 두 수가 들어갈 경우 두수의 합을 반환한다.',()=>{
        expect(add(1,5)).toBe(6);
        expect(add(50,2)).toBe(52);
    })
})
```
이렇게 describe로 묶어주면 콘솔에는 어떤값이 찍혀있을까요?
```text
 PASS  example/setupTearDown/test.js
  TestClass 메서드 테스트
    ✓ test1 메서드는 1을 반환한다. (1 ms)
    ✓ test2 메서드는 2을 반환한다.
    ✓ test3 메서드는 3을 반환한다.
  add 함수 테스트
    ✓ 인자중 하나가 0일 경우 0을 반환한다.
    ✓ 0이 아닌 두 수가 들어갈 경우 두수의 합을 반환한다.
```
테스트 코드를 트리구조로 인덴트를 적용해서 보여줍니다. 그렇기 때문에
테스트 코드의 설명을 넣을때 중복되었던 특정 함수에대한 텍스트를 
생략할 수 있는 장점도 있습니다.
# 테스트 setup
테스트 setup은 테스트를 진행하기전에 혹은 진행한 후에 어떤 동작을해서
테스트 환경을 초기화 해주거나 셋팅해주는 기능이 필요할때 사용합니다.
테스트 setup에는 아래와 같은 함수듫이 있습니다.
* beforeEach
* beforeAll
* afterEach
* afterAll

함수의 이름을 보면 각각 어떤 역할을 하는지 볼 수 있습니다.
beforeEach는 매번 테스트를 진행하기전에 실행이되고 
beforeAll은 모든 테스트가 진행되고 난뒤에 실행됩니다.
after도 마찬가지로 진행되기 때문에 따로 설명은 드리지 않겠습니다.
그렇다면 이런것들을 어떤 경우에 활용을 할까요?
<br/>
보통 특정조건에서 테스트를 진행해야할때 조건을 셋팅해줄때 많이 사용됩니다. 아직 많이
사용은 안해봤지만 보통 e2e테스트를 진행할때는 거의 무조건 사용했던것 같습니다.
> e2e 테스트는 end to end 테스트로 직접 유저의 입장에서 인터렉션을 하면서 진행하는 테스트입니다.

```javascript
// 아직 cypress(e2e 테스트 라이브러리)를 배우지 않았기 때문에 의사코드로 작성할게요
beforeAll(()=>{
    url로 이동
})
... 테스팅
```
위에 코드처럼 테스트를 하기위해 해당 url로 접근해야하는 상황에서 많이 사용됩니다.
## scope
describe를 이용하면 해당 setup 테스트 함수들의 스코프를 지정할수 있습니다.
```javascript
const state1 = {
    test : false,
}
const state2 = {
    test : false,
}

describe('state1 테스트',()=>{
    beforeAll(()=>{
        state1.test = true;
    })
    test('test의 값은 true 여야한다.',()=>{
        expect(state1.test).toBeTruthy();
    })
})

describe('state2 테스트',()=>{
    beforeAll(()=>{
        state2.test = true;
    })
    test('test의 값은 true 여야한다.',()=>{
        expect(state2.test).toBeTruthy();
    })
})
```
위의 코드에서 beforeAll이 동작을 할때 기준이 되는 테스트는 beforeAll함수가
위치한 describe 스코프에 따릅니다. 즉 `state1의 테스트`의 describe안에있는
beforeAll함수는 같은 스코프에 있는 `state1의 테스트` 내부에 있는 test에만
반응을 합니다.
```javascript
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```
위의 코드는 jest 공식문서에서 beforeAll같은 함수들의 스코프와 실행시점에 대해 설명하기위한
예시 코드입니다.
먼저 describe 외부에 있는 beforeAll,afterAll과 같은 함수들은 describe 외부의 test함수와
describe 내부의 test함수 모두를 바라보고 있습니다.
그리고 describe 내부에 있는 함수들은 내부에 있는 test 하나만 바라보고 있습니다.
그렇기 때문에 실행순서는 다음과 같습니다.
> 1. 전역 스코프 내에 있는 테스트를 통틀어서 `1 - test`실행 되기 전 `1 - beforeAll` 실행
> 2. 전역 스코프 내에 있는 테스트들이 각각 실행될때 `1 - test`실행 되기 전 `1 - beforeEach` 실행
> 3. `1 - test`실행
> 4. `1 - test`실행 후 `1 - afterEach` 실행
> 5. describe 내부로 스코프 전환
> 6. describe 스코프 내에 있는 테스트를 통틀어서 `2 - test`실행 되기 전 `2 - beforeAll` 실행
> 7. 전역 스코프 내에 있는 테스트들이 각각 실행될때 `2 - test`실행 되기 전 `1 - beforeEach` 실행
> 8. describe 스코프 내에 테스트들이 각각 실행될때 `2 - test`실행 되기 전 `2 - beforeEach` 실행
> 9. `2 - test`실행
> 10. `2 - test`실행 후 `2 - afterEach` 실행
> 11. `2 - test`실행 후 `1 - afterEach` 실행
> 12. describe 스코프 내에 있는 테스트들이 모두 실행된 후 `2 -afterAll`실행
> 13. 전역 스코프에 있는  테스트들이 모두 실행된 후 `1 -afterAll`실행 

# 테스트 디버깅 꿀팁
```javascript
const promise = new Promise(resolve=>{
    setTimeout(()=>{
        resolve(3)
    },5000);
})

test('오래 걸리는 테스트',async ()=>{
    const result = await promise;
    expect(result).toBe(3);
})

test('문제가 되는 테스트',()=>{
    expect(true).toBe(false);
})
```
테스트는 시간이 지날수록 점점 많아집니다. 이때 특정 안되는 테스트만 진행을 하고싶을때 사용하는
방법이 있습니다. 
jest --watch 옵션을 할수도 있지만 이건 파일별로 나누는 테스트고 한 파일안에 특정 테스트만
진행하고싶을때는 다음과 같이 하면 됩니다.
```javascript
const promise = new Promise(resolve=>{
    setTimeout(()=>{
        resolve(3)
    },5000);
})

test('오래 걸리는 테스트',async ()=>{
    const result = await promise;
    expect(result).toBe(3);
})

test.only('문제가 되는 테스트',()=>{
    expect(true).toBe(true);
})
```
해결을 하고자하는 테스트에 only를 붙일경우 다른테스트를 제외하고 해당 테스트만 실행합니다.
두 코드를 직접 실행을 해보면 위에 코드는 5초정도가 걸려서 테스트 결과가 나오고
밑에 코드는 5초가 걸리는 대신 바로 테스트 결과가 나오는 것을 볼 수 있습니다.
