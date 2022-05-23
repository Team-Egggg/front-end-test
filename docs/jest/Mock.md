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

