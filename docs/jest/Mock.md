출처 : [jest 공식문서/mock](https://jestjs.io/docs/mock-functions)
# 테스트 더블
테스트더블은 실제 환경에서 테스트하기 어려울때 실제 대상을 대신해서 테스트 할수 있도록 도와주는 객체입니다.

```javascript
class TodoList {
  async add(text) {
    const result = await fetch(`/addItem/${text}`);
    return result;
  }

  async update(id, text) {
    const result = await fetch(`/updateItem/${id}`, {
      text,
    });
    return result;
  }

  async remove(id) {
    const result = await fetch(`/removeItem/${id}`);
    return result;
  }

  async getList() {
    const result = await fetch('/getList');
    return result;
  }
}
```
투두리스트를 만들때 api와 통신을 해주는 클래스가 있다고 할때 테스트를 할때 해당 클래스를 바로 사용하면 불필요한
api 요청을 보내서 서버에 부하가 커질 수 있습니다.
이럴경우에는 api요청을 보내는 테스트를 따로 분리하고 해당 클래스와 메서드들을 테스트 더블로 만들어서 테스트를 진행합니다.

## Stub, Mock
테스트 더블에는 다양한 종류가 있는데  Stub과 Mock이 뭔지에 대해 알아보겠습니다.
테스트 더블을 어떻게 구현하는지에 대한 여러가지 방법이 있습니다. 우선 Stub을 이용한 테스트 더블을 구현해보겠습니다.

### Stub
```javascript
const sleep = (time) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

class TodoListStub {
  async add(text) {
    await sleep(1000);
    return { id: 0, text };
  }

  async remove(id) {
    await sleep(1000);
    return true;
  }

  async update(id) {
    await sleep(1000);
    return true;
  }

  async getList() {
    await sleep(1000);
    return [{ id: 0, text: 'test1' }, { id: 1, text: 'test2' }];
  }
}
```
실제 api 서버역할을 해주는 가짜 객체를 만들었습니다. 가짜 객체는 미리 준비된 값을 반환하도록 되어있고
실제 api서버처럼 시간이 조금 지연되도록 sleep함수를 만들어놓았습니다.
```javascript
async function onClick(auth, event, handleApi) {
    if (!auth) return 'auth null';
    const result = await handleApi.add(event.text);
    return result;
}

function Button(){
    const [auth,setAuth] = useState(false);
    const onClickAdd = ((e)=>onClick(auth,e,todoList))
    return (
        <button onClick={onClickAdd}>add</button>  
    )
}
```
대략적으로 위와같은 형태의 버튼 컴포넌트에 들어가는 함수인 onClick함수를 테스트 한다고 가정을 하고 진행을 하겠습니다. 실제 로직과 최대한 비슷하게 하면서
개념을 설명하다보니 조금 이상한 로직이 있을 수 있으니 그런 점은 감안해서 봐주시면 감사하겠습니다.

우선 onClick함수에 auth인자로 true와 false를 넣어서 정말 true일때만 api를 호출해서 값을 받아오는지 확인해보겠습니다.
```javascript
test(('auth값이 true일때만 add가 가능하다'), async () => {
  const todoListStub = new TodoListStub();
  const result1 = await onClick(true, { text: 'test' }, todoListStub);
  const result2 = await onClick(false, { text: 'test' }, todoListStub);
  expect(result1).toEqual({ id: 0, text: 'test' });
  expect(result2).not.toEqual({ id: 0, text: 'test' });
});
```
실제 todoList가 아닌 stub방식으로 만든 테스트 더블으로 넣어줄 todoListStub을 만들었습니다. 그리고 해당 함수를 콜백을 전달해서 값을 받아온뒤에
그 값이 우리가 원하는 값이 나오는지를 확인해보면 실제로 동작이 잘되는 것을 볼 수 있습니다.


위의 코드처럼 미리 준비된 값을 이용해서 테스트 더블을 구현하는 방식을 stub이라고 합니다. 
### Mock
onClick함수에서 확인해야 될것은 onClick함수가 인자로 넣은 callback함수를 auth에 따라 분기처리가 되어서 실행이 되는지만 확인하면 간단해집니다.
그래서 jest에서는 Mock 함수를 지원하고 있습니다. Mock함수는 미리 준비된 데이터를 이용하는것이 아니라 호출이 되는지 되면 몇번 호출되는지 호출되었을때
인자는 어떤 건지등 목표로 하는 함수가 제대로 실행되어지는 확인하는 행동검증입니다.

그럼 Mock 함수를 이용해서 onClick함수의 테스트 코드를 작성해보겠습니다.
```javascript
class TodoListMock {
  add = jest.fn();

  remove = jest.fn();

  update = jest.fn();

  getList = jest.fn();
}

test.only('auth값이 true일때만 add함수가 호출된다.', () => {
  const todoListMock = new TodoListMock();
  onClick(false, {}, todoListMock);
  expect(todoListMock.add.mock.calls.length).toBe(0);
  onClick(true, {}, todoListMock);
  expect(todoListMock.add.mock.calls.length).toBe(1);
  onClick(true, {}, todoListMock);
  expect(todoListMock.add.mock.calls.length).toBe(2);
});
```
jest.fn()을 통해서 함수를 반환받으면 해당 함수는 자신이 호출될때마다 인자와 반환값을 저장하고 있습니다.
그렇기 때문에 호출된 인자를 저장한 길이를 몇번 호출되었는지를 알 수 있습니다.
# Jest Mock
이제 본격적으로 jest를 사용해서 실제 로직을 대신할 테스트 더블을 어떻게 만드는지 알아보겠습니다. 
>실제로 mock과 stub의 구분이 명확하지 않기 때문에 위에는 그냥 이런게 있구나 라는 생각으로 가볍게 읽고
> 지금부터는 mock과 stub의 구별 없이 그냥 mock이라고 하겠습니다.

## jest.fn()
jest.fn 함수를 이용해서 Mock을 만들 수 있고 만드는 방법은 다음과 같습니다.
```javascript
const mockFn = jest.fn((x) => x + 1);
```
jest.fn의 인자로 콜백함수를 인자로 넣으면 해당 콜백함수에 mock이라는 프로퍼티를 붙여서 mock 함수를 반환해줍니다.
이렇게 만들어진 함수는 mock이라는 프로퍼티를 통해서 다양한 것들을 테스트를 할 수 있습니다.
```javascript
test.only('mockFn함수의 테스트 코드', () => {
  mockFn(1);
  mockFn(2, 2, 3);
  mockFn(3);
  console.log(mockFn.mock.calls); 
  console.log(mockFn.mock.results);
});
```
mock은 calls와 results 두가지 프로퍼티를 가지고 있고 해당 프로퍼티는 함수가 실행될때마다 들어온 인자와 
반환된 값을 저장합니다.
출력값을 보면 다음과 같습니다.
```javascript
  mockFn.mock.calls
    [ [ 1 ], [ 2, 2, 3 ], [ 3 ] ]

  mockFn.mock.results
    [
      { type: 'return', value: 2 },
      { type: 'return', value: 3 },
      { type: 'return', value: 4 }
    ]
```
이것을 이용해서 테스트하면 다음과 같이 테스트 할 수 있습니다.
```javascript
test.only('mockFn함수의 테스트 코드', () => {
  mockFn(1);
  mockFn(2, 2, 3);
  mockFn(3);
  expect(mockFn.mock.calls.length).toBe(3);
  expect(mockFn.mock.calls[1][0]).toBe(2);
  expect(mockFn.mock.results[0].value).toBe(2);
});
```
총 3번 호출이 되었고 2번째로 호출되었을때 첫번째 인자는 2이고 첫번째로 호출되었을때 반환한 값은 아까 jest.fn함수에
넣었던 함수가 그대로 실행되면서 2가 나옵니다.
이것외에도 mock.instance, mock.context, mock.lastCall등 다양한 것들이 있으니
더 알고 싶으신 분들은 jest 공식문서에서 확인하면 됩니다.

## API Mock 만들기
jest에서는 두가지 방법으로 mock을 만들 수 있습니다. 첫번째는 위에서 만들어보았던 실제 함수대신에
mock함수를 callback 형식으로 넘겨주는 방식이 있습니다.
이런 방식은 모든 코드가 callback함수를 넘겨받는 코드가 되어야 테스트가 가능하다는 단점이있습니다.

또다른 방법은 아래와같이 이미 있는 모듈을 mock으로 변경시키는 방법이 있습니다.
```javascript
const axios = require('axios');

jest.mock('axios');

async function login(token) {
    const result = await axios.get(token);
    return result.data;
}

const state = {
    user: null,
};

async function onLogin(token) {
    const userData = await login(token);
    if (userData) {
        state.user = userData;
    }
}

test.only('api를 통해서 유저의 데이터를 받아오는데 성공하면 state에 유저 데이터를 저장한다.', async () => {
    const mockResult = { data: { name: 'mario' } };
    axios.get.mockResolvedValue(mockResult);
    await onLogin('qwd8u2138u');
    await onLogin('qwd8u2138u');
    expect(state.user.name).toBe('mario');
});
```
axios라는 라이브러리를 이용해서 만든 login함수는 토큰을 서버로 보내서 유저정보를 받아오는
함수입니다. 그리고 onLogin함수는 login함수로 받은 유저정보를 state에 저장하는 역할을 합니다.
이때 onLogin함수에 대한 테스트를 하고 싶을때 실제로 서버에 요청을 보내거나 callback함수로
넣어주는 방법이 아닌 axios 모듈자체를 변경시켜서 테스트하는 코드입니다.

jest.mock에 원하는 모듈의 path를 넣어줍니다. axios는 package.json으로 관리되기 때문에
경로없이 해당 패키지 이름만 넣어주어도 됩니다. 그리고 axios.get.mockResolvedValue를 이용해서
미리 준비한 가짜 데이터를 넣어두면 axios.get을 실행했을때 넣어두었던 가짜 데이터를 반환합니다.

### API MOCK 만들기 심화
테스트 하고자 하는 함수내부에 api를 여러번 호출하는데 각각 그 결과값이 달라야 할때는 어떻게 해야 할까요?
이런 상황에서는 단순히 결과값을 미리 입력하는 방법으로는 테스트를 진행하기가 힘듭니다.

그래서 직접 더 자세하게 결과값을 핸들링 할 수 있는 API MOCK을 만들어 주겠습니다.
```javascript
const axios = require('axios');

async function login(token) {
  const result = await axios.get(token);
  return result.data;
}

const state = {
  user: null,
};

async function onLogin(token) {
  const userData = await login(token);
  if (userData) {
    state.user = userData;
  }
}
jest.mock('axios');

test.only('api를 통해서 유저의 데이터를 받아오는데 성공하면 state에 유저 데이터를 저장한다.', async () => {
  await onLogin('mario');
  expect(state.user.name).toBe('mario');
  await onLogin('tom');
  expect(state.user.name).toBe('tom');
});

```
기존에 작성했던 테스트 코드를 위와 같이 변경을 하겠습니다. onLogin함수에서 받은 url 인자를 그대로 반환하는 가짜 axios를
만들어야합니다.

jest에서는 `__mocks__`라는 폴더 내부에 있는 파일들을 mock 모듈로 인식을 합니다. 그렇기 때문에 jest.mock을 진짜 axios는 잠시 넣어두고 대신 동작할 axios를 `__mocks__`폴더 내부에서 찾을 겁니다.

그러면 해당 폴더 안에 `axios.js` 파일을 만들어주고 다음과 같이 코드를 작성하겠습니다.
```javascript
function axioMock(url) {
    return { data: { name: url } }
}

module.exports = { get :axioMock };
```
그리고 실행을 해보면 테스트가 성공적으로 되는 것을 볼 수 있습니다. 미리 mock데이터를 준비해서 들어온 인자에 따라 맵핑된
mock데이터를 반환하거나 실제 서버의 로직을 간단하게 구현하여 서버와 강하기 결합되어있는 코드를 좀 더 독립적인 환경에서
테스트를 진행 할 수 있습니다.