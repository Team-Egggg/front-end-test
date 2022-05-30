# React-testing

이제 정말 실제로 많이 쓰이는 react를 이용해서 어떻게 실무에 적용할 수 있을지 알아보겠습니다.

## 환경설정

우선 환경설정을 먼저 해주겠습니다. 이부분은 create-react-app 대신에 vite를 이용하겠습니다.

### react 초기 설정

```
yarn create vite
```

만약 아래와 같은 에러가 뜬다면 node 버전을 16으로 낮춰서 진행하시면 됩니다.

```
error create-strapi-app@4.1.7: The engine "node" is incompatible with this module. Expected version ">=12.22.0 <=16.x.x". Got "17.3.1"
```

```
cd [프로젝트 명]
```

```
yarn dev
```

이제 터미널에 프로젝트이름과 여러가지 설정을 물어보게됩니다. 이때 프로젝트 이름을 고르고 `react` 와 `react-ts`를 골라줍니다.
그리고 정상적으로 실행되는지 `yarn dev`를 이용해서 로컬 서버를 띄워서 확인을 해줍니다.

### jest 설정

```
yarn add -D jest jest-environment-jsdom @babel/preset-env @babel/preset-react @babel/preset-typescript @testing-library/jest-dom @testing-library/react @testing-library/user-event
```

#### CRA를 안쓰는 이유

create-react-app을 사용하면 훨씬 편하고 간단하게 설정 할 수 있지만 실제로 jest를 이용해서 어떻게 react 설정을 하는지에 대한 이해가 있어야
CRA로 생성되지 않은 실무 나 문제가 생겼을때 해결하기 수월하다고 생각해서 CRA를 사용하지 않았습니다.

#### 디펜던시 간단 설명

- jest / 우리가 이전에 사용했던 테스팅 라이브러리인 jest입니다.
- jest-enviroment-jsdom / 실제 브라우저가 아닌 환경에서 react 컴포넌트를 테스트할 것이기 때문에 가상의 브라우저 환경을 설정해줍니다.
- @babel/preset-env / 간단하게 구버전의 es를 지원해주는 설정들을 모음 기본적으로 대부분의 babel 설정에 들어갑니다.
- @babel/preset-react / jsx문법을 가상dom으로 변경할때 필요한 설정 등 리액트 관련 설정들을 모음
- @babel/preset-typescript / 타입스크립트를 자바스크립트로 변환할때 필요한 설정들 모음
- @testing-library/jest-dom / jest에서 dom 조작에 도움을 주는 폴리필 ex) expect().toBeInTheDocument()
- @testing-library/react / react 컴포넌트를 테스트 할수 있게 해주는 라이브러리
- @testing-library/user-event / 클릭같은 사용자 입력을 할 수 있게 해주는 라이브러리

### babel 설정

jest를 실행할때 동작할 babel을 설정해줍니다. 루트 디렉토리에 `babel.config.js`를 만들고 아래 내용을 복사 붙여넣기를 합니다.

```javascript
// in /babel.config.js
module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};
```

이때 `["@babel/preset-react", { runtime: "automatic" }],` 이부분에서 runtime : automatic은 꼭 체크를 해주어야합니다.
예재 코드에서는 컴포넌트마다 import React를 해주지 않고 babel에서 알아서 자동으로 붙여주는 옵션입니다.

### jest 설정 파일 만들기

```javascript
// in /jest.config.js
module.exports = {
  testEnvironment: "jsdom",
};
```

아까 설치한 `jest-enviroment-jsdom`를 사용하겠다고 명시해줍니다. 명시를 안할 경우 document가 정의되지 않았다는 에러가 뜰겁니다.

## 컴포넌트 만들기

### Loading 컴포넌트

```tsx
function Loading({ isLoading }: { isLoading: boolean }) {
  return <p data-testid="loading">{isLoading ? "로딩중" : ""}</p>;
}

export default Loading;
```

isLoading이라는 props를 받아서 로딩중이면 로딩중이라는 글자를 렌더링하고 아니면 빈 글자를 렌더링하는 컴포넌트를 만들었습니다. 그리고 data-testid 라는 attribute가 있는데 테스트할때 class나 id로 잡는것보다 변경사항이 발생했을때 testid를 이용해서 dom을 잡는 것이
테스트 코드 수정을 덜 할수 있기때문에 data-testid로 loading이라는 속성을 붙여줍니다.

### Button 컴포넌트

```tsx
import { MouseEventHandler } from "react";

function Button({
  name,
  onClick,
}: {
  name: string;
  onClick: MouseEventHandler;
}) {
  return (
    <button data-testid="button" onClick={onClick}>
      {name}
    </button>
  );
}

export default Button;
```

name과 onClick props를 받아서 렌더링 되는 버튼의 이름과 클릭했을때 onClick함수가 실행되는 로직을 만들었습니다. 마찬가지로 data-testid로 button을 붙여줍니다.

### App 컴포넌트

```tsx
import { useState } from "react";
import getData from "./utils/getData";
import Button from "./components/Button";
import Loading from "./components/Loading";

const API_URL = "https://jsonplaceholder.typicode.com/todos/1";
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      await getData(API_URL);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button name="api가져오기" onClick={onClick} />
      <Loading isLoading={isLoading} />
    </>
  );
}
export default App;
```

App 컴포넌트에서는 Button과 Loading 컴포넌트에 props를 전달해주는 컨테이너 역할을 합니다. 지금 원하는 동작은 버튼을 눌렀을때 로딩중이라는
문구가 뜨고 api 요청을 보낸 뒤에 로딩중이라는 문구가 사라지는 동작입니다.

API_URL은 jsonplacehoder라는 곳에서 가짜 데이터를 가지고 오는 api를 사용했습니다.

## util 함수 만들기

api 통신을 위해 axios를 사용하겠습니다.

```
yarn add axios
```

### getData()

```ts
import axios from "axios";

async function getData(url: string) {
  const result = await axios.get(url);
  return result;
}

export default getData;
```

정말 간단하게 url을 입력하면 get 메서드로 데이터를 가지고 와서 반환하는 함수를 만들어줍니다.

## 테스트 코드 작성

### 테스트 항목

- [ ] Button 컴포넌트가 정상적으로 렌더링이 되는가?
- [ ] 처음에 Loading 컴포넌트가 정상적으로 빈 문자열로 렌더링 되는가?
- [ ] Button 컴포넌트를 눌렀을때 Loading 컴포넌트의 텍스트가 '로딩중'으로 변경되는가?
- [ ] api 요청이 끝난 뒤에 빈 문자열로 다시 돌아오는가?

테스트할 세가지 항목을 작성했습니다. 이제 항목에 대한 테스트 코드를 작성하겠습니다.

### Button 컴포넌트가 정상적으로 렌더링이 되는가?

```tsx
// in src/__test__/App.test.tsx
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import App from "../App";

it("버튼 컴포넌트가 렌더링 되어야한다.", () => {
  render(<App />);
  const buttonElement = screen.getByTestId("button");
  expect(buttonElement).toBeInTheDocument();
});
```

render함수를 이용해서 App 컴포넌트를 렌더링해줍니다. 그리고 data-testid가 button인 dom이 나오는지 screen.getByTestId를 가지고 찾습니다. 찾은 컴포넌트가 document에 들어있는지 expect().toBeIntheDocument()로 확인해주면 됩니다.
위에서 `import "@testing-library/jest-dom/extend-expect"` 이부분 때문에 expect 뒤에 좀 더 확장된 toBeInDocument를
사용할수 있게 되었습니다.

### 처음에 Loading 컴포넌트가 정상적으로 빈 문자열로 렌더링 되는가?

```tsx
// in src/__test__/App.test.tsx

it("처음에는 로딩 컴포넌트의 텍스트가 빈 문자열이여야 한다.", () => {
  render(<App />);
  const loadingEleemt = screen.getByTestId("loading");
  expect(loadingEleemt.textContent).toBe("");
});
```

이어서 해당 테스트도 동일하게 app 컴포넌트를 렌더링하고 testid가 loading인 dom을 잡아서 해당 dom의 textContent가 빈 문자열인지 확인합니다.

### Button 컴포넌트를 눌렀을때 Loading 컴포넌트의 텍스트가 '로딩중'으로 변경되는가?

위에는 조금 형식적인 테스트 였다면 이제부터는 조금은 유용한 테스트입니다. 먼저 해당 테스트를 하기 전에 axios에 대한 mock 작업을 해주어야합니다.
src폴더 안에 **mocks** 폴더를 만들고 거기에 axios.ts 파일을 생성해줍니다. 여기 생성한 파일이 테스트 환경에서 axios를 대신해서 동작해줄
mock 모듈이 됩니다.

```ts
// in /src/__mocks__/axios.ts

const wait = (second: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, second);
  });

async function get(url: string) {
  await wait(500);
  return url;
}

export default { get };
```

axios에서 get만 사용할 것이기 때문에 get함수만 만들어주겠습니다. 우선 api 응답대기에 필요한 프로미스롤 만들어줍니다. 그리고 0.5초를 대기했다가
url을 그대로 반환하는 함수를 만들어줍니다. 실제로 데이터를 가공하는 로직이 들어있다면 좀더 상세하게 써주어야하지만 지금 역할은 api 응답대기만 해주는
역할이기때문에 그냥 url을 반환했습니다.

```tsx
// in src/__test__/App.test.tsx

import { fireEvent, waitFor } from "@testing-library/react";
it("버튼을 누르면 로딩 컴포넌트의 텍스트가 로딩중으로 변경되어야 한다.", async () => {
  render(<App />);
  const buttonElement = screen.getByTestId("button");
  const loadingElement = screen.getByTestId("loading");
  fireEvent.click(buttonElement);
  await waitFor(() => {
    expect(loadingElement.textContent).toBe("로딩중");
  });
  await waitFor(() => {
    expect(loadingElement.textContent).toBe("");
  });
});
```

이제 버튼을 눌러주는 함수를 이용해서 버튼을 눌러주고 해당 값이 변경됬는지 기다려주는 함수를 이용해서 테스트 코드를 작성했습니다.
fireEvent.click(dom | node ..)을 이용해서 버튼을 눌러주면 setState에 의해 컴포넌트가 다시 렌더링이 되고 이떄 로딩중으로
변경이 되는데 바로 진행되는 것이 아니기 때문에 waitFor 함수내부에 콜백함수를 넣어서 특정 시간동안 지속적으로 반복을 합니다. 그러다
시간안에 테스트에 통과되는 조건이 발견되면 테스트가 통과하고 다음 라인을 실행합니다.
그리고 다시 waitFor함수를 이용해서 다시 빈 문자열이 되는지를 확인합니다.

> waitFor함수는 옵션으로 기다리는 시간을 조절할 수 있는데 기본값은 1초입니다.

### 완성된 테스트 코드

```tsx
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, waitFor } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  render(<App />);
});
it("버튼 컴포넌트가 렌더링 되어야한다.", () => {
  const buttonElement = screen.getByTestId("button");
  expect(buttonElement).toBeInTheDocument();
});

it("처음에는 로딩 컴포넌트의 텍스트가 빈 문자열이여야 한다.", () => {
  const loadingEleemt = screen.getByTestId("loading");
  expect(loadingEleemt.textContent).toBe("");
});

it("버튼을 누르면 로딩 컴포넌트의 텍스트가 로딩중으로 변경되어야 한다.", async () => {
  const buttonElement = screen.getByTestId("button");
  const loadingElement = screen.getByTestId("loading");
  fireEvent.click(buttonElement);
  await waitFor(() => {
    expect(loadingElement.textContent).toBe("로딩중");
  });
  await waitFor(() => {
    expect(loadingElement.textContent).toBe("");
  });
});
```

## 테스트 실행

```json
// /package.json

"scripts": {
    "test": "jest"
  }
```

해당 테스트를 실행하는 스크립트로 package.json에 만들어주고

```
yarn test
```

명령어를 입력하면 완성이 됩니다.

jest로 실행된 테스트에는 타입체킹은 빠져있습니다. 타입체킹까지 하고싶다면 `jest-ts`를 사용하시면 됩니다.
