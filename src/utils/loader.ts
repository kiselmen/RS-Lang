import { BASE_URL, elementData, statisticsData } from "../interfaces";

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

function createPutSettings() {
  return {
    method : "PUT",
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

const getWordById = async (id: string) => {
  const url = `words/${id}`;
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

const addWordToUserWords = async (word: elementData, type: string) => {
  const url = "users/" + localStorage.getItem("userId") + "/words/" + word.id;
  const method = createPostSettings();
  method.body = JSON.stringify({
    difficulty : type,
    optional : { total : 0, wrong : 0 }
  });
  const response = await load(url, method);
  if (response.status !== 200) {
    return [];
  } else {
    return response.data;
  }
};

const updateWordInUserWords = async (word: elementData, type: string) => {
  const wordId = word.id !== undefined ? word.id : word._id;
  const url = "users/" + localStorage.getItem("userId") + "/words/" + wordId;
  const method = createPutSettings();
  method.body = JSON.stringify({
    difficulty : type,
    optional : { total : 0, wrong : 0 }
  });
  const response = await load(url, method);
  if (response.status !== 200) {
    return [];
  } else {
    return response.data;
  }
};

const getAgregatedWordsByPage = async(page: number, wordPerPage: number) => {
  // eslint-disable-next-line quotes
  const url = "users/" + localStorage.getItem("userId") + '/aggregatedWords?page=' + String(page)+ '&wordsPerPage=' + wordPerPage + '&filter={"$and":[{"userWord.difficulty":"hard"}]}';
  const response = await load(url, createGetSettings());
  if (response.status !== 200) {
    return [];
  } else {
    return response.data[0];
  }
};

const getAllAgregatedWords = async(allPages: number, wordPerPage: number) => {
  let allData = [] as elementData[];
  for (let page = 0; page < allPages; page++){
    const currResult = await getAgregatedWordsByPage(page, wordPerPage);
    const curData = currResult.paginatedResults;

    allData = [...allData, ...curData];
  }
  return allData;
};

const removeWordFromDifficult = async (word: elementData) => {
  const wordId = word.id !== undefined ? word.id : word._id;
  const url = "users/" + localStorage.getItem("userId") + "/words/" + wordId;
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

const getUserStatistics = async (userID: string) => {
  const url = "users/" + userID + "/statistics";
  const method = createGetSettings();
  return await load(url, method);
};

const createUserStatistics = async (statisticsData: statisticsData) => {
  const url = "users/" + localStorage.getItem("userId") + "/statistics";
  const method = createPutSettings();
  method.body = JSON.stringify(statisticsData);
  return await load(url, method);
};

export {
  getWordsByChapterAndPage,
  getAlluserWords,
  addWordToUserWords,
  updateWordInUserWords,
  removeWordFromDifficult,
  getAgregatedWordsByPage,
  getAllAgregatedWords,
  registerUser,
  signInUser,
  getUserStatistics,
  createUserStatistics,
  preLoad,
  getWordById } ;