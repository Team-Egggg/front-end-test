const wait = (second: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), second);
  });

export async function get(url: string) {
  await wait(1000);
  return url;
}
