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
