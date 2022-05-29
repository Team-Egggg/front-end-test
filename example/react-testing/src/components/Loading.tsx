function Loading({ isLoading }: { isLoading: boolean }) {
  return <p data-testid="loading">{isLoading ? "로딩중" : ""}</p>;
}

export default Loading;
