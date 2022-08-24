import { BASE_URL, elementData } from "../interfaces";

function createGetSettings() {
  return {
    method : "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  };
} 

function createPostSettings() {
  return {
    method : "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body : ""
  };
}

function createDeleteSettings() {
  return {
    method : "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body : ""
  };
}

async function preLoad() {
  const url = "users/" + localStorage.getItem("userId");
  const response = await load(url, createGetSettings());
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  }
}

async function load(endpoint = "", method = { method : "GET" }) {
  try {
    const url = BASE_URL + endpoint;
    const response = await fetch(url, method);
    const data = response.status === 200 ? await response.json() : response;
    const status = response.status;
    
    return { data, status };  

  } catch(error) {
    console.log(error);
    
    throw new Error("Can't fetch data");
  }
}

const getWordsByChapterAndPage = async (chapter = 1, page = 1) => {
  const url = "words?group=" + chapter + "&page=" + page;
  const response = await load(url, createGetSettings());
  if (response.status !== 200) {
    return [];
  } else {
    return response.data;
  }
};

const getAlluserWords = async () => {
  const url = "users/" + localStorage.getItem("userId") + "/words";
  const response = await load(url, createGetSettings());
  if (response.status !== 200) {
    return [];
  } else {
    return response.data;
  }
};

const addWordToDifficult = async (word: elementData) => {
  const url = "users/" + localStorage.getItem("userId") + "/words/" + word.id;
  const method = createPostSettings();
  method.body = JSON.stringify({
    difficulty : "hard",
    optional : { total : 0, wrong : 0 }
  });
  const response = await load(url, method);
  if (response.status !== 200) {
    return [];
  } else {
    return response.data;
  }
};

const removeWordFromDifficult = async (word: elementData) => {
  const url = "users/" + localStorage.getItem("userId") + "/words/" + word.id;
  const method = createDeleteSettings();
  await load(url, method);
};

const registerUser = async (userData: elementData) => {
  const url = "users";
  const method = createPostSettings();
  method.body = JSON.stringify(userData);
  return await load(url, method);     
};

const signInUser = async (userData: elementData) => {
  const url = "signin";
  const method = createPostSettings();
  method.body = JSON.stringify(userData);
  return await load(url, method);     
};

export { 
  getWordsByChapterAndPage, 
  getAlluserWords, 
  addWordToDifficult, 
  removeWordFromDifficult, 
  registerUser,
  signInUser,
  // load, 
  preLoad } ;