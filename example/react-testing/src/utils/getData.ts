import axios from "axios";

async function getData(url: string) {
  const result = await axios.get(url);
  return result;
}

export default getData;
