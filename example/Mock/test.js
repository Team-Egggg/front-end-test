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

async function onClick(auth, event, handleApi) {
  if (!auth) return 'auth null';
  const result = await handleApi.add(event.text);
  return result;
}

test('auth값이 true일때만 add가 가능하다', async () => {
  const todoListStub = new TodoListStub();
  const result1 = await onClick(true, { text: 'test' }, todoListStub);
  const result2 = await onClick(false, { text: 'test' }, todoListStub);
  expect(result1).toEqual({ id: 0, text: 'test' });
  expect(result2).not.toEqual({ id: 0, text: 'test' });
});

class TodoListMock {
  add = jest.fn();

  remove = jest.fn();

  update = jest.fn();

  getList = jest.fn();
}

test('auth값이 true일때만 add함수가 호출된다.', () => {
  const todoListMock = new TodoListMock();
  onClick(false, {}, todoListMock);
  expect(todoListMock.add.mock.calls.length).toBe(0);
  onClick(true, {}, todoListMock);
  expect(todoListMock.add.mock.calls.length).toBe(1);
  onClick(true, {}, todoListMock);
  expect(todoListMock.add.mock.calls.length).toBe(2);
});

const mockFn = jest.fn((x) => x + 1);

test('mockFn함수의 테스트 코드', () => {
  mockFn(1);
  mockFn(2, 2, 3);
  mockFn(3);
  expect(mockFn.mock.calls.length).toBe(3);
  expect(mockFn.mock.calls[1][0]).toBe(2);
  expect(mockFn.mock.results[0].value).toBe(2);
});

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
test('api를 통해서 유저의 데이터를 받아오는데 성공하면 state에 유저 데이터를 저장한다.', async () => {
  const mockResult = { data: { name: 'mario' } };
  axios.get.mockResolvedValue(mockResult);
  await onLogin('qwd8u2138u');
  expect(state.user.name).toBe('mario');
});
