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

test(('auth값이 true일때만 add가 가능하다'), async () => {
  const todoListStub = new TodoListStub();
  const result1 = await onClick(true, { text: 'test' }, todoListStub);
  const result2 = await onClick(false, { text: 'test' }, todoListStub);
  expect(result1).toEqual({ id: 0, text: 'test' });
  expect(result2).not.toEqual({ id: 0, text: 'test' });
});
