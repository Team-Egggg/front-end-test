import "@testing-library/jest-dom/extend-expect";
import { fireEvent, waitFor } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import axios from "axios";
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
  jest.mock("axios");
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
