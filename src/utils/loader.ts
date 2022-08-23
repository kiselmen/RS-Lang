import { BASE_URL } from "../interfaces";

async function load(endpoint = "", method = { method : "GET" }) {
  try {
    const url = BASE_URL + endpoint;
    const response = await fetch(url, method);
    const data = response.status === 200 ? await response.json() : response;
    // const data = await response.json();
    const status = response.status;
    
    return { data, status };  

  } catch(error) {
    console.log(error);
    
    throw new Error("Can not fetch data");
  }
}

export { load } ;